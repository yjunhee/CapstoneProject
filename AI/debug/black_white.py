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
        print(f" Error: {img_id} is not a tensor → {type(embedding)}")
        return
    save_path = os.path.join(emb_dir, f"{img_id}.pt")
    torch.save(embedding.cpu(), save_path)
    print(f" Saved → {save_path}")

def generate_and_get_embedding(model, color_type, noise_std=0.05):
    """
    Generates a synthetic image (black or white), applies normalization,
    adds Gaussian noise, and returns the embedding.
    """
    try:
        if color_type == "black":
            img = Image.new("RGB", (32, 32), color=(0, 0, 0))
        elif color_type == "white":
            img = Image.new("RGB", (32, 32), color=(255, 255, 255))
        else:
            raise ValueError("Invalid color type. Choose 'black' or 'white'.")

        x = transform(img).unsqueeze(0).to(device)  
        
        noise = torch.randn_like(x) * noise_std
        x = x + noise
        
        with torch.no_grad():
            out = model(x).squeeze(0)
            out = out / out.norm()                        
        return out
    except Exception as e:
        print(f"❌ Error processing {color_type} image with noise: {e}")
        return None

def main():
    model = wideresnet()
    model_path = hf_hub_download(repo_id=REPO_ID, filename=FILENAME)
    checkpoint = torch.load(model_path, map_location=device)
    state_dict = {k.replace('module.', ''): v for k, v in checkpoint['net'].items()}

    model.load_state_dict(state_dict)  
    model.fc = Identity()
    model.to(device)
    model.eval()

    print("Generating and processing completely black image with Gaussian noise...")
    black_embedding = generate_and_get_embedding(model, "black", noise_std=0.05)
    if black_embedding is not None:
        print(f"Black embedding shape: {black_embedding.shape}")
        save_embedding(EMBEDDING_DIR, "guassian_black", black_embedding)

    print("-" * 40)

    print("Generating and processing completely white image with Gaussian noise...")
    white_embedding = generate_and_get_embedding(model, "white", noise_std=0.05)
    if white_embedding is not None:
        print(f"White embedding shape: {white_embedding.shape}")
        save_embedding(EMBEDDING_DIR, "guassian_white", white_embedding)

    print("\n🎉 Done.")

if __name__ == "__main__":
    main()