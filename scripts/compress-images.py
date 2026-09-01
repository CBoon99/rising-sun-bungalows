#!/usr/bin/env python3
"""Compress assets/web JPEGs in place and write WebP + 800w variants."""
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "assets" / "web"
META = ROOT / "lib" / "image-meta.json"

MAX_LONG = 1400
THUMB_W = 800
JPEG_Q = 76
WEBP_Q = 70
OG_JPEG_Q = 82
OG_WEBP_Q = 76


def save_jpeg(im: Image.Image, path: Path, quality: int) -> None:
    im.convert("RGB").save(
        path,
        "JPEG",
        quality=quality,
        optimize=True,
        progressive=True,
        subsampling=2,
    )


def save_webp(im: Image.Image, path: Path, quality: int) -> None:
    im.convert("RGB").save(path, "WEBP", quality=quality, method=6)


def fit(im: Image.Image, max_long: int) -> Image.Image:
    w, h = im.size
    long_edge = max(w, h)
    if long_edge <= max_long:
        return im
    scale = max_long / long_edge
    size = (int(round(w * scale)), int(round(h * scale)))
    return im.resize(size, Image.Resampling.LANCZOS)


def width_fit(im: Image.Image, width: int) -> Image.Image:
    w, h = im.size
    if w <= width:
        return im
    scale = width / w
    return im.resize((width, int(round(h * scale))), Image.Resampling.LANCZOS)


def main() -> None:
    meta = {}
    sources = sorted(
        p
        for p in WEB.glob("*.jpg")
        if not p.name.endswith("-800.jpg")
    )
    for src in sources:
        im = Image.open(src)
        if im.mode not in ("RGB", "L"):
            im = im.convert("RGB")
        stem = src.stem
        is_og = stem == "og-image"

        if is_og:
            full = im
            jpeg_q, webp_q = OG_JPEG_Q, OG_WEBP_Q
        else:
            full = fit(im, MAX_LONG)
            jpeg_q, webp_q = JPEG_Q, WEBP_Q

        save_jpeg(full, src, jpeg_q)
        save_webp(full, WEB / f"{stem}.webp", webp_q)

        thumb = width_fit(full, THUMB_W)
        save_jpeg(thumb, WEB / f"{stem}-800.jpg", jpeg_q)
        save_webp(thumb, WEB / f"{stem}-800.webp", webp_q)

        fw, fh = full.size
        tw, th = thumb.size
        key = f"/assets/web/{src.name}"
        meta[key] = {
            "w": fw,
            "h": fh,
            "tw": tw,
            "th": th,
            "full_kb": round(src.stat().st_size / 1024, 1),
            "webp_kb": round((WEB / f"{stem}.webp").stat().st_size / 1024, 1),
        }
        print(
            f"{src.name:32s} {fw}x{fh}  jpg {meta[key]['full_kb']:6.1f} KB  "
            f"webp {meta[key]['webp_kb']:6.1f} KB"
        )

    META.parent.mkdir(exist_ok=True)
    META.write_text(json.dumps(meta, indent=2) + "\n")
    total = sum(WEB.glob("*.jpg").__iter__() and (p.stat().st_size for p in WEB.glob("*.jpg") if "-800" not in p.name))
    print("wrote", META)


if __name__ == "__main__":
    main()
