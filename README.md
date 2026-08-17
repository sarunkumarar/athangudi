# Athangudi · Tile Pattern Studio

A responsive web app celebrating the 500-year-old handmade tile craft of
**Athangudi** village, Karaikudi (Chettinad region, Tamil Nadu, India).

- **Landing** — the whole viewport fills, edge-to-edge, with a randomly
  generated Athangudi-style tile repeated like real flooring. The pattern _is_
  the hero.
- **Studio** — an interactive editor: pick a motif, recolour each zone of the
  tile by tapping it, and watch a live floor preview update instantly.

## The authenticity mechanic

Real Athangudi tiles are handmade by pouring oxide pigment into a stencil on a
glass sheet, which is why the edges are crisp and the colours flat and matte. A
tile's motif is built from **one quarter-design mirrored across both the
vertical and horizontal axis** — reflected, never merely rotated. That produces
the symmetric, kaleidoscopic result.

This is implemented literally: every motif (`src/motifs/*.ts`) defines shapes
for a single 50×50 quadrant, and [`TileSVG`](src/components/TileSVG.tsx) renders
that quarter four times with the transforms `identity`, `scale(-1,1)`,
`scale(1,-1)`, `scale(-1,-1)`. The `Chevron Weave` motif is the clearest proof:
its quarter is just parallel diagonal stripes, which the mirror turns into
crisp V's — a rotation would have produced a pinwheel instead.

## Stack

Vite + React + TypeScript + Tailwind CSS. Tile geometry is inline **SVG** (crisp
at any DPI, trivially recolourable by swapping `fill`s, and export/raster
friendly). Static output — no backend.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + static build into dist/
npm run preview
```

## Content

- **6 motifs** — geometric: Star Medallion, Diamond Lattice, Chevron Weave;
  floral: Lotus Bloom, Curling Vine, Framed Floret.
- **6 oxide colorways** + 15 named oxide swatches (`src/palette/oxidePalette.ts`)
  — brick red, bottle green, cobalt/indigo, mustard/ochre, charcoal, cream.

## How state works

A design is a single serializable `TileState` (`{ motifId, colors }`). It is
persisted to `localStorage` and encoded into the URL query string
(`?m=…&z_bg=…&z_petal=…`), so any design is shareable by link and restored
exactly on reload. Restore precedence: URL → localStorage → fresh random.

## Export

The single tile (PNG 1000², or SVG) and a 4×4 floor swatch (PNG) can be
downloaded — the file a customer would actually send to a tile maker. Rendering
goes through a pure SVG-string builder (`src/lib/tileRender.ts`) → `Image` →
`<canvas>` → PNG blob.

## Architecture

```
src/
  motifs/        type defs + one file per motif (quarter path data + named zones) + registry
  palette/       oxide swatches and curated colorways
  lib/           tileRender (pure SVG string/geometry), exportTile, randomize
  components/    TileSVG, FloorGrid, MotifPicker, ColorPicker, ControlPanel,
                 RandomizeButton, ExportButton, Landing, Studio
  hooks/         useTileState (persist + URL), useViewportGrid (fill math)
  App.tsx        landing ⇄ studio
```

## Phase 2 readiness (floor visualizer)

Deliberately not built, but the seams are cut for it:

- `TileSVG` is a **pure** function of `(motifId, colors)` with no DOM-measuring
  side effects, so it can be rasterised and fed into a canvas perspective
  transform to warp the tile onto a photo of a real floor.
- Tile config lives in one `TileState` object, ready to hand to a new
  visualizer route without touching the editor.
