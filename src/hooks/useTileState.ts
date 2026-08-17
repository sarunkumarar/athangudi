import { useCallback, useEffect, useRef, useState } from 'react';
import type { CustomConfig, TileState } from '../motifs/types';
import { CUSTOM_ID, DEFAULT_CUSTOM, MOTIF_BY_ID, resolveMotif } from '../motifs';
import { applyColorway, defaultColorsFor } from '../lib/tileRender';
import { randomTileState } from '../lib/randomize';
import { COLORWAY_BY_ID } from '../palette/oxidePalette';

const STORAGE_KEY = 'athangudi.tile.v1';
const HEX_RE = /^#?[0-9a-fA-F]{6}$/;
const CUSTOM_KEYS: (keyof CustomConfig)[] = ['center', 'corner', 'edge', 'border'];

function normHex(v: string): string | null {
  if (!HEX_RE.test(v)) return null;
  return (v.startsWith('#') ? v : `#${v}`).toUpperCase();
}

function isKnownMotif(id: string | null | undefined): boolean {
  return !!id && (id === CUSTOM_ID || !!MOTIF_BY_ID[id]);
}

/** Element ids are short alphanumerics; keep them safe before trusting them. */
function safeElementId(v: string | null): string | null {
  return v && /^[a-zA-Z]{1,16}$/.test(v) ? v : null;
}

function sanitizeCustom(raw: unknown): CustomConfig {
  const cfg = { ...DEFAULT_CUSTOM };
  if (raw && typeof raw === 'object') {
    for (const key of CUSTOM_KEYS) {
      const v = (raw as Record<string, unknown>)[key];
      if (typeof v === 'string' && safeElementId(v)) cfg[key] = v;
    }
  }
  return cfg;
}

/** Default colours for a design (resolves the custom quarter when needed). */
function defaultColorsForState(state: TileState): Record<string, string> {
  return defaultColorsFor(resolveMotif(state));
}

/** Serialize a TileState into URL query params (?m=…&z_bg=…&c_center=…). */
function toParams(state: TileState): URLSearchParams {
  const p = new URLSearchParams();
  p.set('m', state.motifId);
  if (state.custom) {
    for (const key of CUSTOM_KEYS) p.set(`c_${key}`, state.custom[key]);
  }
  for (const [zone, hex] of Object.entries(state.colors)) {
    p.set(`z_${zone}`, hex.replace('#', ''));
  }
  return p;
}

/** Parse a TileState from URL params, validating every value. Null if absent. */
function fromParams(p: URLSearchParams): TileState | null {
  const motifId = p.get('m');
  if (!isKnownMotif(motifId)) return null;

  let base: TileState;
  if (motifId === CUSTOM_ID) {
    const custom: CustomConfig = { ...DEFAULT_CUSTOM };
    for (const key of CUSTOM_KEYS) {
      const v = safeElementId(p.get(`c_${key}`));
      if (v) custom[key] = v;
    }
    base = { motifId, colors: {}, custom };
  } else {
    base = { motifId: motifId!, colors: {} };
  }

  const colors = defaultColorsForState(base);
  for (const zone of resolveMotif(base).zones) {
    const raw = p.get(`z_${zone.id}`);
    if (raw) {
      const hex = normHex(raw);
      if (hex) colors[zone.id] = hex;
    }
  }
  return { ...base, colors };
}

function sanitizeColors(colors: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(colors)) {
    if (typeof v === 'string') {
      const hex = normHex(v);
      if (hex) out[k] = hex;
    }
  }
  return out;
}

function loadInitial(): TileState {
  // 1. URL wins (shared links must restore exactly).
  if (typeof window !== 'undefined') {
    const fromUrl = fromParams(new URLSearchParams(window.location.search));
    if (fromUrl) return fromUrl;
    // 2. localStorage (repeat visits).
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as TileState;
        if (parsed?.motifId && isKnownMotif(parsed.motifId) && parsed.colors) {
          const base: TileState =
            parsed.motifId === CUSTOM_ID
              ? { motifId: CUSTOM_ID, colors: {}, custom: sanitizeCustom(parsed.custom) }
              : { motifId: parsed.motifId, colors: {} };
          return {
            ...base,
            colors: { ...defaultColorsForState(base), ...sanitizeColors(parsed.colors) },
          };
        }
      }
    } catch {
      /* ignore corrupt storage */
    }
  }
  // 3. A fresh random design.
  return randomTileState();
}

export interface UseTileState {
  state: TileState;
  setDesign: (state: TileState) => void;
  setMotif: (motifId: string) => void;
  setCustom: (config: CustomConfig) => void;
  setZoneColor: (zoneId: string, hex: string) => void;
  setShapePaint: (shapeKey: string, hex: string) => void;
  clearPaintOverrides: () => void;
  applyColorwayId: (colorwayId: string) => void;
  randomize: () => void;
  reset: () => void;
  shareUrl: string;
}

/** Per-motif memory: the last colours (and custom config) seen for each motif
 *  id, so switching away and back restores exactly where the user left off
 *  instead of resetting to the motif's default colourway. */
type MotifHistory = Record<
  string,
  { colors: Record<string, string>; custom?: CustomConfig; paintOverrides?: Record<string, string> }
>;

export function useTileState(): UseTileState {
  const [state, setState] = useState<TileState>(loadInitial);
  const [shareUrl, setShareUrl] = useState('');
  const historyRef = useRef<MotifHistory>({});

  // Remember every design change against its motif id.
  useEffect(() => {
    historyRef.current[state.motifId] = {
      colors: state.colors,
      custom: state.custom,
      paintOverrides: state.paintOverrides,
    };
  }, [state]);

  // Persist to localStorage + URL on every change.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage may be unavailable (private mode) */
    }
    const params = toParams(state);
    const url = `${window.location.pathname}?${params.toString()}`;
    // Don't spam history — replaceState keeps the URL shareable without entries.
    window.history.replaceState(null, '', url);
    setShareUrl(window.location.origin + url);
  }, [state]);

  const setDesign = useCallback((next: TileState) => {
    if (!isKnownMotif(next.motifId)) return;
    setState({
      motifId: next.motifId,
      colors: { ...next.colors },
      ...(next.custom ? { custom: { ...next.custom } } : {}),
    });
  }, []);

  const setMotif = useCallback((motifId: string) => {
    const prior = historyRef.current[motifId];
    if (motifId === CUSTOM_ID) {
      const custom = prior?.custom ?? { ...DEFAULT_CUSTOM };
      const base: TileState = { motifId: CUSTOM_ID, colors: {}, custom };
      setState({ ...base, colors: prior?.colors ?? defaultColorsForState(base), paintOverrides: prior?.paintOverrides });
      return;
    }
    const base: TileState = { motifId, colors: {} };
    setState({ motifId, colors: prior?.colors ?? defaultColorsForState(base), paintOverrides: prior?.paintOverrides });
  }, []);

  const setCustom = useCallback((config: CustomConfig) => {
    setState((s) => {
      const next: TileState = { motifId: CUSTOM_ID, colors: {}, custom: config };
      // Preserve colours for zones that still exist; default any new zones.
      const base = defaultColorsForState(next);
      const merged: Record<string, string> = {};
      for (const zone of resolveMotif(next).zones) {
        merged[zone.id] = s.colors[zone.id] ?? base[zone.id];
      }
      // The custom quarter's shape list changes shape, so per-instance paint
      // overrides from before no longer address the right shapes.
      return { ...next, colors: merged };
    });
  }, []);

  const setZoneColor = useCallback((zoneId: string, hex: string) => {
    const norm = normHex(hex);
    if (!norm) return;
    setState((s) => ({ ...s, colors: { ...s.colors, [zoneId]: norm } }));
  }, []);

  const setShapePaint = useCallback((shapeKey: string, hex: string) => {
    const norm = normHex(hex);
    if (!norm) return;
    setState((s) => ({ ...s, paintOverrides: { ...s.paintOverrides, [shapeKey]: norm } }));
  }, []);

  const clearPaintOverrides = useCallback(() => {
    setState((s) => ({ ...s, paintOverrides: {} }));
  }, []);

  const applyColorwayId = useCallback((colorwayId: string) => {
    const cw = COLORWAY_BY_ID[colorwayId];
    if (!cw) return;
    setState((s) => ({ ...s, colors: applyColorway(resolveMotif(s), cw) }));
  }, []);

  const randomize = useCallback(() => setState(randomTileState()), []);

  const reset = useCallback(() => {
    setState((s) => ({ ...s, colors: defaultColorsForState(s), paintOverrides: {} }));
  }, []);

  return {
    state,
    setDesign,
    setMotif,
    setCustom,
    setZoneColor,
    setShapePaint,
    clearPaintOverrides,
    applyColorwayId,
    randomize,
    reset,
    shareUrl,
  };
}
