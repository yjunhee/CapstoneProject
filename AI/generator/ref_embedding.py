import os
import csv
import torch
import torchvision.transforms as T
from PIL import Image
from wrn import *
from huggingface_hub import hf_hub_download

REPO_ID = "SoftwareJun/wrn-cifar-100-sam"
FILENAME = "ckpt.pth" 

device = "cuda" if torch.cuda.is_available() else "cpu"

transform = T.Compose([
    T.Resize(32),
    T.ToTensor(),
    T.Normalize(mean=[0.5071, 0.4867, 0.4408],
                std=[0.2675, 0.2565, 0.2761]),
])

class Identity(torch.nn.Module):
    def forward(self, x):
        return x


IMG_PATH = "../public/img"
EMBEDDING_DIR = "../public/emb"


def get_image_paths(image_dir):
    valid_extensions = (".jpg")
    data_list = []
    id_list = []

    for file_name in os.listdir(image_dir):
        if file_name.lower().endswith(valid_extensions):
            full_path = os.path.join(image_dir, file_name)
            data_list.append(full_path)

            name_without_ext = os.path.splitext(file_name)[0]
            id_list.append(name_without_ext)

    return data_list, id_list


def save_embedding(emb_dir, img_id, embedding):
    os.makedirs(emb_dir, exist_ok=True)

    save_path = os.path.join(emb_dir, f"{img_id}.pt")
    torch.save(embedding.cpu(), save_path)  
    print(f"Saved → {save_path}")


def forward(model, img):
    crop_size = min(img.size)  
    x = T.Compose([
        T.CenterCrop(crop_size),
        transform,
    ])(img).unsqueeze(0).to(device)  
    out = model(x).squeeze(0)
    out = out / out.norm()                        
    return out


def main():
    model = wideresnet()
    model_path = hf_hub_download(repo_id=REPO_ID, filename=FILENAME)
    checkpoint = torch.load(model_path, map_location=device)
    state_dict = checkpoint['net']

    state_dict = {k.replace('module.', ''): v for k, v in state_dict.items()}
    model.load_state_dict(state_dict)  
    model.fc = Identity()
    model.to(device)
    model.eval()

    data_list, id_list = get_image_paths(IMG_PATH)

    for img_path, img_id in zip(data_list, id_list):
        with torch.no_grad():
            img = Image.open(img_path).convert("RGB")
            embedding = forward(model, img)


        if embedding is None:
            continue

        save_embedding(EMBEDDING_DIR, img_id, embedding)

    print("\n 작업이 완료되었습니다.")


if __name__ == "__main__":
    main()
