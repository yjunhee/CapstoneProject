import asyncio, json, base64, websockets, torch, io, os, time
from PIL import Image

import torchvision.transforms as T
from modeltest_v2.models.wrn import *
from huggingface_hub import hf_hub_download

REPO_ID = "SoftwareJun/wrn-cifar-100-sam"
FILENAME = "ckpt.pth" 

transform = T.Compose([
    T.Resize(32),
    T.ToTensor(),
    T.Normalize(mean=[0.5071, 0.4867, 0.4408],
                std=[0.2675, 0.2565, 0.2761]),
])

class Identity(torch.nn.Module):
    def forward(self, x):
        return x
    

class PersistentMatcher:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"[{time.strftime('%H:%M:%S')}] 모델 로드 중...)")

        self.model = wideresnet()
        model_path = hf_hub_download(repo_id=REPO_ID, filename=FILENAME)
        checkpoint = torch.load(model_path, map_location=self.device)
        state_dict = checkpoint['net']
        state_dict = {k.replace('module.', ''): v for k, v in state_dict.items()}

        self.model.load_state_dict(state_dict)  
        self.model.fc = Identity()
        self.model.to(self.device)
        self.model.eval()

        base_dir = os.path.dirname(os.path.abspath(__file__))
        self.emb_dir = os.path.abspath(os.path.join(base_dir, "./public/emb")) 
        
        self.embedding_dict = {} 
        self.load_all_embeddings() 

        self.match_threshold = 0.80
        print(f"[{time.strftime('%H:%M:%S')}] 서버 준비 완료")

    def load_all_embeddings(self):
        """emb 폴더 안의 모든 .pt 파일을 읽어 ID별로 메모리에 저장합니다."""
        if not os.path.exists(self.emb_dir):
            print(f"⚠️ 경고: 임베딩 폴더가 없습니다 -> {self.emb_dir}")
            return

        print(f"📦 [{time.strftime('%H:%M:%S')}] 임베딩 파일들을 메모리에 로드하는 중...")
        for file_name in os.listdir(self.emb_dir):
            if file_name.endswith(".pt"):
                user_id = os.path.splitext(file_name)[0] 
                file_path = os.path.join(self.emb_dir, file_name)
                
                self.embedding_dict[user_id] = torch.load(file_path, map_location=self.device)
        
        print(f"✅ 총 {len(self.embedding_dict)}개의 타겟 임베딩 로드 완료 (등록된 ID: {list(self.embedding_dict.keys())})")

    async def run_forever(self):
        uri = "ws://localhost:5000/ws/python"
        while True:
            try:
                async with websockets.connect(uri, ping_interval=None, max_size=10 * 1024 * 1024) as websocket:
                    print(f"[{time.strftime('%H:%M:%S')}] 백엔드 서버와 연결됨")

                    await websocket.send(json.dumps({
                        "status": "서버연결 성공",
                        "score": 0,
                        "is_match": False
                    }))
                    
                    while True:
                        message = await websocket.recv()

                        try:
                            while True:
                                message = await asyncio.wait_for(websocket.recv(), timeout=0.01)
                        except asyncio.TimeoutError:
                            pass 

                        data = json.loads(message)
                        if 'image' not in data: continue

                        current_id = data.get('id', None) 
                        
                        target_emb = self.embedding_dict[current_id]

                        img_data = base64.b64decode(data['image'].split(',')[1])
                        pil_img = Image.open(io.BytesIO(img_data)).convert("RGB")
                        
                        with torch.no_grad():
                            x = transform(pil_img).unsqueeze(0).to(self.device)  
                            features = self.model(x).squeeze(0)
                            features = features / features.norm()

                        score = (features @ target_emb).item()
                        is_match = score > self.match_threshold

                        result = {
                            "score": float(score),
                            "status": "Holding" if is_match else "Searching", 
                            "is_match": is_match,
                            "id": current_id
                        }
                        await websocket.send(json.dumps(result))
                        
                        print(f"[{time.strftime('%H:%M:%S')}] ID: {current_id} | Score: {score:.4f} | Match: {is_match}")
                        await asyncio.sleep(0.5) 
            except Exception as e:
                print(f"[{time.strftime('%H:%M:%S')}] 연결 오류: {e} 재시도중")
                await asyncio.sleep(5)

if __name__ == "__main__":
    matcher = PersistentMatcher()
    asyncio.run(matcher.run_forever())
