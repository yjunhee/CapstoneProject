import cv2
import torch
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
from rembg import remove 
import os
import threading
import time   

class ImageMatcher:
    def __init__(self, img_dir="img", emb_dir='reference_embedding', guide_filename="guide_yongdu.png", emb_filename="1.pt", match_threshold=0.75):
        
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
        self.guide_path = os.path.join(img_dir, guide_filename)
        self.emb_path = os.path.join(emb_dir, emb_filename)
        self.match_threshold = match_threshold

        self.model = None
        self.processor = None
        self.guide_img = None
        self.emb = None

        self.is_model_loaded = False
        
        self.REQUIRED_DURATION = 3.0 
        self.match_start_time = None 
        self.is_success = False     

    def _load_model_async(self):
        self.model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(self.device)
        self.processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        self.model.eval()
        self.load_embedding()
        self.is_model_loaded = True

    def load_embedding(self):
        if not os.path.exists(self.emb_path):
            raise FileNotFoundError(f"Embedding file not found: {self.emb_path}")
        else:
            self.emb = torch.load(self.emb_path, map_location=self.device)
        if not isinstance(self.emb, torch.Tensor):
            raise TypeError(f"Loaded embedding is not a tensor. Got: {type(self.emb)}")

    def load_guide_image(self):
        if not os.path.exists(self.guide_path):
            self.guide_img = None
        else:
            self.guide_img = cv2.imread(self.guide_path, cv2.IMREAD_UNCHANGED)
 
    def apply_guide_overlay(self, camera_frame, progress=0.0):
        if self.guide_img is None: return camera_frame.copy()
        h, w, _ = camera_frame.shape

        cropped_guide = self.center_crop_to_aspect(self.guide_img, w, h)
        resized_guide = cv2.resize(cropped_guide, (w, h), interpolation=cv2.INTER_AREA)
        #resized_guide = self.guide_img
        guide_rgb = resized_guide[:, :, :3]
        alpha_channel = resized_guide[:, :, 3] / 255.0  
        base_alpha = 0.25
        global_alpha = base_alpha + (0.8 - base_alpha) * progress
        
        adjusted_alpha = alpha_channel * global_alpha
        result_frame = camera_frame.copy()
        
        for c in range(0, 3):
            result_frame[:, :, c] = (camera_frame[:, :, c] * (1.0 - adjusted_alpha) + guide_rgb[:, :, c] * adjusted_alpha)
        return result_frame

    def center_crop_to_aspect(self, img, target_w, target_h):
        h, w = img.shape[:2]
        target_ratio = target_w / target_h
        current_ratio = w / h

        if current_ratio > target_ratio:
            new_w = int(h * target_ratio)
            x_start = (w - new_w) // 2
            cropped = img[:, x_start:x_start + new_w]
        else:
            new_h = int(w / target_ratio)
            y_start = (h - new_h) // 2
            cropped = img[y_start:y_start + new_h, :]

        return cropped

    def calculate_similarity(self, frame): 
        img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(img_rgb)
        inputs = self.processor(images=pil_img, return_tensors="pt").to(self.device)
        with torch.no_grad():
            outputs = self.model.get_image_features(**inputs)
            if hasattr(outputs, "pooler_output"): curr_features = outputs.pooler_output
            else: curr_features = outputs 
            curr_features = curr_features / curr_features.norm(dim=-1, keepdim=True)
        return (curr_features @ self.emb.T).item()

    def _on_success_triggered(self):
        print("\n 3초 유지 성공")

    def run(self):
        try:
            self.load_guide_image()
            loading_thread = threading.Thread(target=self._load_model_async, daemon=True)
            loading_thread.start()

            cap = cv2.VideoCapture(0)
            if not cap.isOpened(): raise Exception("카메라 없음")

            print("'q': 종료, 'r': 성공 상태 초기화(재시도)")

            frame_count = 0
            score = 0.0
            is_match = False
            progress = 0.0
            status_text = "Starting..."
            color = None

            while True:
                ret, frame = cap.read()
                if not ret: break
                frame_count += 1 
                 
                if self.is_model_loaded: 
                    if frame_count % 5 == 0:
                        score = self.calculate_similarity(frame)
                        is_match = score > self.match_threshold

                    current_time = time.time() 
                    if self.is_success: 
                        status_text = "-SUCCESS!-"
                        color = (255, 0, 0)  
                        progress = 1.0     
                    
                    elif is_match: 
                        if self.match_start_time is None:
                            self.match_start_time = current_time 
                        
                        elapsed_time = current_time - self.match_start_time
                        progress = min(elapsed_time / self.REQUIRED_DURATION, 1.0)
                        
                        status_text = f"-Holding ({elapsed_time:.1f}s)-"
                        color = (0, 255, 255) 

                        if elapsed_time >= self.REQUIRED_DURATION:
                            self.is_success = True
                            self.match_start_time = None 
                            self._on_success_triggered()  
                    
                    else:
                        self.match_start_time = None
                        progress = 0.0
                        status_text = "-Searching-"
                        color = (0, 0, 255) 
                else:
                    progress = 0.0
 
                display_frame = self.apply_guide_overlay(frame, progress=progress)
 
                if self.is_model_loaded:
                    cv2.putText(display_frame, f"{status_text} ({score*100:.1f}%)", (30, 50), 
                                cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2, cv2.LINE_AA)
                else:
                    cv2.putText(display_frame, "-Loading-", (30, 50), 
                                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2, cv2.LINE_AA)
                
                cv2.imshow("Camera", display_frame)
                
                key = cv2.waitKey(1) & 0xFF
                if key == ord('q'):
                    break
                elif key == ord('r'): 
                    self.is_success = False
                    self.match_start_time = None

        except Exception as e: print(f"\n오류: {e}")
        finally:
            if 'cap' in locals() and cap.isOpened(): cap.release()
            cv2.destroyAllWindows()
            print("\n프로그램 종료.")

if __name__ == "__main__":
    matcher = ImageMatcher()
    matcher.run()
