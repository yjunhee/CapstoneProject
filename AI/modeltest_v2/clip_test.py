import torch
import torchvision.transforms as T
from transformers import CLIPProcessor, CLIPModel
from PIL import Image

PATH_0 = 'img/stephen.jpg'
PATH_1 = 'img/leesunshin2.jpg'

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

def forward(model, processor, img):
    inputs = processor(images=img, return_tensors="pt").to(device)
    with torch.no_grad():
        out = model.get_image_features(**inputs)
        if hasattr(out, "pooler_output"): out = out.pooler_output
    out = out.squeeze(0)
    out = out / out.norm()                        
    return out

def main():
    model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
    processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
    model.to(device)
    model.eval()

    img_0 = Image.open(PATH_0).convert('RGB')    
    img_1 = Image.open(PATH_1).convert('RGB')

    out_0 = forward(model, processor, img_0)
    out_1 = forward(model, processor, img_1)

    score = (out_0 @ out_1).item()               
    print(f"Cosine similarity: {score:.4f}")

if __name__ == '__main__':
    main()
