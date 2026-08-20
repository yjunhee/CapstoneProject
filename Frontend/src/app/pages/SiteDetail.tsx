import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Star, MapPin, Navigation as NavigationIcon, MessageSquare, Camera } from 'lucide-react';
import { culturalSites, reviews as allReviews, Review } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';

export function SiteDetail() {
  const { id } = useParams();
  const site = culturalSites.find(s => s.id === id);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState<Review[]>(
    allReviews.filter(r => r.siteId === id)
  );

  if (!site) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">문화재를 찾을 수 없습니다</h2>
          <Link to="/">
            <Button>홈으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmitReview = () => {
    if (rating === 0) {
      toast.error('별점을 선택해주세요');
      return;
    }
    if (!comment.trim()) {
      toast.error('댓글을 작성해주세요');
      return;
    }

    const newReview: Review = {
      id: `r${Date.now()}`,
      siteId: site.id,
      userName: '나',
      userAvatar: '👤',
      rating,
      comment,
      createdAt: new Date()
    };

    setReviews([newReview, ...reviews]);
    setRating(0);
    setComment('');
    toast.success('리뷰가 등록되었습니다!');
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : site.rating.toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Image */}
      <div className="relative h-64">
        <img
          src={site.image}
          alt={site.name}
          className="w-full h-full object-cover"
        />
        <Link to="/">
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-4 left-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        {site.stampCollected && (
          <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full font-medium flex items-center gap-2">
            <Star className="w-4 h-4 fill-current" />
            스탬프 수집완료
          </div>
        )}
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {/* Site Info */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <h1 className="text-2xl font-bold mb-2">{site.name}</h1>
          <p className="text-gray-600 mb-4">{site.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{site.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <NavigationIcon className="w-4 h-4 text-gray-500" />
              <span>{site.distance}km 거리</span>
            </div>
          </div>

          {!site.stampCollected && (
            <Link to="/camera">
              <Button className="w-full">
                <Camera className="w-4 h-4 mr-2" />
                스탬프 찍으러 가기
              </Button>
            </Link>
          )}
        </div>

        {/* Rating Overview */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              평점 및 리뷰
            </h2>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-500">{averageRating}</div>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i <= Math.round(parseFloat(averageRating))
                          ? 'fill-amber-500 text-amber-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-gray-600 text-sm mb-1">
                  총 {reviews.length + site.reviewCount}개의 리뷰
                </div>
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviews.filter(r => r.rating === star).length;
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs mb-1">
                      <span className="w-8">{star}점</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-amber-500 h-1.5 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-gray-500">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Write Review */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="font-bold mb-3">리뷰 작성하기</h3>
            
            {/* Star Rating */}
            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  onClick={() => setRating(i)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      i <= rating
                        ? 'fill-amber-500 text-amber-500'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-gray-600">{rating}점</span>
              )}
            </div>

            <Textarea
              placeholder="이곳을 방문한 경험을 공유해주세요..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mb-3"
              rows={4}
            />

            <Button className="w-full" onClick={handleSubmitReview}>
              <MessageSquare className="w-4 h-4 mr-2" />
              리뷰 등록
            </Button>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="space-y-3">
          <h3 className="font-bold text-lg">전체 리뷰 ({reviews.length})</h3>
          
          {reviews.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                아직 리뷰가 없습니다. 첫 리뷰를 작성해보세요!
              </CardContent>
            </Card>
          ) : (
            reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{review.userAvatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold">{review.userName}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i <= review.rating
                                ? 'fill-amber-500 text-amber-500'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 text-sm">{review.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
