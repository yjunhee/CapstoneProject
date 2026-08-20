import torch
import torchvision.transforms as T
from PIL import Image
from models.resnet import *

PATH_0 = 'img/stephen.jpg'
PATH_1 = 'img/sejong.jpg'
MODEL_PATH = 'checkpoint/resnet56/ckpt.pth'

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

transform = T.Compose([
    T.Resize(32),
    T.ToTensor(),
    T.Normalize(mean=[0.5071, 0.4867, 0.4408],
                std=[0.2675, 0.2565, 0.2761]),
])

class Identity(torch.nn.Module):
    def forward(self, x):
        return x

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
    model = resnet56()
    checkpoint = torch.load(MODEL_PATH, map_location=device)
    state_dict = checkpoint['net']
 
    state_dict = {k.replace('module.', ''): v for k, v in state_dict.items()}

    model.load_state_dict(state_dict)
    model.linear = Identity()
    model.to(device)
    model.eval()

    img_0 = Image.open(PATH_0).convert('RGB')   
    img_1 = Image.open(PATH_1).convert('RGB')

    with torch.no_grad():
        out_0 = forward(model, img_0)
        out_1 = forward(model, img_1)

    score = (out_0 @ out_1).item()               
    print(f"Cosine similarity: {score:.4f}")

if __name__ == '__main__':
    main()
