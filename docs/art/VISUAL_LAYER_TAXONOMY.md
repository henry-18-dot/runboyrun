# Visual Layer Taxonomy

Run Boy Run uses semantic side-scrolling layers. ComfyUI or any generator may create candidate images, but the renderer and review process decide whether a layer is usable.

## Canonical Layers

| Sub-layer | Runtime layer | Role | Notes |
| --- | --- | --- | --- |
| L0 | sky | sky_base | Opaque sky plate, low contrast, no land or rider. |
| L1 | atmosphere | celestial_atmosphere | Sun, moon, haze, soft cloud glow; transparent when possible. |
| L2 | far | far_silhouette | Distant mountains or tree line; low detail. |
| L3 | far_detail | far_detail | Optional distant accents and haze. |
| L4 | mid | mid_scenery | Main biome identity, kept clear of rider readability. |
| L5 | ground_back | ground_back | Connects scenery to playable surface; no collision meaning. |
| L6 | ground | playable_ground_strip | Strict baseline and hoof contact readability. |
| L7 | rider | rider_horse | Runtime character layer; never baked into backgrounds. |
| L8 | foreground | foreground_occluders | Sparse near-camera occlusion only. |
| L9 | overlay | weather_particles_color | Procedural or looped tint/weather above world layers. |
| L10 | ui | ui | Interface only. |

## Manifest Contract

Visual layer candidates should include:

```json
{
  "id": "grassland_v2_playable_ground_strip_001",
  "type": "visual",
  "assetKind": "visual_layer",
  "biome": "grassland",
  "layer": "ground",
  "subLayer": "L6",
  "role": "playable_ground_strip",
  "path": "/assets/candidates/visual/grassland_v2_playable_ground_strip_001.png",
  "width": 1024,
  "height": 576,
  "transparent": true,
  "tileableX": true,
  "parallax": 1,
  "groundLineY": 426,
  "safeRiderZone": { "xMin": 410, "xMax": 640, "yMin": 250, "yMax": 486 },
  "status": "pending"
}
```

## First-Playable Default

Grassland v2 is allowed to be used by runtime while still marked `pending`, because it is an engineered baseline for playability validation. Future AI-generated replacements still go through candidate review before becoming the default art set.
