from pathlib import Path
from PIL import Image
from torchvision.transforms import CenterCrop

PATH = "img"
OUTPUT_PATH = "phone_imgs"

TARGET_W = 2522
TARGET_H = 4000


def main():
    input_dir = Path(PATH)
    output_dir = Path(OUTPUT_PATH)
    output_dir.mkdir(exist_ok=True)

    crop = CenterCrop((TARGET_H, TARGET_W))

    image_exts = {".jpg", ".jpeg", ".png", ".JPG", ".JPEG", ".PNG"}

    images = [
        p for p in input_dir.iterdir()
        if p.suffix in image_exts
    ]

    for img_path in images:
        try:
            img = Image.open(img_path).convert("RGB")

            w, h = img.size

            if h < TARGET_H or w < TARGET_W:
                scale = max(
                    TARGET_W / w,
                    TARGET_H / h
                )

                new_w = int(w * scale)
                new_h = int(h * scale)

                img = img.resize(
                    (new_w, new_h),
                    Image.Resampling.LANCZOS
                )

            img = crop(img)

            print(img.size)

            save_path = output_dir / img_path.name
            img.save(save_path)

        except Exception as e:
            print(f"Failed: {img_path} -> {e}")


if __name__ == "__main__":
    main()