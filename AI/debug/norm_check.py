import os
import torch
import torch.nn.functional as F

def check_self_similarity(embedding_dir, threshold=0.90):
    if not os.path.exists(embedding_dir):
        raise FileNotFoundError(f"Embedding directory not found at {embedding_dir}")
        
    low_similarity_ids = []

    print("--- Individual Self-Similarity Scores ---")
    
    for filename in os.listdir(embedding_dir):
        if filename.endswith('.pt'):
            file_path = os.path.join(embedding_dir, filename)
            
            try:
                emb_a = torch.load(file_path, map_location='cpu').view(1, -1)
                emb_b = emb_a.clone()
                
                similarity = F.cosine_similarity(emb_a, emb_b).item()
                
                print(f"File: {filename} | Self-Similarity Score: {similarity:.4f}")
                
                if similarity < threshold:
                    file_id = os.path.splitext(filename)[0]
                    low_similarity_ids.append((file_id, similarity))
                    
            except Exception as e:
                print(f"Error processing {filename}: {e}")

    print("\n" + "="*50)
    print(f"🚨 Embeddings with Self-Similarity BELOW {threshold}:")
    print("="*50)
    
    if low_similarity_ids:
        
        low_similarity_ids.sort(key=lambda x: int(x[0]) if x[0].isdigit() else x[0])
        
        for file_id, score in low_similarity_ids:
            print(f"❌ ID: {file_id} (Score: {score:.4f})")
    else:
        print("✅ Excellent! All embeddings passed. No files are below the 0.90 threshold.")

EMBEDDING_FOLDER = "./emb"       

if __name__ == "__main__":
    check_self_similarity(EMBEDDING_FOLDER, threshold=0.90)