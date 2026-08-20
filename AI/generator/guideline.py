import os
import json
import numpy as np

from PIL import Image
from rembg import remove

IMG_DIR = "../public/img"
GUIDELINE_DIR = "../public/guideline"
JSON_DIR = "jsons"

CANVAS_SIZE = 1024
OBJECT_HEIGHT_RATIO = 0.70
PADDING_RATIO = 0.08


def ensure_directories():
    """
    Create output directories if missing.
    """
    os.makedirs(GUIDELINE_DIR, exist_ok=True)
    os.makedirs(JSON_DIR, exist_ok=True)


def remove_background(img):
    """
    Remove background and force RGBA.
    """
    result = remove(img)

    if isinstance(result, bytes):
        import io
        result = Image.open(io.BytesIO(result))

    return result.convert("RGBA")


def get_alpha_bbox(img_rgba):
    """
    Find foreground bounding box
    using alpha channel.
    """
    arr = np.array(img_rgba)

    alpha = arr[:, :, 3]

    mask = alpha > 10

    ys, xs = np.where(mask)

    if len(xs) == 0:
        raise ValueError("Foreground not found")

    x1 = xs.min()
    x2 = xs.max()

    y1 = ys.min()
    y2 = ys.max()

    return x1, y1, x2, y2


def crop_foreground(img_rgba):
    """
    Tight crop with padding.
    """
    x1, y1, x2, y2 = get_alpha_bbox(img_rgba)

    bw = x2 - x1
    bh = y2 - y1

    pad_x = int(bw * PADDING_RATIO)
    pad_y = int(bh * PADDING_RATIO)

    x1 = max(0, x1 - pad_x)
    y1 = max(0, y1 - pad_y)

    x2 = min(img_rgba.width, x2 + pad_x)
    y2 = min(img_rgba.height, y2 + pad_y)

    return img_rgba.crop((x1, y1, x2, y2))


def make_guide(cropped):
    """
    Standardize object placement
    onto canonical transparent canvas.
    """
    canvas = Image.new(
        "RGBA",
        (CANVAS_SIZE, CANVAS_SIZE),
        (0, 0, 0, 0)
    )

    obj_w, obj_h = cropped.size

    target_h = int(
        CANVAS_SIZE * OBJECT_HEIGHT_RATIO
    )

    scale = target_h / obj_h

    new_w = int(obj_w * scale)
    new_h = int(obj_h * scale)

    resized = cropped.resize(
        (new_w, new_h),
        Image.LANCZOS
    )

    # center horizontally
    x = (CANVAS_SIZE - new_w) // 2

    # slightly lower than top
    y = int(CANVAS_SIZE * 0.15)

    canvas.paste(
        resized,
        (x, y),
        resized
    )

    metadata = {
        "canvas_size": CANVAS_SIZE,
        "object_box": {
            "x": x / CANVAS_SIZE,
            "y": y / CANVAS_SIZE,
            "width": new_w / CANVAS_SIZE,
            "height": new_h / CANVAS_SIZE
        }
    }

    return canvas, metadata


def process_image(path):
    filename = os.path.basename(path)
    stem = os.path.splitext(filename)[0]

    print(f"\nProcessing: {filename}")

    # 1. Load image
    img = Image.open(path).convert("RGB")

    # 2. Remove background
    print("Removing background...")
    rgba = remove_background(img)

    # 3. Crop object
    print("Cropping foreground...")
    cropped = crop_foreground(rgba)

    # 4. Standardize guide
    print("Generating guide...")
    guide, metadata = make_guide(cropped)

    # 5. Save outputs
    guide_path = os.path.join(
        GUIDELINE_DIR,
        f"{stem}.png"
    )

    json_path = os.path.join(
        JSON_DIR,
        f"{stem}.json"
    )

    guide.save(guide_path)

    with open(json_path, "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"Saved: {guide_path}")
    print(f"Saved: {json_path}")


def main():
    ensure_directories()

    image_files = sorted([
        f for f in os.listdir(IMG_DIR)
        if f.lower().endswith(
            (".png", ".jpg", ".jpeg")
        )
    ])

    if not image_files:
        print("No images found in img/")
        return

    print(f"Found {len(image_files)} images")

    for filename in image_files:
        process_image(
            os.path.join(IMG_DIR, filename)
        )

    print("\nAll processing completed.")


if __name__ == "__main__":
    main()