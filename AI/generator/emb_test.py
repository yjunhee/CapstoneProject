import os
import torch
import torchvision.transforms as T
from PIL import Image
from models.wrn import *
from huggingface_hub import hf_hub_download

REPO_ID = "SoftwareJun/wrn-cifar-100-sam"
FILENAME = "ckpt.pth" 
EMBEDDING_DIR = "./reference_embeddings"

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

def save_embedding(emb_dir, img_id, embedding):
    os.makedirs(emb_dir, exist_ok=True)
    if not torch.is_tensor(embedding):
        print(f"❌ Error: {img_id} is not a tensor → {type(embedding)}")
        return
    save_path = os.path.join(emb_dir, f"{img_id}.pt")
    torch.save(embedding.cpu(), save_path)
    print(f"Saved → {save_path}")

def get_embedding(model, img_path):
    """Loads image, processes it, and returns the normalized embedding."""
    try:
        img = Image.open(img_path).convert('RGB')
        crop_size = min(img.size)  
        x = T.Compose([
            T.CenterCrop(crop_size),
            transform,
        ])(img).unsqueeze(0).to(device)  
        
        with torch.no_grad():
            out = model(x).squeeze(0)
            out = out / out.norm()                        
        return out
    except Exception as e:
        print(f"Error processing {img_path}: {e}")
        return None

def main(specific_img_path, specific_img_id):
    model = wideresnet()
    model_path = hf_hub_download(repo_id=REPO_ID, filename=FILENAME)
    checkpoint = torch.load(model_path, map_location=device)
    state_dict = {k.replace('module.', ''): v for k, v in checkpoint['net'].items()}

    model.load_state_dict(state_dict)  
    model.fc = Identity()
    model.to(device)
    model.eval()

    print(f"Processing: {specific_img_path}...")
    embedding = get_embedding(model, specific_img_path)
    print(embedding.shape)
    if embedding is not None:
        save_embedding(EMBEDDING_DIR, specific_img_id, embedding)
        print("\n Done.")

if __name__ == "__main__":
    IMAGE_PATH = "tar.PNG"
    IMAGE_ID = "tar1"

    main(IMAGE_PATH, IMAGE_ID)