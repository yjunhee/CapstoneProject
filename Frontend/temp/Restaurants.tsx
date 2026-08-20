import { useState } from 'react';
import { MapPin, Star, Navigation as NavigationIcon, Phone, ExternalLink } from 'lucide-react';
import { restaurants, culturalSites } from '../data/mockData';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export function Restaurants() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', '한정식', '한식', '찻집/디저트'];
  
  const filteredRestaurants = selectedCategory === 'all'
    ? restaurants
    : restaurants.filter(r => r.cuisine === selectedCategory);

  const nearbySites = culturalSites
    .filter(s => !s.stampCollected)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">주변 맛집</h1>
        <p className="text-orange-100">문화재 근처 추천 음식점</p>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {/* Category Tabs */}
        <Tabs defaultValue="all" className="mb-4">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="all" onClick={() => setSelectedCategory('all')}>
              전체
            </TabsTrigger>
            <TabsTrigger value="한정식" onClick={() => setSelectedCategory('한정식')}>
              한정식
            </TabsTrigger>
            <TabsTrigger value="한식" onClick={() => setSelectedCategory('한식')}>
              한식
            </TabsTrigger>
            <TabsTrigger value="찻집/디저트" onClick={() => setSelectedCategory('찻집/디저트')}>
              디저트
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Restaurants List */}
        <div className="space-y-4 mb-8">
          <h2 className="font-bold text-lg">
            추천 음식점 ({filteredRestaurants.length})
          </h2>
          
          {filteredRestaurants.map((restaurant) => (
            <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="flex">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-32 h-32 object-cover"
                />
                <CardContent className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{restaurant.name}</h3>
                      <Badge variant="outline" className="text-xs mt-1">
                        {restaurant.cuisine}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-bold">{restaurant.rating}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {restaurant.priceRange}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs">{restaurant.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <NavigationIcon className="w-4 h-4" />
                      <span>도보 {Math.round(restaurant.distance * 12)}분 ({restaurant.distance}km)</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Phone className="w-3 h-3 mr-1" />
                      전화
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      지도
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Nearby Heritage Sites */}
        <div className="space-y-4">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            근처 문화재 추천
          </h2>
          
          <div className="space-y-3">
            {nearbySites.map((site) => (
              <Card key={site.id}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <img
                      src={site.image}
                      alt={site.name}
                      className="w-20 h-20 rounded object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-bold">{site.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {site.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {site.description}
                      </p>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <NavigationIcon className="w-3 h-3" />
                          <span>{site.distance}km</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{site.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <h3 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                맛집 API 정보
              </h3>
              <p className="text-sm text-orange-800">
                카카오 로컬 API를 활용하여 실시간 주변 맛집 정보를 제공합니다.
                현재 위치 기반으로 1km 반경 내 음식점을 검색하고 있습니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
