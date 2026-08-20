import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Star, Calendar, Award, ChevronDown, ChevronUp, MapPin, CheckCircle2 } from 'lucide-react';
import { Badge } from '../components/ui/badge';

// 랜드마크 정의
interface Landmark {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
  lat: number;
  lng: number;
  region: string;
  distance?: number;
  stampCollected: boolean;
  collectedAt?: string;
}

// 컴포넌트 시작/ 상태 선언(로그인한 사용자 아이디, 창 열닫)
export function StampCollection() {
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [openRegions, setOpenRegions] = useState<Record<string, boolean>>({});
  // 유저정보 저장
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUserId(parsedUser.id);
    }
  }, []);
  // 유저정보 저장 후 실행
  useEffect(() => {
    if (!currentUserId) return;
const fetchLandmarks = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://localhost:5000/api/landmarks`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        setLandmarks(data);
        
        const regions = Array.from(new Set(data.map((l: Landmark) => l.region)));
        if (regions.length > 0) {
          setOpenRegions({ [regions[0] as string]: true });
        }
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      }
    };
    fetchLandmarks();
  }, [currentUserId]);

  // 데이터를 지역별로 그룹화/useMemo로 landmark가 바뀔때만 동작
  const groupedData = useMemo(() => {
    return landmarks.reduce((acc, landmark) => {
      const { region } = landmark;
      if (!acc[region]) acc[region] = [];
      acc[region].push(landmark);
      return acc;
    }, {} as Record<string, Landmark[]>);
  }, [landmarks]);
  //  지역, 획득 스탬프 수, 전체 달성률 
  const regions = Object.keys(groupedData).sort();
  const collectedCount = landmarks.filter(l => l.stampCollected).length;
  const completionRate = Math.round((collectedCount / (landmarks.length || 1)) * 100);

  // 완료된 지역 계산
  const completedRegionsCount = useMemo(() => {
    return regions.filter(region => {
      const regionLandmarks = groupedData[region];
      const regionCollected = regionLandmarks.filter(l => l.stampCollected).length;
      const regionRate = (regionCollected / regionLandmarks.length) * 100;
      // 완료 수집률 설정 현재 80%
      return regionRate >= 80; 
    }).length;
  }, [groupedData, regions]);

  // 토글 함수
  const toggleRegion = (region: string) => {
    setOpenRegions(prev => ({ ...prev, [region]: !prev[region] }));
  };

  //UI
  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      
      {/* 상단 헤더 */}
      <div className="bg-gradient-to-br from-purple-700 to-indigo-800 text-white p-8 rounded-b-[2.5rem] shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-black tracking-tight mb-1">나의 스탬프 북</h1>
          <p className="text-purple-200 text-sm opacity-80">80% 이상 수집 하면 지역 완료!</p>
        </div>
        {/* 칸을 3개로 분할 */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
            <div className="text-2xl font-black text-yellow-300">{collectedCount}</div>
            <div className="text-[10px] text-purple-100 font-bold uppercase">전체 스탬프</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
            <div className="text-2xl font-black">{completionRate}%</div>
            <div className="text-[10px] text-purple-100 font-bold uppercase">전체 달성률</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center ring-2 ring-emerald-400/50">
            <div className="text-2xl font-black text-emerald-400">{completedRegionsCount}</div>
            <div className="text-[10px] text-purple-100 font-bold uppercase">완료한 지역</div>
          </div>
        </div>
      </div>

      {/* 지역별 리스트 배열을 만들어서 달성률,완료했는지, 열려있는지 확인 */}
      <div className="p-5 mt-4 space-y-4">
        {regions.map((region) => {
          const regionLandmarks = groupedData[region];
          const regionCollected = regionLandmarks.filter(l => l.stampCollected).length;
          const regionRate = Math.round((regionCollected / regionLandmarks.length) * 100);
          {/* 완료 퍼센티지 설정 */}
          const isCompleted = regionRate >= 80; 
          const isOpen = openRegions[region];

          return (
            <div key={region} className={`bg-white rounded-3xl shadow-sm border overflow-hidden transition-all ${isCompleted ? 'border-emerald-200 ring-1 ring-emerald-100' : 'border-gray-100'}`}>
              
              {/* 접었다 펴는 부분 성공 여부에 따라 색 설정 */}
              <button 
                onClick={() => toggleRegion(region)}
                className={`w-full flex items-center justify-between p-5 transition-colors ${isOpen ? (isCompleted ? 'bg-emerald-50/50' : 'bg-purple-50/50') : 'bg-white'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isCompleted ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <MapPin className="w-5 h-5" />}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1">
                      <h3 className={`font-bold ${isCompleted ? 'text-emerald-700' : 'text-gray-800'}`}>{region}</h3>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                       <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${isCompleted ? 'bg-emerald-500' : 'bg-purple-500'}`} 
                            style={{ width: `${regionRate}%` }}
                          ></div>
                       </div>
                       <p className={`text-[10px] font-bold ${isCompleted ? 'text-emerald-600' : 'text-gray-400'}`}>
                         {regionRate}% ({regionCollected}/{regionLandmarks.length})
                       </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isCompleted && (
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-2 py-0.5 font-bold text-[10px]">완료됨</Badge>
                  )}
                  {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>
              </button>

              {/* 열렸을 때 내용 */}
              {isOpen && (
                <div className="p-4 grid grid-cols-2 gap-3 bg-white border-t border-gray-50 animate-in fade-in slide-in-from-top-2 duration-300">
                  {regionLandmarks.map((item) => (
                    <Card key={item.id} className={`overflow-hidden border-none shadow-sm rounded-2xl relative ${!item.stampCollected && 'opacity-60 grayscale-[0.5]'}`}>
                      <div className="relative h-28">
                        <img src={`/img/${item.id}.jpg`} alt={item.name} className="w-full h-full object-cover" />
                        {item.stampCollected && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-purple-600 border-none p-1"><Star className="w-3 h-3 fill-current text-white" /></Badge>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-3">
                        <h4 className={`font-bold text-[11px] truncate ${item.stampCollected ? 'text-gray-800' : 'text-gray-400'}`}>
                          {item.name}
                        </h4>
                        <p className="text-[9px] text-gray-400 mt-0.5">
                          {item.stampCollected ? '수집됨' : '미방문'}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}