#Frontend : centercrop min(image.height, image.width) ,
# --> resize 256x256 
# --> JPEG 1.5 , 1.0 이어도 2개밖에 오류 안뜸.

#Python : resize 32 x 32 --->normalize . Done




import os
import io
import torch
import torch.nn.functional as F
import torchvision.transforms as T
from PIL import Image
from models.wrn import *
from huggingface_hub import hf_hub_download

REPO_ID = "SoftwareJun/wrn-cifar-100-sam"
FILENAME = "ckpt.pth" 
IMAGE_DIR = "./img"        
EMB_DIR = "./emb"     
THRESHOLD = 0.95

device = "cuda" if torch.cuda.is_available() else "cpu"

model_transform = T.Compose([
    T.Resize(32),
    T.ToTensor(),
    T.Normalize(mean=[0.5071, 0.4867, 0.4408],
                std=[0.2675, 0.2565, 0.2761]),
])

class Identity(torch.nn.Module):
    def forward(self, x):
        return x

def preprocess_exactly_like_new_frontend(image_path, jpeg_quality=0.80):
    """
    Mimics the new optimized frontend workflow:
    1. Center crops to min(width, height)
    2. Resizes straight to 32x32
    3. Saves as JPEG
    """
    img = Image.open(image_path).convert('RGB')
    w, h = img.size
    crop_size = min(w, h)
    
    left = (w - crop_size) / 2
    top = (h - crop_size) / 2
    right = (w + crop_size) / 2
    bottom = (h + crop_size) / 2
    img_cropped = img.crop((left, top, right, bottom))
    
    img_resized = img_cropped.resize((256, 256), Image.Resampling.BILINEAR)
    
    buffer = io.BytesIO()
    img_resized.save(buffer, format="JPEG", quality=int(jpeg_quality * 100))
    buffer.seek(0)
    
    return Image.open(buffer)

def main():
    model = wideresnet()
    model_path = hf_hub_download(repo_id=REPO_ID, filename=FILENAME)
    checkpoint = torch.load(model_path, map_location=device)
    state_dict = {k.replace('module.', ''): v for k, v in checkpoint['net'].items()}
    model.load_state_dict(state_dict)  
    model.fc = Identity()
    model.to(device)
    model.eval()

    if not os.path.exists(IMAGE_DIR) or not os.path.exists(EMB_DIR):
        print(f"❌ Error: Ensure directories exist:\nImage: {IMAGE_DIR}\nEmb: {EMB_DIR}")
        return

    low_similarity_list = []
    print("--- Starting New Frontend (32x32 Crop -> JPEG) Pipeline Test ---")
    
    for img_filename in os.listdir(IMAGE_DIR):
        if not img_filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            continue
            
        landmark_id = os.path.splitext(img_filename)[0]
        pt_path = os.path.join(EMB_DIR, f"{landmark_id}.pt")
        img_path = os.path.join(IMAGE_DIR, img_filename)

        if not os.path.exists(pt_path):
            print(f"⚠️ Reference embedding missing for {img_filename}. Skipping.")
            continue

        try:
            target_emb = torch.load(pt_path, map_location=device).view(-1)
            
            frontend_simulated_img = preprocess_exactly_like_new_frontend(img_path, jpeg_quality=0.10)
            
            with torch.no_grad():
                x = model_transform(frontend_simulated_img).unsqueeze(0).to(device)
                
                features = model(x).squeeze(0)
                features = features / features.norm()

            similarity_score = torch.dot(features, target_emb).item()
            print(f"ID: {landmark_id:<10} | Similarity Score: {similarity_score:.4f}")

            if similarity_score < THRESHOLD:
                low_similarity_list.append((landmark_id, similarity_score))

        except Exception as e:
            print(f"❌ Error processing ID {landmark_id}: {e}")

    print("\n" + "="*50)
    print(f"🚨 Results Below {THRESHOLD}:")
    print("="*50)
    
    if low_similarity_list:
        for landmark_id, score in low_similarity_list:
            print(f"❌ ID: {landmark_id:<10} (Score: {score:.4f})")
    else:
        print("✅ Success! Every single processed file scored above 0.7.")

if __name__ == "__main__":
    main()