#!/usr/bin/env python3
"""1200x630 share card with exact text (code, not a generative model)."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "assets" / "web" / "hero-bungalow.jpg"
OUT = ROOT / "assets" / "web" / "og-image.jpg"
WEBP = ROOT / "assets" / "web" / "og-image.webp"
GEORGIA = Path("/System/Library/Fonts/Supplemental/Georgia.ttf")
GEORGIA_I = Path("/System/Library/Fonts/Supplemental/Georgia Italic.ttf")


def font(path, size):
    return ImageFont.truetype(str(path), size)


def main():
    im = Image.open(SRC).convert("RGB")
    # Crop to 1200x630 from upper-mid of the portrait
    w, h = im.size
    target_w, target_h = 1200, 630
    scale = max(target_w / w, target_h / h)
    nw, nh = int(w * scale), int(h * scale)
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - target_w) // 2
    top = int((nh - target_h) * 0.35)
    im = im.crop((left, top, left + target_w, top + target_h))

    overlay = Image.new("RGBA", im.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    d.rectangle((0, 360, 1200, 630), fill=(28, 22, 16, 210))
    im = im.convert("RGBA")
    im = Image.alpha_composite(im, overlay).convert("RGB")
    draw = ImageDraw.Draw(im)

    title_font = font(GEORGIA_I if GEORGIA_I.exists() else GEORGIA, 54)
    sub_font = font(GEORGIA, 22)
    draw.text((48, 390), "Rising Sun Bungalows", font=title_font, fill=(247, 240, 226))
    draw.text(
        (48, 470),
        "Gili Meno  ·  5 lumbung  ·  from 500.000 IDR",
        font=sub_font,
        fill=(232, 220, 200),
    )
    draw.text(
        (48, 510),
        "Operated by Meno Dive Club  ·  harbour-side stay",
        font=sub_font,
        fill=(201, 168, 108),
    )

    im.save(OUT, "JPEG", quality=86, optimize=True, progressive=True, subsampling=1)
    im.save(WEBP, "WEBP", quality=80, method=6)
    print("wrote", OUT, OUT.stat().st_size // 1024, "KB")
    print("wrote", WEBP, WEBP.stat().st_size // 1024, "KB")


if __name__ == "__main__":
    main()
