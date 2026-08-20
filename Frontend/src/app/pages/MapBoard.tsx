import React, { useEffect, useState, useMemo } from 'react';
import { Map, MapMarker, Polygon } from 'react-kakao-maps-sdk';
import { useNavigate } from 'react-router';

// 랜드마크 정의
export interface Landmark {
  id: string;
  name: string;
  lat: number;
  lng: number;
  region: string;
  image_url: string;
  stampCollected: boolean;
}

// 전달받을 컴포넌트
interface MapBoardProps {
  landmarks: Landmark[];
  onStampSuccess: (id: string) => void;
  currentUserId: string;
}

// 두 좌표 간의 거리 계산 함수 (Haversine 공식, 단위: 미터)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // 지구 반경 (미터)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
}

// 볼록껍질 알고리즘 (점들을 모두 포함하는 가장 바깥쪽 테두리 좌표만 추출)
function getConvexHull(points: { lat: number; lng: number }[]) {
  if (points.length < 3) return points;
  const sorted = [...points].sort((a, b) => (a.lng !== b.lng ? a.lng - b.lng : a.lat - b.lat));
  
  const crossProduct = (a: any, b: any, c: any) => {
    return (b.lng - a.lng) * (c.lat - a.lat) - (b.lat - a.lat) * (c.lng - a.lng);
  };

  const lower: { lat: number; lng: number }[] = [];
  for (let p of sorted) {
    while (lower.length >= 2 && crossProduct(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }

  const upper: { lat: number; lng: number }[] = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    let p = sorted[i];
    while (upper.length >= 2 && crossProduct(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }

  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

export default function MapBoard({ landmarks, onStampSuccess, currentUserId }: MapBoardProps) {
  const navigate = useNavigate();

  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  // 지도 중심 및 사용자 GPS 위치 (초기값 서울시청)
  const [myLocation, setMyLocation] = useState({ lat: 37.5665, lng: 126.9780 });
  const [gpsError, setGpsError] = useState<string | null>(null);

  // 실시간 GPS 위치 추적 효과
  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsError('브라우저가 GPS를 지원하지 않습니다.');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setMyLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setGpsError(null);
      },
      (error) => {
        console.error('GPS 획득 실패:', error);
        setGpsError('위치 정보를 가져올 수 없습니다. GPS 권한을 확인해주세요.');
      },
      {
        enableHighAccuracy: true, // 높은 정확도 모드
        maximumAge: 0,
        timeout: 10000,
      }
    );

    // 컴포넌트 언마운트 시 추적 종료
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // 현재 선택된 랜드마크와 사용자 GPS 간의 거리 계산 (미터 단위)
  const distanceToSelected = useMemo(() => {
    if (!selectedLandmark) return null;
    return getDistance(
      myLocation.lat,
      myLocation.lng,
      selectedLandmark.lat,
      selectedLandmark.lng
    );
  }, [selectedLandmark, myLocation]);

  // 스탬프 유효 범위 설정 
  const STAMPABLE_DISTANCE = 50; 
  //const isCloseEnough = distanceToSelected !== null && distanceToSelected <= STAMPABLE_DISTANCE;
  const isCloseEnough = true;


  // 스탬프를 얻은 장소만 추출/좌표 그룹화(도 기준)
  const groupedPathByRegion = useMemo(() => {
    return landmarks
      .filter((lm) => lm.stampCollected)
      .reduce((acc, lm) => {
        if (!acc[lm.region]) acc[lm.region] = [];
        acc[lm.region].push({ lat: lm.lat, lng: lm.lng });
        return acc;
      }, {} as Record<string, { lat: number; lng: number }[]>);
  }, [landmarks]);

  // 각 지역별 전체 랜드마크 수와 획득 스탬프 수
  const regionStats = useMemo(() => {
    const stats: Record<string, { total: number; collected: number }> = {};
    landmarks.forEach((lm) => {
      if (!stats[lm.region]) stats[lm.region] = { total: 0, collected: 0 };
      stats[lm.region].total += 1;
      if (lm.stampCollected) stats[lm.region].collected += 1;
    });
    return stats;
  }, [landmarks]);

  const currentRegionStat = selectedLandmark ? regionStats[selectedLandmark.region] : null;

  const handleStamp = async (landmark: Landmark) => {
    if (!currentUserId) return alert('로그인이 필요합니다.');
    if (!isCloseEnough) {
      return alert(`랜드마크와 너무 멉니다. ${STAMPABLE_DISTANCE}m 이내로 접근해주세요!`);
    }
    
    // 카메라 페이지로 이동하면서 랜드마크 ID와 이름을 파라미터로 전달
    navigate(`/camera?id=${landmark.id}&name=${encodeURIComponent(landmark.name)}`);
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#f9f9f9', fontFamily: 'sans-serif' }}>
      {/* GPS 에러 메시지 바 */}
      {gpsError && (
        <div style={{ backgroundColor: '#ffeaea', color: '#d9534f', padding: '8px', fontSize: '0.8rem', textAlign: 'center', fontWeight: 'bold' }}>
          ⚠ {gpsError}
        </div>
      )}

      {/* 지도 DIV */}
      <div style={{ width: '100%', height: '66vh', position: 'relative', overflow: 'hidden' }}>
        <Map center={myLocation} style={{ width: '100%', height: '100%' }} level={11}>
          {/* 사용자의 현재 위치 마커 (파란색 기본 마커 혹은 커스텀) */}
          <MapMarker 
            position={myLocation} 
            image={{
              src: "https://t1.daumcdn.net/localimg/localimages/07/2018/pc/img/marker_spot.png",
              size: { width: 24, height: 35 }
            }}
          />

          {/* 볼록 껍질 다각형 */}
          {Object.entries(groupedPathByRegion).map(([region, paths]) =>
            paths.length >= 3 && (
              <Polygon
                key={region}
                path={getConvexHull(paths)}
                strokeWeight={3}
                strokeColor={'#FF5E00'}
                fillColor={'#FF9500'}
                fillOpacity={0.4}
              />
            )
          )}

          {/* 랜드마크 마커 */}
          {landmarks.map((landmark) => (
            <MapMarker
              key={landmark.id}
              position={{ lat: landmark.lat, lng: landmark.lng }}
              onClick={() => setSelectedLandmark(landmark)}
              image={{
                src: landmark.stampCollected
                  ? 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png'
                  : 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
                size: { width: 24, height: 35 },
              }}
            />
          ))}
        </Map>

        {/* 정보창 (지도 하단 배치) */}
        {selectedLandmark && (
          <div style={combinedContainerStyle}>
            {/* 지역 진척도 */}
            {currentRegionStat && (
              <div style={compactDashboardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '5px' }}>
                  <span style={{ fontWeight: 'bold' }}>📍 {selectedLandmark.region}</span>
                  <span style={{ color: '#FF5E00', fontWeight: 'bold' }}>
                    {currentRegionStat.collected}/{currentRegionStat.total} 완수
                  </span>
                </div>
                <div style={progressBgStyle}>
                  <div
                    style={{
                      ...progressFillStyle,
                      width: `${(currentRegionStat.collected / currentRegionStat.total) * 100}%`,
                      backgroundColor: currentRegionStat.collected >= 3 ? '#FF5E00' : '#A9E2F3',
                    }}
                  />
                </div>
              </div>
            )}

            {/* 랜드마크 상세 */}
            <div style={compactModalStyle}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <img src={`/img/${selectedLandmark.id}.jpg`} alt={selectedLandmark.name} style={imageStyle} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem', letterSpacing: '-0.5px' }}>
                    {selectedLandmark.name}
                  </h3>
                  {/* 현재 내 GPS 기반 거리 표시 */}
                  {distanceToSelected !== null && (
                    <p style={{ margin: '0 0 6px 0', fontSize: '0.75rem', color: isCloseEnough ? '#4CAF50' : '#f44336', fontWeight: 'bold' }}>
                      {isCloseEnough ? `🚶 접근 완료 (내 위치에서 ${Math.round(distanceToSelected)}m)` : `❌ 거리 멂 (내 위치에서 ${Math.round(distanceToSelected)}m)`}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button style={miniBtnStyle} onClick={() => window.open(`https://map.kakao.com/link/to/${selectedLandmark.name},${selectedLandmark.lat},${selectedLandmark.lng}`)}>
                      📍 길찾기
                    </button>
                    <button style={miniBtnStyle} onClick={() => window.open(`https://map.kakao.com/link/search/${selectedLandmark.name} 맛집`)}>
                      🍜 맛집
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                {selectedLandmark.stampCollected ? (
                  <button style={{ ...actionBtnStyle, backgroundColor: '#eee', color: '#888', flex: 2 }} disabled>
                    ⭐ 수집 완료
                  </button>
                ) : (
                  <button
                    style={{
                      ...actionBtnStyle,
                      backgroundColor: isCloseEnough ? '#FF5E00' : '#ccc',
                      color: '#fff',
                      flex: 2,
                      cursor: isCloseEnough ? 'pointer' : 'not-allowed'
                    }}
                    onClick={() => handleStamp(selectedLandmark)}
                    disabled={!isCloseEnough} // 거리가 멀면 비활성화
                  >
                    🏆 {isCloseEnough ? "스탬프 찍기" : `${STAMPABLE_DISTANCE}m 이내 접근 필요`}
                  </button>
                )}
                <button style={{ ...actionBtnStyle, flex: 1, background: '#fff', border: '1px solid #ddd' }} onClick={() => setSelectedLandmark(null)}>
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '25px', textAlign: 'center', color: '#999', fontSize: '0.85rem' }}>
        랜드마크를 방문해 스탬프를 얻어 영역을 넓혀보세요!
      </div>
    </div>
  );
}

// CSS 스타일 (기존 코드 유지)
const combinedContainerStyle: React.CSSProperties = { 
  position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', 
  width: '92%', maxWidth: '360px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '8px' 
};
const compactDashboardStyle: React.CSSProperties = { 
  backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '10px 12px', borderRadius: '10px', 
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.3)' 
};
const compactModalStyle: React.CSSProperties = { 
  backgroundColor: 'white', padding: '12px', borderRadius: '18px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' 
};
const imageStyle: React.CSSProperties = { 
  width: '75px', height: '75px', objectFit: 'cover', borderRadius: '10px' 
};
const progressBgStyle: React.CSSProperties = {
  width: '100%', height: '5px', background: '#e0e0e0', borderRadius: '3px', overflow: 'hidden' 
};
const progressFillStyle: React.CSSProperties = {
  height: '100%', transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' 
};
const actionBtnStyle: React.CSSProperties = { 
  padding: '11px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' 
};
const miniBtnStyle: React.CSSProperties = {
  padding: '6px 10px', border: '1px solid #eee', borderRadius: '6px', background: '#f8f9fa', 
  cursor: 'pointer', fontWeight: '500', fontSize: '0.7rem'
};