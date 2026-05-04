from __future__ import annotations

import json
import math
import shutil
from datetime import datetime
from pathlib import Path

from PIL import Image, ImageDraw


REPO_ROOT = Path(__file__).resolve().parents[2]
COMFY_ROOT = Path("D:/ComfyUI")
BATCH_DIR = COMFY_ROOT / "rbr_grassland_v2_batch"
FINAL_DIR = BATCH_DIR / "final"
CANDIDATE_DIR = REPO_ROOT / "public" / "assets" / "candidates" / "visual"

LOW_W = 256
LOW_H = 144
SCALE = 4
OUT_W = LOW_W * SCALE
OUT_H = LOW_H * SCALE
GROUND_LINE_Y = 426
SAFE_RIDER_ZONE = {"xMin": 410, "xMax": 640, "yMin": 250, "yMax": 486}


LAYERS = [
    {
        "id": "grassland_v2_sky_open_plain_001",
        "layer": "sky",
        "subLayer": "L0",
        "role": "sky_base",
        "transparent": False,
        "parallax": 0.03,
        "timeVariants": ["dawn", "noon", "dusk", "night"],
        "weatherCompatible": ["clear", "cloudy", "wind", "rain"],
    },
    {
        "id": "grassland_v2_atmosphere_soft_haze_001",
        "layer": "atmosphere",
        "subLayer": "L1",
        "role": "celestial_atmosphere",
        "transparent": True,
        "parallax": 0.06,
        "timeVariants": ["dawn", "noon", "dusk"],
        "weatherCompatible": ["clear", "cloudy", "wind", "rain"],
    },
    {
        "id": "grassland_v2_far_silhouette_pale_ridge_001",
        "layer": "far",
        "subLayer": "L2",
        "role": "far_silhouette",
        "transparent": True,
        "parallax": 0.18,
        "timeVariants": ["dawn", "noon", "dusk", "night"],
        "weatherCompatible": ["clear", "cloudy", "wind", "rain"],
    },
    {
        "id": "grassland_v2_far_detail_low_cloud_001",
        "layer": "far_detail",
        "subLayer": "L3",
        "role": "far_detail",
        "transparent": True,
        "parallax": 0.32,
        "timeVariants": ["dawn", "noon", "dusk"],
        "weatherCompatible": ["clear", "cloudy", "wind"],
    },
    {
        "id": "grassland_v2_mid_scenery_meadow_rolls_001",
        "layer": "mid",
        "subLayer": "L4",
        "role": "mid_scenery",
        "transparent": True,
        "parallax": 0.56,
        "timeVariants": ["dawn", "noon", "dusk", "night"],
        "weatherCompatible": ["clear", "cloudy", "wind", "rain"],
    },
    {
        "id": "grassland_v2_ground_back_meadow_base_001",
        "layer": "ground_back",
        "subLayer": "L5",
        "role": "ground_back",
        "transparent": True,
        "parallax": 0.82,
        "timeVariants": ["dawn", "noon", "dusk", "night"],
        "weatherCompatible": ["clear", "cloudy", "wind", "rain"],
    },
    {
        "id": "grassland_v2_playable_ground_strip_001",
        "layer": "ground",
        "subLayer": "L6",
        "role": "playable_ground_strip",
        "transparent": True,
        "parallax": 1.0,
        "timeVariants": ["dawn", "noon", "dusk", "night"],
        "weatherCompatible": ["clear", "cloudy", "wind", "rain"],
    },
    {
        "id": "grassland_v2_foreground_occluders_sparse_grass_001",
        "layer": "foreground",
        "subLayer": "L8",
        "role": "foreground_occluders",
        "transparent": True,
        "parallax": 1.22,
        "timeVariants": ["dawn", "noon", "dusk", "night"],
        "weatherCompatible": ["clear", "cloudy", "wind", "rain"],
    },
]


def rgba(color: str, alpha: int = 255) -> tuple[int, int, int, int]:
    color = color.lstrip("#")
    return tuple(int(color[i : i + 2], 16) for i in (0, 2, 4)) + (alpha,)


def new_layer(opaque: bool = False) -> Image.Image:
    if opaque:
        return Image.new("RGBA", (LOW_W, LOW_H), rgba("#a2c9d8"))
    return Image.new("RGBA", (LOW_W, LOW_H), (0, 0, 0, 0))


def hill_points(base: float, amp: float, phase: float, amp2: float = 0, phase2: float = 0) -> list[tuple[int, int]]:
    points: list[tuple[int, int]] = []
    for x in range(LOW_W + 1):
        t = (x / LOW_W) * math.tau
        y = base + math.sin(t + phase) * amp + math.sin(t * 2 + phase2) * amp2
        points.append((x, round(y)))
    return points


def fill_periodic_hill(draw: ImageDraw.ImageDraw, base: float, amp: float, phase: float, fill, bottom: int = LOW_H, amp2: float = 0, phase2: float = 0) -> None:
    points = hill_points(base, amp, phase, amp2, phase2)
    draw.polygon([(0, bottom), *points, (LOW_W, bottom)], fill=fill)


def draw_cloud(draw: ImageDraw.ImageDraw, x: int, y: int, color, scale: int = 1) -> None:
    parts = [
        (x, y + 3 * scale, x + 24 * scale, y + 9 * scale),
        (x + 5 * scale, y, x + 17 * scale, y + 10 * scale),
        (x + 13 * scale, y + 1 * scale, x + 29 * scale, y + 11 * scale),
        (x + 23 * scale, y + 4 * scale, x + 42 * scale, y + 10 * scale),
    ]
    for part in parts:
        draw.ellipse(part, fill=color)


def draw_wrapped_rect(draw: ImageDraw.ImageDraw, x: int, y0: int, x1: int, y1: int, fill) -> None:
    width = x1 - x
    for offset in (-LOW_W, 0, LOW_W):
        draw.rectangle((x + offset, y0, x + width + offset, y1), fill=fill)


def render_sky() -> Image.Image:
    img = new_layer(True)
    draw = ImageDraw.Draw(img, "RGBA")
    for y in range(LOW_H):
        t = y / max(1, LOW_H - 1)
        r = round(145 + (215 - 145) * t)
        g = round(190 + (224 - 190) * t)
        b = round(207 + (195 - 207) * t)
        draw.line((0, y, LOW_W, y), fill=(r, g, b, 255))
    draw_cloud(draw, 24, 20, rgba("#e7eadc", 128), 1)
    draw_cloud(draw, 118, 28, rgba("#e1e7d8", 100), 1)
    draw_cloud(draw, 206, 18, rgba("#edf0e4", 92), 1)
    return img


def render_atmosphere() -> Image.Image:
    img = new_layer()
    draw = ImageDraw.Draw(img, "RGBA")
    draw.ellipse((176, 18, 208, 50), fill=rgba("#f0d48b", 54))
    draw.ellipse((183, 25, 200, 42), fill=rgba("#f6e6a9", 98))
    draw.rectangle((0, 73, LOW_W, 86), fill=rgba("#dbe4d1", 34))
    draw.rectangle((0, 88, LOW_W, 94), fill=rgba("#f0e5bd", 22))
    return img


def render_far_silhouette() -> Image.Image:
    img = new_layer()
    draw = ImageDraw.Draw(img, "RGBA")
    fill_periodic_hill(draw, 86, 8, 0.2, rgba("#8ca7aa", 190), amp2=4, phase2=1.1)
    fill_periodic_hill(draw, 92, 5, 2.4, rgba("#9cb4aa", 145), amp2=2, phase2=0.4)
    return img


def render_far_detail() -> Image.Image:
    img = new_layer()
    draw = ImageDraw.Draw(img, "RGBA")
    for x, y, w in [(16, 76, 36), (82, 82, 28), (154, 77, 42), (224, 83, 31)]:
        draw_wrapped_rect(draw, x, y, x + w, y + 2, rgba("#d8dfcf", 50))
    fill_periodic_hill(draw, 98, 3, 1.8, rgba("#789b88", 70), amp2=2, phase2=2.0)
    return img


def render_mid_scenery() -> Image.Image:
    img = new_layer()
    draw = ImageDraw.Draw(img, "RGBA")
    fill_periodic_hill(draw, 104, 8, 1.1, rgba("#82a06a", 205), amp2=3, phase2=1.7)
    fill_periodic_hill(draw, 113, 5, 3.4, rgba("#73925f", 185), amp2=2, phase2=0.1)
    for x in [18, 42, 106, 152, 209, 238]:
        draw_wrapped_rect(draw, x, 91, x + 2, 107, rgba("#5c7354", 115))
        draw.ellipse((x - 5, 84, x + 8, 94), fill=rgba("#6f8663", 92))
    return img


def render_ground_back() -> Image.Image:
    img = new_layer()
    draw = ImageDraw.Draw(img, "RGBA")
    fill_periodic_hill(draw, 117, 3, 0.4, rgba("#6f8b50", 225), amp2=2, phase2=2.0)
    draw.rectangle((0, 119, LOW_W, LOW_H), fill=rgba("#668048", 235))
    for x in range(0, LOW_W, 16):
        y = 120 + ((x * 7) % 5)
        draw_wrapped_rect(draw, x, y, x + 7, y + 1, rgba("#89a45d", 92))
    return img


def render_playable_ground() -> Image.Image:
    img = new_layer()
    draw = ImageDraw.Draw(img, "RGBA")
    draw.rectangle((0, 104, LOW_W, 113), fill=rgba("#93a863", 120))
    draw.rectangle((0, 112, LOW_W, 128), fill=rgba("#9a9869", 238))
    draw.rectangle((0, 128, LOW_W, LOW_H), fill=rgba("#5f7742", 236))
    for x in range(0, LOW_W, 8):
        color = rgba("#b6b07a", 94) if (x // 8) % 2 == 0 else rgba("#7c8053", 78)
        draw_wrapped_rect(draw, x, 115 + (x % 3), x + 4, 116 + (x % 3), color)
    for x in range(2, LOW_W, 13):
        draw.line((x, 111, x + 2, 105), fill=rgba("#536d3a", 135))
        draw.line((x + 1, 111, x + 5, 106), fill=rgba("#6c8446", 115))
    return img


def render_foreground() -> Image.Image:
    img = new_layer()
    draw = ImageDraw.Draw(img, "RGBA")
    for x in range(0, LOW_W, 11):
        height = 8 + ((x * 5) % 13)
        alpha = 168 if (x // 11) % 3 else 96
        draw.line((x, LOW_H, x + 2, LOW_H - height), fill=rgba("#354d30", alpha), width=1)
        draw.line((x + 2, LOW_H, x + 7, LOW_H - max(4, height - 5)), fill=rgba("#46643b", alpha - 28), width=1)
    for x in [34, 88, 172, 226]:
        draw_wrapped_rect(draw, x, 135, x + 10, 137, rgba("#2f472e", 104))
    return img


RENDERERS = {
    "sky": render_sky,
    "atmosphere": render_atmosphere,
    "far": render_far_silhouette,
    "far_detail": render_far_detail,
    "mid": render_mid_scenery,
    "ground_back": render_ground_back,
    "ground": render_playable_ground,
    "foreground": render_foreground,
}


def upscale(img: Image.Image) -> Image.Image:
    return img.resize((OUT_W, OUT_H), Image.Resampling.NEAREST)


def checker(size: tuple[int, int]) -> Image.Image:
    img = Image.new("RGBA", size, rgba("#1a201d"))
    draw = ImageDraw.Draw(img)
    step = 16
    for y in range(0, size[1], step):
        for x in range(0, size[0], step):
            if ((x // step) + (y // step)) % 2 == 0:
                draw.rectangle((x, y, x + step - 1, y + step - 1), fill=rgba("#232b26"))
    return img


def draw_rider_placeholder(img: Image.Image) -> None:
    draw = ImageDraw.Draw(img, "RGBA")
    x = 512
    y = GROUND_LINE_Y + 18
    draw.rectangle((x - 118, 250, x + 118, 486), outline=rgba("#f3e7a4", 82), width=3)
    draw.rectangle((x - 112, GROUND_LINE_Y - 18, x + 102, GROUND_LINE_Y + 22), fill=rgba("#171514", 232))
    draw.rectangle((x - 154, GROUND_LINE_Y - 4, x - 105, GROUND_LINE_Y + 21), fill=rgba("#171514", 232))
    draw.rectangle((x + 93, GROUND_LINE_Y - 4, x + 150, GROUND_LINE_Y + 21), fill=rgba("#171514", 232))
    draw.rectangle((x - 22, GROUND_LINE_Y - 72, x + 18, GROUND_LINE_Y - 20), fill=rgba("#241f1d", 238))
    draw.polygon([(x - 28, GROUND_LINE_Y - 46), (x - 88, GROUND_LINE_Y - 18), (x - 26, GROUND_LINE_Y - 10)], fill=rgba("#211c1b", 230))


def save_contact_sheets(outputs: dict[str, Image.Image]) -> None:
    rows = []
    label_height = 24
    thumb_w = 256
    thumb_h = 144
    for item in LAYERS:
        img = outputs[item["id"]]
        isolated = checker((OUT_W, OUT_H))
        isolated.alpha_composite(img)
        thumb = isolated.resize((thumb_w, thumb_h), Image.Resampling.NEAREST)
        seam = Image.new("RGBA", (thumb_w * 3, thumb_h), rgba("#111613"))
        seam.alpha_composite(thumb, (0, 0))
        seam.alpha_composite(thumb, (thumb_w, 0))
        seam.alpha_composite(thumb, (thumb_w * 2, 0))
        row = Image.new("RGBA", (thumb_w * 4, thumb_h + label_height), rgba("#111613"))
        draw = ImageDraw.Draw(row)
        draw.text((6, 5), f'{item["subLayer"]} {item["id"]}', fill=rgba("#edf1e6"))
        row.alpha_composite(thumb, (0, label_height))
        row.alpha_composite(seam, (thumb_w, label_height))
        rows.append(row)

    sheet = Image.new("RGBA", (thumb_w * 4, len(rows) * (thumb_h + label_height)), rgba("#111613"))
    y = 0
    for row in rows:
        sheet.alpha_composite(row, (0, y))
        y += row.height
    sheet.convert("RGB").save(BATCH_DIR / "grassland_v2_layer_and_seam_contact_sheet.jpg", quality=92)

    composition = Image.new("RGBA", (OUT_W, OUT_H), (0, 0, 0, 0))
    for item in LAYERS:
        composition.alpha_composite(outputs[item["id"]])
    draw_rider_placeholder(composition)
    composition.convert("RGB").save(BATCH_DIR / "grassland_v2_composition_preview.jpg", quality=94)

    seam_comp = Image.new("RGBA", (OUT_W * 3, OUT_H), rgba("#111613"))
    for i in range(3):
        seam_comp.alpha_composite(composition, (OUT_W * i, 0))
    seam_comp.resize((OUT_W * 3 // 2, OUT_H // 2), Image.Resampling.NEAREST).convert("RGB").save(
        BATCH_DIR / "grassland_v2_composition_3x_seam_preview.jpg", quality=92
    )


def manifest_item(item: dict) -> dict:
    return {
        "id": item["id"],
        "type": "visual",
        "assetKind": "visual_layer",
        "role": item["role"],
        "biome": "grassland",
        "layer": item["layer"],
        "subLayer": item["subLayer"],
        "path": f'/assets/candidates/visual/{item["id"]}.png',
        "width": OUT_W,
        "height": OUT_H,
        "transparent": item["transparent"],
        "tileableX": True,
        "tileableY": False,
        "parallax": item["parallax"],
        "groundLineY": GROUND_LINE_Y,
        "safeRiderZone": SAFE_RIDER_ZONE,
        "timeVariants": item["timeVariants"],
        "weatherCompatible": item["weatherCompatible"],
        "status": "pending",
        "review": {
            "readability": None,
            "seamlessX": None,
            "styleMatch": None,
            "lowFatigue": None,
            "approved": False,
        },
        "notes": "Grassland v2 engineered first-playable layer. Deterministic Pillow asset; pending manual review while used by runtime for playable validation.",
        "tags": ["engineered", "pixel-art-inspired", "parallax", "grassland", "v2", item["subLayer"]],
    }


def write_reports(items: list[dict]) -> None:
    now = datetime.now().isoformat(timespec="seconds")
    report = [
        "# Run Boy Run Grassland V2 Batch Report",
        "",
        f"- Date/time: {now}",
        f"- Batch workspace: `{BATCH_DIR}`",
        "- Generation path: deterministic Pillow low-resolution pixel pass, scaled 4x.",
        f"- Resolution: `{OUT_W}x{OUT_H}`",
        f"- Candidate count: {len(items)}",
        f"- Candidate folder: `{CANDIDATE_DIR}`",
        "- Runtime policy: used directly for first-playable grassland while still pending review.",
        "",
        "## Outputs",
        "",
        "- `grassland_v2_layer_and_seam_contact_sheet.jpg`",
        "- `grassland_v2_composition_preview.jpg`",
        "- `grassland_v2_composition_3x_seam_preview.jpg`",
        "- `candidateManifest_draft.json`",
        "",
        "## Layer Files",
        "",
    ]
    for item in items:
        report.append(f'- `{item["subLayer"]}` `{item["id"]}.png` - {item["role"]}, parallax `{item["parallax"]}`')
    (BATCH_DIR / "RUN_REPORT.md").write_text("\n".join(report) + "\n", encoding="utf-8")

    review = [
        "# Style Review",
        "",
        "## Batch",
        "",
        "- Grassland v2 first-playable engineered asset batch.",
        "- All layers are horizontally tileable and semantically separated.",
        "- Rider safe zone is intentionally sparse and low contrast.",
        "",
        "## Review Checklist",
        "",
        "- Is each image restricted to one layer role?",
        "- Does the 3x seam preview hide the horizontal join?",
        "- Is the rider readable over the playable ground strip?",
        "- Does motion feel calm for a long session?",
        "- Are weather/time tints still readable?",
        "",
        "## Next Delta",
        "",
        "- More: single-layer ComfyUI replacements only after this baseline is playable.",
        "- Less: dense flowers, high contrast grass noise, baked-in weather.",
        "- Keep: stable ground baseline, sparse foreground, broad low-fatigue sky.",
    ]
    (BATCH_DIR / "STYLE_REVIEW.md").write_text("\n".join(review) + "\n", encoding="utf-8")


def main() -> None:
    FINAL_DIR.mkdir(parents=True, exist_ok=True)
    CANDIDATE_DIR.mkdir(parents=True, exist_ok=True)

    outputs: dict[str, Image.Image] = {}
    items = [manifest_item(item) for item in LAYERS]

    for item in LAYERS:
        img = upscale(RENDERERS[item["layer"]]())
        outputs[item["id"]] = img
        final_path = FINAL_DIR / f'{item["id"]}.png'
        candidate_path = CANDIDATE_DIR / f'{item["id"]}.png'
        img.save(final_path)
        shutil.copyfile(final_path, candidate_path)

    save_contact_sheets(outputs)
    (BATCH_DIR / "candidateManifest_draft.json").write_text(
        json.dumps({"version": 1, "items": items}, indent=2) + "\n",
        encoding="utf-8",
    )
    write_reports(items)
    print(f"Generated {len(items)} grassland v2 layers in {BATCH_DIR}")


if __name__ == "__main__":
    main()
