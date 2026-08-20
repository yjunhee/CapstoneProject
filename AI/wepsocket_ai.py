import asyncio, json, base64, websockets, torch, io, os, time
from PIL import Image
from transformers import CLIPProcessor, CLIPModel

class PersistentMatcher:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"[{time.strftime('%H:%M:%S')}] 모델 로드 중")

        self.model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(self.device)
        self.processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        
        base_dir = os.path.dirname(os.path.abspath(__file__))
        self.img_dir = os.path.join(base_dir, "img") 
        self.emb_path = os.path.join(self.img_dir, "target_emb.pt")
        self.target_emb = torch.load(self.emb_path, map_location=self.device)
        self.match_threshold = 0.70

        print(f"[{time.strftime('%H:%M:%S')}] 서버 준비 완료")

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
                        
                        img_data = base64.b64decode(data['image'].split(',')[1])
                        pil_img = Image.open(io.BytesIO(img_data)).convert("RGB")
                        
                        inputs = self.processor(images=pil_img, return_tensors="pt").to(self.device)
                        
                        with torch.no_grad():
                            features = self.model.get_image_features(**inputs)
                            
                            if not isinstance(features, torch.Tensor):
                                if hasattr(features, 'image_embeds') and features.image_embeds is not None:
                                    features = features.image_embeds
                                elif hasattr(features, 'pooler_output'):
                                    features = features.pooler_output
                                else:
                                    features = features[0]
                            
                            features = features / features.norm(dim=-1, keepdim=True)
                        
                        score = (features @ self.target_emb.T).item()
                        is_match = score > self.match_threshold

                        result = {
                            "score": float(score),
                            "status": "Holding" if is_match else "Searching", 
                            "is_match": is_match
                        }
                        await websocket.send(json.dumps(result))
                        
                        print(f"[{time.strftime('%H:%M:%S')}] Score: {score:.4f} | Match: {is_match}")
                        await asyncio.sleep(0.5)
                        
            except Exception as e:
                print(f"[{time.strftime('%H:%M:%S')}] 연결 오류: {e} 재시도중")
                await asyncio.sleep(5)

if __name__ == "__main__":
    matcher = PersistentMatcher()
    asyncio.run(matcher.run_forever())