import os
import torch
import torch.nn.functional as F

def analyze_embeddings(embedding_dir, target_file_path, threshold=0.70):
    if not os.path.exists(target_file_path):
        raise FileNotFoundError(f"Target file not found at {target_file_path}")
        
    target_emb = torch.load(target_file_path, map_location='cpu').view(1, -1)
    
    high_similarity_ids = []

    print("--- Individual Similarity Scores ---")
    
    for filename in os.listdir(embedding_dir):
        if filename.endswith('.pt') and filename != os.path.basename(target_file_path):
            file_path = os.path.join(embedding_dir, filename)
            
            try:
                current_emb = torch.load(file_path, map_location='cpu').view(1, -1)
                
                similarity = F.cosine_similarity(target_emb, current_emb).item()
                
                print(f"File: {filename} | Score: {similarity:.4f}")
                
                if similarity > threshold:
                    file_id = os.path.splitext(filename)[0]
                    high_similarity_ids.append(file_id)
                    
            except Exception as e:
                print(f"Error processing {filename}: {e}")

    print("\n" + "="*40)
    print(f"Embeddings with score higher than {threshold}:")
    print("="*40)
    
    if high_similarity_ids:
        high_similarity_ids.sort(key=lambda x: int(x) if x.isdigit() else x)
        print(high_similarity_ids)
    else:
        print("No embeddings met the threshold criteria.")

EMBEDDING_FOLDER = "./emb"       
TARGET_EMBEDDING = "./reference_embeddings/guassian_white.pt"   

if __name__ == "__main__":
    analyze_embeddings(EMBEDDING_FOLDER, TARGET_EMBEDDING, threshold=0.70)