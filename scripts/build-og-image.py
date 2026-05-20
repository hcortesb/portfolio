"""Build a 1200x630 Open Graph social card from the source portrait.

Run from repo root: python3 scripts/build-og-image.py
Outputs: images/og-image.jpg (1200x630, ~150 KB)
"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

# ── Canvas ─────────────────────────────────────────────────────
W, H = 1200, 630

# ── Brand palette (matches style.css) ──────────────────────────
BG      = (250, 250, 247)  # #FAFAF7
INK     = (10, 9, 9)        # #0A0909
MUTED   = (140, 135, 128)   # #8C8780
ACCENT  = (138, 106, 64)    # #8A6A40
BORDER  = (221, 217, 210)   # #DDD9D2

# ── Fonts (Lora ≈ Cormorant Garamond, Poppins ≈ Inter) ─────────
ROOT = Path(__file__).resolve().parent.parent
FONTS = '/usr/share/fonts/truetype/google-fonts'
serif       = ImageFont.truetype(f'{FONTS}/Lora-Variable.ttf', 76)
serif_it    = ImageFont.truetype(f'{FONTS}/Lora-Italic-Variable.ttf', 36)
sans_med    = ImageFont.truetype(f'{FONTS}/Poppins-Medium.ttf', 16)
sans_light  = ImageFont.truetype(f'{FONTS}/Poppins-Light.ttf', 16)
sans_small  = ImageFont.truetype(f'{FONTS}/Poppins-Medium.ttf', 13)

# ── Canvas + left-side portrait ────────────────────────────────
canvas = Image.new('RGB', (W, H), BG)
portrait = Image.open(ROOT / 'images' / 'camilo_anchico_00_2000.jpeg')

IMG_W, IMG_H = 540, H
src_w, src_h = portrait.size
target_ratio = IMG_W / IMG_H
src_ratio = src_w / src_h

# Crop with top bias (keep the face)
if src_ratio < target_ratio:
    # source is taller than target — crop bottom
    new_h = int(src_w / target_ratio)
    portrait = portrait.crop((0, 0, src_w, new_h))
else:
    # source is wider — crop sides equally
    new_w = int(src_h * target_ratio)
    left = (src_w - new_w) // 2
    portrait = portrait.crop((left, 0, left + new_w, src_h))

portrait = portrait.resize((IMG_W, IMG_H), Image.LANCZOS)
canvas.paste(portrait, (0, 0))

# ── Right-side text composition ────────────────────────────────
draw = ImageDraw.Draw(canvas)
PAD_L = IMG_W + 60      # 600
PAD_T = 90

def tracked(draw, xy, text, font, fill, spacing=2):
    """Draw text with manual letter-spacing (px between glyphs)."""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        bbox = draw.textbbox((x, y), ch, font=font)
        x = bbox[2] + spacing

# Eyebrow (uppercase, tracked)
tracked(draw, (PAD_L, PAD_T), 'FASHION MODEL · BARCELONA, SPAIN', sans_med, MUTED, spacing=2)

# Name (serif, large)
draw.text((PAD_L, PAD_T + 50), 'Camilo Anchico', font=serif, fill=INK)

# Subtitle (serif italic, accent)
draw.text((PAD_L, PAD_T + 140), 'Fashion Model', font=serif_it, fill=ACCENT)

# Short accent line
LINE_Y = PAD_T + 215
draw.line([(PAD_L, LINE_Y), (PAD_L + 60, LINE_Y)], fill=INK, width=2)

# Tagline (longer SEO line wrapped onto two visual rows)
tracked(draw, (PAD_L, LINE_Y + 30), 'EDITORIAL · CAMPAIGNS · E-COMMERCE · RUNWAY', sans_small, INK, spacing=2)

# Sub-tagline beneath
draw.text((PAD_L, LINE_Y + 60), 'For brands, agencies, and casting directors.', font=sans_light, fill=MUTED)

# Bottom-right domain
tracked(draw, (PAD_L, H - 70), 'CAMILOANCHICOMODEL.COM', sans_small, INK, spacing=3)

# ── Save ───────────────────────────────────────────────────────
out = ROOT / 'images' / 'og-image.jpg'
canvas.save(out, quality=88, optimize=True, progressive=True)
print(f'Wrote {out}  ({out.stat().st_size // 1024} KB)')
