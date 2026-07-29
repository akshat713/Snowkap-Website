#!/usr/bin/env python3
"""
Build the client logo wall assets from the two source sets in this repo.

    python3 scripts/normalise-logos.py

Reads  public/assets/logos/*.png          full-colour artwork flattened onto an
                                          opaque black or #222222 rectangle
       public/assets/logos/white/*.png     white knockout artwork on transparent
Writes public/assets/logos/mark/*.png      ink silhouettes, normalised, at 2x


Why this script exists
----------------------
Neither source set can be used directly on a light page:

  * The colour set has no transparency at all — every file is an opaque
    rectangle, so on a white ground each logo renders as a dark tile.
  * The white set is pure white on transparent, so on a white ground it is
    invisible.

They are also incomplete in opposite directions. The white set is missing
exactly the logos whose artwork is dark (chiratae, daimler, mahle), because a
white knockout of dark artwork has nothing to knock out. So the two are
complementary, and this takes the alpha from whichever source actually has it.

Everything is then rendered as a single-colour silhouette. That is not a
stylistic preference, it is forced by the source material: measured across the
recovered colour artwork, ten of twenty logos fall below 3:1 contrast on white
while daimler and mahle are pure black, so no single background can carry the
set in colour. One ink colour gives every logo identical contrast and removes
the clash between a near-white wordmark and a black one. If consistent artwork
with real transparency ever arrives, the colour can be kept by pasting the
source RGB through the mask instead of INK in build().


Equal visual weight
-------------------
Logos are normalised on the *area of their bounding box*, not their height.
Setting a 7:1 wordmark to the same height as a square roundel gives it seven
times the footprint, and it reads as seven times the endorsement — this is the
usual reason a logo wall looks lopsided.

A damped density correction then nudges very sparse marks up and very solid ones
down, because footprint alone still leaves a thin outline reading lighter than a
filled block. It is deliberately clamped so it stays a nudge.

Each logo is finally centred in an identical transparent box, so the markup can
use one fixed-size container and the alignment is guaranteed by the asset rather
than by per-logo CSS.
"""

import math
import os
import pathlib
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is required:  pip install Pillow")

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC_COLOUR = ROOT / "public/assets/logos"
SRC_WHITE = ROOT / "public/assets/logos/white"
OUT = ROOT / "public/assets/logos/mark"

# The 21 logos the site actually references, from CLIENT_SECTORS in
# src/data/content.js. Files in the source directories that nothing references
# (NRB.png, afri-east-1.png, v3.png) are ignored rather than silently shipped.
LOGOS = [
    "african-eastern", "anthem", "ather", "cherise", "chiratae", "daimler",
    "econovus", "fireside", "forstar", "himalaya", "jsw", "kingsinfra", "knpc",
    "mahle", "nrb", "rpg", "schaeffler", "senco", "sutherland", "tagros", "varun",
]

INK = (34, 34, 34)          # brand Dark grey
SCALE = 2                   # emitted at 2x for retina
# Every logo lands in this box, in CSS pixels. Kept only just larger than the
# largest placed mark (MAX_W x MAX_H below) — the canvas margin is scaled by
# object-contain along with the artwork, so a roomy canvas makes every logo
# render smaller than it was normalised to be. Markup should size the container
# at this aspect ratio: at 190x58 the marks appear exactly as measured here.
BOX_W, BOX_H = 190, 58

# Tuned by sweeping for the tightest footprint spread across this set; the
# result is 1.65x, down from 4.5x when normalising on height alone.
TARGET_AREA = 4600.0
DENSITY_REF = 0.19
DENSITY_EXP = 0.18
DENSITY_CLAMP = (0.85, 1.08)
MAX_W, MAX_H = 168.0, 46.0

# Distance from the background colour, in 0-255, over which a pixel ramps from
# transparent to fully opaque. Narrow on purpose: the artwork here is dark on
# black, so keying on brightness would make it faint. Anything meaningfully
# different from the background becomes solid, and the ramp only exists to keep
# anti-aliased edges smooth.
KEY_LO, KEY_HI = 6.0, 26.0


# The white knockouts encode *brightness* as alpha rather than true coverage, so
# a logo drawn in dark artwork came out as a faint, semi-transparent mask. Left
# alone, painting ink through it gives pale grey: measured on the first pass,
# solid marks like Fireside rendered at full strength while Daimler, Mahle,
# Chiratae and RPG sat at roughly a quarter opacity. Stretching each mask so its
# strong pixels reach full opaque is what makes every logo carry the same weight.
ALPHA_PCTL = 0.88   # this percentile of surviving alpha maps to 255
ALPHA_GAMMA = 0.62  # <1 firms up the midtones so strokes read solid, not smoky
ALPHA_MAX_GAIN = 12.0
# Several knockouts carry a faint wash across the whole canvas — a few units of
# alpha where there is no artwork at all. The gain below multiplies that into a
# visible grey plate behind the mark, which is what appeared behind Himalaya, RPG,
# Senco and Mahle on the first attempt. Discard it before measuring or scaling.
ALPHA_FLOOR = 24


def normalise_alpha(mask):
    floored = mask.point([0 if v <= ALPHA_FLOOR else v for v in range(256)])
    hist = floored.histogram()
    surviving = sum(hist[1:])
    if not surviving:
        return None
    # value at ALPHA_PCTL of the surviving distribution
    target, run, pivot = surviving * ALPHA_PCTL, 0, 255
    for value in range(1, 256):
        run += hist[value]
        if run >= target:
            pivot = value
            break
    gain = min(ALPHA_MAX_GAIN, 255.0 / max(pivot, 1))
    lut = [min(255, int(round(255.0 * ((min(255.0, v * gain) / 255.0) ** ALPHA_GAMMA))))
           for v in range(256)]
    for v in range(ALPHA_FLOOR + 1):
        lut[v] = 0
    return mask.point(lut)


def alpha_from_white_cut(path):
    """Coverage from the knockout's alpha channel, stretched to full strength."""
    im = Image.open(path).convert("RGBA")
    a = im.split()[3]
    if not a.getbbox():
        return None
    out = normalise_alpha(a)
    return out if out is not None and out.getbbox() else None


def alpha_from_colour_cut(path):
    """Key the flattened artwork against its own background rectangle."""
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    px = im.load()
    # The four corners are always outside the artwork; the darkest is the ground.
    bg = min([px[0, 0], px[w - 1, 0], px[0, h - 1], px[w - 1, h - 1]],
             key=lambda c: c[0] + c[1] + c[2])[:3]
    mask = Image.new("L", (w, h), 0)
    m = mask.load()
    for y in range(h):
        for x in range(w):
            r, g, b, _ = px[x, y]
            d = max(abs(r - bg[0]), abs(g - bg[1]), abs(b - bg[2]))
            if d <= KEY_LO:
                continue
            t = 1.0 if d >= KEY_HI else (d - KEY_LO) / (KEY_HI - KEY_LO)
            m[x, y] = int(round(t * 255))
    return mask if mask.getbbox() else None


def build():
    OUT.mkdir(parents=True, exist_ok=True)
    for stale in OUT.glob("*.png"):
        stale.unlink()

    rows, empty = [], []
    for name in LOGOS:
        white, colour = SRC_WHITE / f"{name}.png", SRC_COLOUR / f"{name}.png"
        source = "white"
        mask = alpha_from_white_cut(white) if white.exists() else None
        if mask is None and colour.exists():
            mask, source = alpha_from_colour_cut(colour), "colour(keyed)"
        if mask is None:
            empty.append(name)
            continue

        mask = mask.crop(mask.getbbox())
        aw, ah = mask.size
        ink_px = sum(i * c for i, c in enumerate(mask.histogram())) / 255.0
        density = ink_px / (aw * ah)

        scale = math.sqrt(TARGET_AREA / (aw * ah))
        corr = (DENSITY_REF / max(density, 0.01)) ** DENSITY_EXP
        scale *= min(DENSITY_CLAMP[1], max(DENSITY_CLAMP[0], corr))
        scale = min(scale, MAX_H / ah, MAX_W / aw)

        tw, th = max(1, round(aw * scale * SCALE)), max(1, round(ah * scale * SCALE))
        mask = mask.resize((tw, th), Image.LANCZOS)

        art = Image.new("RGBA", (tw, th), INK + (0,))
        art.putalpha(mask)
        canvas = Image.new("RGBA", (BOX_W * SCALE, BOX_H * SCALE), (0, 0, 0, 0))
        canvas.paste(art, ((BOX_W * SCALE - tw) // 2, (BOX_H * SCALE - th) // 2), art)
        canvas.save(OUT / f"{name}.png", optimize=True)

        rows.append((name, source, f"{aw}x{ah}", round(density, 2),
                     f"{tw // SCALE}x{th // SCALE}", (tw // SCALE) * (th // SCALE)))

    print(f"{'logo':<18}{'alpha from':<16}{'trimmed':<12}{'dens':>6}{'placed':>10}{'footprint':>11}")
    for r in rows:
        print(f"{r[0]:<18}{r[1]:<16}{r[2]:<12}{r[3]:>6}{r[4]:>10}{r[5]:>11}")

    areas = [r[5] for r in rows]
    print(f"\n{len(rows)} written to {OUT.relative_to(ROOT)}")
    print(f"footprint area: min {min(areas)} max {max(areas)} mean {sum(areas) // len(areas)} "
          f"spread {max(areas) / min(areas):.2f}x")
    total = sum(f.stat().st_size for f in OUT.glob('*.png'))
    print(f"total {total / 1024:.0f} kB")
    if empty:
        # ather.png is a solid black rectangle in the colour set and fully
        # transparent in the white set — there is no artwork in either file. The
        # markup renders a typographic lockup for anything listed here.
        print(f"\nNO ARTWORK IN EITHER SOURCE: {empty}")
        print("  -> these need `wordmark: true` in CLIENT_SECTORS, or real files dropping in.")


if __name__ == "__main__":
    build()
