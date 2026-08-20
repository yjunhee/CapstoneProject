import { useState, useRef } from 'react';
import { Camera, Upload, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '../src/app/components/ui/button';
import { Card, CardContent } from '../src/app/components/ui/card';
import { culturalSites } from '../src/app/data/mockData';
import { toast } from 'sonner';

export function StampCamera() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState<{
    matched: boolean;
    siteName?: string;
    similarity?: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setMatchResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    setIsAnalyzing(true);
    setMatchResult(null);

    // Mock image similarity analysis (실제로는 AI API 사용)
    setTimeout(() => {
      // 랜덤하게 매칭 여부 결정 (데모용)
      const isMatched = Math.random() > 0.3;
      
      if (isMatched) {
        // 미수집 문화재 중 랜덤 선택
        const uncollectedSites = culturalSites.filter(s => !s.stampCollected);
        const randomSite = uncollectedSites[Math.floor(Math.random() * uncollectedSites.length)];
        const similarity = 85 + Math.floor(Math.random() * 10); // 85-94%
        
        setMatchResult({
          matched: true,
          siteName: randomSite?.name || '문화재',
          similarity
        });
        
        toast.success('스탬프 획득!', {
          description: `${randomSite?.name} 스탬프를 획득했습니다!`
        });
      } else {
        setMatchResult({
          matched: false,
          similarity: 45 + Math.floor(Math.random() * 30) // 45-74%
        });
        
        toast.error('매칭 실패', {
          description: '해당 문화재와 일치하지 않습니다.'
        });
      }
      
      setIsAnalyzing(false);
    }, 2000);
  };

  const resetCamera = () => {
    setSelectedImage(null);
    setMatchResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">스탬프 찍기</h1>
        <p className="text-green-100">문화재 사진을 촬영하거나 업로드하세요</p>
      </div>

      <div className="p-4 max-w-md mx-auto">
        {/* Instructions */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="font-bold mb-2">📸 사용 방법</h3>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>문화재 현장에서 사진을 촬영하세요</li>
              <li>AI가 사진을 분석하여 문화재를 인식합니다</li>
              <li>유사도가 80% 이상이면 스탬프를 획득합니다</li>
            </ol>
          </CardContent>
        </Card>

        {/* Camera/Upload Area */}
        {!selectedImage ? (
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageSelect}
              className="hidden"
              id="camera-input"
            />
            
            <Button
              className="w-full h-32 flex flex-col gap-2"
              variant="outline"
              onClick={() => {
                const input = document.getElementById('camera-input') as HTMLInputElement;
                if (input) input.click();
              }}
            >
              <Camera className="w-12 h-12" />
              <span>카메라로 촬영하기</span>
            </Button>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              id="upload-input"
            />
            
            <Button
              className="w-full h-32 flex flex-col gap-2"
              variant="outline"
              onClick={() => {
                const input = document.getElementById('upload-input') as HTMLInputElement;
                if (input) input.click();
              }}
            >
              <Upload className="w-12 h-12" />
              <span>갤러리에서 선택하기</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Preview */}
            <Card className="overflow-hidden">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full h-64 object-cover"
              />
            </Card>

            {/* Analysis Result */}
            {matchResult && (
              <Card className={`border-2 ${
                matchResult.matched 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-red-500 bg-red-50'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {matchResult.matched ? (
                      <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                    )}
                    
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg mb-1 ${
                        matchResult.matched ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {matchResult.matched ? '스탬프 획득!' : '매칭 실패'}
                      </h3>
                      
                      {matchResult.matched && (
                        <p className="text-green-700 mb-2">
                          {matchResult.siteName} 스탬프를 획득했습니다!
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">유사도:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              matchResult.matched ? 'bg-green-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${matchResult.similarity}%` }}
                          />
                        </div>
                        <span className="font-bold">{matchResult.similarity}%</span>
                      </div>
                      
                      {!matchResult.matched && (
                        <p className="text-sm text-red-600 mt-2">
                          유사도가 80% 미만입니다. 다른 각도에서 다시 촬영해주세요.
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              {!matchResult && (
                <Button
                  className="w-full"
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      AI 분석 중...
                    </>
                  ) : (
                    '사진 분석하기'
                  )}
                </Button>
              )}
              
              <Button
                className="w-full"
                variant="outline"
                onClick={resetCamera}
              >
                다시 촬영하기
              </Button>
            </div>
          </div>
        )}

        {/* Recent Uncollected Sites */}
        <div className="mt-8">
          <h3 className="font-bold mb-3">주변 미수집 문화재</h3>
          <div className="space-y-2">
            {culturalSites
              .filter(s => !s.stampCollected)
              .slice(0, 3)
              .map((site) => (
                <Card key={site.id}>
                  <CardContent className="p-3 flex items-center gap-3">
                    <img
                      src={site.image}
                      alt={site.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">{site.name}</h4>
                      <p className="text-xs text-gray-500">{site.distance}km 거리</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
