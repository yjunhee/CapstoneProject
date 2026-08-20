import { useState, useEffect } from 'react';
import { List, Map as MapIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import MapBoard from './MapBoard';
import mapImg from '../../map_large_new.jpg';

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
  stampCollected: boolean; // 🔥 필수 boolean으로 변경
}

export function Home() {
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');
  const [currentUserId, setCurrentUserId] = useState<string>('');

  const updateStampInHome = (landmarkId: string) => {
    setLandmarks((prev) =>
      prev.map((site) =>
        site.id === landmarkId ? { ...site, stampCollected: true } : site
      )
    );
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUserId(parsedUser.id);
    }
  }, []);

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

        if (!response.ok) throw new Error('네트워크 응답 에러');

        const data = await response.json();

        setLandmarks(
          data.map((item: any) => ({
            ...item,
            stampCollected: item.stampCollected ?? false,
          }))
        );
      } catch (error) {
        console.error('랜드마크 데이터 오류:', error);
      }
    };

    fetchLandmarks();
  }, [currentUserId]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <p className="text-blue-100">주변 문화재를 방문하고 스탬프를 모으세요</p>
      </div>

      {/* 탭 */}
      <div className="bg-white border-b px-4 py-3 flex justify-end gap-2">
        <Button
          variant={viewMode === 'map' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('list')}
        >
          <List className="w-4 h-4 mr-1" />
          국민대
        </Button>
      
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('map')}
        >
          <MapIcon className="w-4 h-4 mr-1" />
          지도
        </Button>
      </div>

      {/* 화면 */}
      {viewMode === 'map' ? (
        <div className="w-full h-[calc(100vh-180px)]">
          <MapBoard
            landmarks={landmarks}
            onStampSuccess={updateStampInHome}
            currentUserId={currentUserId}
          />
        </div>
      ) : (
        <div className="p-4">
          <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
            <img
              src={mapImg}
              alt="국민대 지도"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      )}

      {/* 광고 */}
      <div className="w-full min-h-[90px] bg-gray-100 border-t flex items-center justify-center text-sm text-gray-500">
        Google Ads
      </div>
    </div>
  );
}
