# Asset Review Checklist

Use this checklist before approving any visual layer candidate.

## Required Checks

- The image belongs to exactly one semantic layer.
- The layer does not contain rider, horse, UI, text, logo, or baked-in weather unless the role explicitly allows it.
- `tileableX` layers hide the horizontal seam in the 3x preview.
- Transparent layers have clean edges and no matte residue.
- `groundLineY` matches the rider hoof contact line.
- The rider safe zone stays readable.
- The asset still reads after time/weather tint.
- Motion for 30 seconds feels calm and low fatigue.

## Highest Risk Layers

- `L4 mid_scenery`: often becomes too detailed and steals rider readability.
- `L6 playable_ground_strip`: must be stable, tileable, and readable before it is beautiful.
- `L8 foreground_occluders`: should be sparse; it is atmosphere, not a wall.

## Approval Rule

Do not approve an asset just because it looks good as a still image. Approve it only if it works as a moving side-scrolling layer.
