import { useState, useEffect, useMemo } from 'react';
import { Gift, Star, Lock, Check, Sparkles } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner';

// 목업 데이터 (임시)
const gifts = [
  { id: '1', name: '아메리카노 쿠폰', requiredStamps: 3, description: '스타벅스 아메리카노 Tall', category: '카페', image: '☕' },
  { id: '2', name: '문화상품권 5천원', requiredStamps: 10, description: '온/오프라인 공용 상품권', category: '상품권', image: '🎟️' },
  { id: '3', name: '스탬프 투어 굿즈', requiredStamps: 25, description: '한정판 에코백 & 뱃지 세트', category: '굿즈', image: '🛍️' },
  { id: '4', name: '호텔 숙박권', requiredStamps: 50, description: '지역 제휴 호텔 1박권', category: '여행', image: '🏨' },
];

// 기초 상태 설정
export function GiftExchange() {
  const [selectedGift, setSelectedGift] = useState<typeof gifts[0] | null>(null);
  const [exchangedGifts, setExchangedGifts] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [stampCount, setStampCount] = useState<number>(0); 
  // 유저 불러오기
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUserId(parsedUser.id);
    }
  }, []);
  // 유저에서 현재 스탬프 갯수를 받아옴 stampCount에 저장
  useEffect(() => {
    if (!currentUserId) return;

    const fetchMyStamps = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/landmarks`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // "저 정상 로그인 유저입니다!" 증명
            }
        });
        if (!response.ok) throw new Error('데이터 로드 실패');
        const data = await response.json();
        const count = data.filter((item: any) => item.stampCollected).length;
        setStampCount(count);
      } catch (error) {
        console.error('스탬프 정보를 불러오지 못했습니다:', error);
      }
    };
    fetchMyStamps();
  }, [currentUserId]);

  // 선물 교환 및 스탬프 차감 
  const handleExchange = async () => {
    if (!selectedGift) return;

    // 프론트 상태 업데이트
    const newStampCount = stampCount - selectedGift.requiredStamps;
    
    try {
      /* // DB 연동 시 백엔드에 요청을 보내야 함
      const response = await fetch('http://localhost:5000/api/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          giftId: selectedGift.id,
          cost: selectedGift.requiredStamps // 차감할 스탬프 수
        })
      });

      if (!response.ok) throw new Error('교환 처리 중 오류 발생');
      */

      // 상태 업데이트
      setStampCount(newStampCount);
      setExchangedGifts([...exchangedGifts, selectedGift.id]);
      
      toast.success('교환 완료!', {
        description: `${selectedGift.name}를 획득했습니다! (스탬프 ${selectedGift.requiredStamps}개 사용)`,
        icon: '🎉'
      });
    } catch (error) {
      toast.error('교환에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSelectedGift(null);
    }
  };
  // 현재 상품을 교환할 수 있는 지 체크
  const canExchange = (gift: typeof gifts[0]) => {
    return stampCount >= gift.requiredStamps && !exchangedGifts.includes(gift.id);
  };
  // 상품을 스탬프 기준으로 오름차순 
  const sortedGifts = [...gifts].sort((a, b) => a.requiredStamps - b.requiredStamps);

  //UI
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 상단 헤더 */}
      <div className="bg-gradient-to-br from-pink-600 to-rose-700 text-white p-8 rounded-b-[2.5rem] shadow-lg">
        <h1 className="text-2xl font-bold mb-1">선물 교환소</h1>
        <p className="text-pink-100 text-sm opacity-90">스탬프를 사용해 선물과 교환하세요!</p>
        
        <div className="mt-6 bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-3">
              <div className="bg-yellow-400 p-2 rounded-lg shadow-sm">
                <Star className="w-5 h-5 fill-white text-white" />
              </div>
              <span className="font-bold text-lg">남은 스탬프</span>
            </span>
            <span className="text-3xl font-black text-yellow-300">{stampCount} <span className="text-sm text-white font-normal">개</span></span>
          </div>
        </div>
      </div>

      <div className="p-5 max-w-2xl mx-auto space-y-6">
        {/* 다음 목표 선물 정보 */}
        <Card className="border-none shadow-md bg-white rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-100 p-2 rounded-full">
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="font-bold text-gray-800">다음 목표 선물</h2>
            </div>
            {/* 정렬 해둬서 /find로 바로 찾기 가능 */}
            {(() => {
              const nextGift = sortedGifts.find(g => 
                g.requiredStamps > stampCount && !exchangedGifts.includes(g.id)
              );
              {/* 만약 상품이 더 없을 때 창 */}
              if (!nextGift) {
                return (
                  <div className="bg-green-50 p-4 rounded-2xl flex items-center gap-3">
                    <Check className="text-green-600 w-6 h-6" />
                    <p className="text-green-700 font-bold">새로운 스탬프를 더 모아보세요! 🎊</p>
                  </div>
                );
              }
              
              const remaining = nextGift.requiredStamps - stampCount;
              const progress = (stampCount / nextGift.requiredStamps) * 100;
              
              return (
                <>
                  <div className="flex items-center justify-between text-sm mb-3 font-semibold">
                    <span className="text-gray-700">{nextGift.name}</span>
                    <span className="text-pink-600">{remaining}개 더 필요</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-full h-3 transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </>
              );
            })()}
          </CardContent>
        </Card>

        {/* 선물 칸 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedGifts.map((gift) => {
            const isExchanged = exchangedGifts.includes(gift.id);
            const isAvailable = canExchange(gift);
            const isLocked = stampCount < gift.requiredStamps;

            return (
              <Card
                key={gift.id}
                className={`border-none shadow-sm transition-all rounded-3xl ${
                  isExchanged ? 'opacity-60 grayscale' : isAvailable ? 'ring-2 ring-pink-500/50' : ''
                }`}
              >
                <CardContent className="p-5">
                  <div className="text-5xl mb-4 text-center">{gift.image}</div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-lg text-gray-800">{gift.name}</h3>
                      {isExchanged && <Badge className="bg-emerald-500">교환됨</Badge>}
                    </div>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-1">{gift.description}</p>
                    <Badge variant="secondary" className="text-[10px] bg-gray-100 text-gray-600 border-none px-2">
                      {gift.category}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl mb-4">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">차감 스탬프</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500 fill-current" />
                      <span className="font-extrabold text-gray-800">{gift.requiredStamps}개</span>
                    </div>
                  </div>

                  {isExchanged ? (
                    <Button className="w-full rounded-xl bg-gray-200 text-gray-500" disabled>교환 완료</Button>
                  ) : isAvailable ? (
                    <Button
                      className="w-full rounded-xl bg-pink-600 hover:bg-pink-700 shadow-md font-bold text-white"
                      onClick={() => setSelectedGift(gift)}
                    >
                      지금 교환하기
                    </Button>
                  ) : (
                    <Button className="w-full rounded-xl text-gray-400" disabled variant="outline">
                      <Lock className="w-4 h-4 mr-2 opacity-50" />
                      {isLocked ? `${gift.requiredStamps - stampCount}개 부족` : '교환 불가'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog open={!!selectedGift} onOpenChange={() => setSelectedGift(null)}>
        <DialogContent className="max-w-[320px] rounded-[2rem] p-8 border-none">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-black">선물 교환</DialogTitle>
            <DialogDescription className="text-center pt-2">
              정말로 스탬프 <span className="text-pink-600 font-bold">{selectedGift?.requiredStamps}개</span>를 사용하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          
          {selectedGift && (
            <div className="mt-4">
              <div className="text-7xl text-center py-6 bg-gray-50 rounded-3xl mb-6">{selectedGift.image}</div>
              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1 rounded-2xl font-bold text-gray-400" onClick={() => setSelectedGift(null)}>취소</Button>
                <Button className="flex-1 rounded-2xl bg-pink-600 hover:bg-pink-700 font-bold text-white" onClick={handleExchange}>확인</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}