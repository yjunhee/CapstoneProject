// Mock data for the cultural heritage stamp tour app

export interface CulturalSite {
  id: string;
  name: string;
  description: string;
  image: string;
  location: string;
  category: string;
  distance: number; // in km
  lat: number;
  lng: number;
  stampCollected: boolean;
  rating: number;
  reviewCount: number;
  region: string;
}

export interface Stamp {
  id: string;
  siteId: string;
  siteName: string;
  collectedAt: Date;
  image: string;
}

export interface Review {
  id: string;
  siteId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: Date;
  photos?: string[];
}

export interface Gift {
  id: string;
  name: string;
  description: string;
  requiredStamps: number;
  image: string;
  available: boolean;
  category: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  distance: number;
  image: string;
  priceRange: string;
  address: string;
}

export const culturalSites: CulturalSite[] = [
  {
    id: '1',
    name: '경복궁',
    description: '조선왕조의 정궁으로 1395년에 창건된 궁궐',
    image: 'https://images.unsplash.com/photo-1644380031300-2af18adec01c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMHBhbGFjZSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzMzODY1MDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    location: '서울특별시 종로구',
    category: '궁궐',
    distance: 0.5,
    lat: 37.5788,
    lng: 126.9770,
    stampCollected: true,
    rating: 4.7,
    reviewCount: 1523,
    region: '서울특별시'
  },
  {
    id: '2',
    name: '조계사',
    description: '대한불교조계종의 총본산으로 도심 속 전통 사찰',
    image: 'https://images.unsplash.com/photo-1662527982815-1f2d12d183aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0ZW1wbGUlMjBidWRkaGlzdHxlbnwxfHx8fDE3NzMzODY1MDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    location: '서울특별시 종로구',
    category: '사찰',
    distance: 1.2,
    lat: 37.5717,
    lng: 126.9816,
    stampCollected: true,
    rating: 4.5,
    reviewCount: 892,
    region: '서울특별시'
  },
  {
    id: '3',
    name: '숭례문',
    description: '서울의 남대문으로 국보 제1호',
    image: 'https://images.unsplash.com/photo-1655212055884-1e785700d10f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMGdhdGV8ZW58MXx8fHwxNzczMzg2NTA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    location: '서울특별시 중구',
    category: '문루',
    distance: 2.3,
    lat: 37.5596,
    lng: 126.9752,
    stampCollected: false,
    rating: 4.6,
    reviewCount: 1104,
    region: '서울특별시'
  },
  {
    id: '4',
    name: '한양도성',
    description: '조선시대 한양을 둘러싼 성곽',
    image: 'https://images.unsplash.com/photo-1767715517955-903149d3e6d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBmb3J0cmVzcyUyMHdhbGx8ZW58MXx8fHwxNzczMzg2NTA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    location: '서울특별시 종로구',
    category: '성곽',
    distance: 1.8,
    lat: 37.5834,
    lng: 126.9845,
    stampCollected: false,
    rating: 4.8,
    reviewCount: 756,
    region: '서울특별시'
  },
  {
    id: '5',
    name: '창덕궁',
    description: '유네스코 세계문화유산에 등재된 조선의 궁궐',
    image: 'https://images.unsplash.com/photo-1644380031300-2af18adec01c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMHBhbGFjZSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzMzODY1MDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    location: '서울특별시 종로구',
    category: '궁궐',
    distance: 1.5,
    lat: 37.5794,
    lng: 126.9910,
    stampCollected: true,
    rating: 4.9,
    reviewCount: 2341,
    region: '서울특별시'
  },
  {
    id: '6',
    name: 'N서울타워',
    description: '서울의 전경을 한눈에 볼 수 있는 남산의 상징적 랜드마크',
    image: 'https://images.unsplash.com/photo-1590632349780-e32049e78263?q=80&w=1080',
    location: '서울특별시 용산구 남산공원길 105',
    category: '전망대',
    distance: 3.2,
    lat: 37.5511,
    lng: 126.9882,
    stampCollected: false,
    rating: 4.8,
    reviewCount: 4500,
    region: '서울특별시'
  },
  // --- 경기도 ---
  {
    id: '7',
    name: '수원 화성',
    description: '조선 정조 시대의 성곽 건축의 꽃, 유네스코 세계문화유산',
    image: 'https://images.unsplash.com/photo-1599659067134-8c46433290b3?q=80&w=1080',
    location: '경기도 수원시 팔달구 정조로 825',
    category: '성곽',
    distance: 0.0,
    lat: 37.2826,
    lng: 127.0142,
    stampCollected: false,
    rating: 4.7,
    reviewCount: 3200,
    region: '경기도'
  },
  // --- 강원도 ---
  {
    id: '8',
    name: '낙산사',
    description: '동해가 한눈에 내려다보이는 관음성지 사찰',
    image: 'https://images.unsplash.com/photo-1621258169145-2b4772658c2c?q=80&w=1080',
    location: '강원특별자치도 양양군 강현면 낙산사로 100',
    category: '사찰',
    distance: 0.0,
    lat: 38.1251,
    lng: 128.6293,
    stampCollected: false,
    rating: 4.9,
    reviewCount: 2100,
    region: '강원도'
  },
  // --- 경상북도 ---
  {
    id: '9',
    name: '불국사',
    description: '신라 불교 문화의 정수, 다보탑과 석가탑이 있는 곳',
    image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=1080',
    location: '경상북도 경주시 불국로 385',
    category: '사찰',
    distance: 0.0,
    lat: 35.7901,
    lng: 129.3321,
    stampCollected: false,
    rating: 4.9,
    reviewCount: 5600,
    region: '경상북도'
  },
  {
    id: '10',
    name: '첨성대',
    description: '동양에서 가장 오래된 천문 관측대',
    image: 'https://images.unsplash.com/photo-1624505298165-220050e80456?q=80&w=1080',
    location: '경상북도 경주시 첨성로 140-25',
    category: '유적지',
    distance: 0.0,
    lat: 35.8347,
    lng: 129.2190,
    stampCollected: false,
    rating: 4.6,
    reviewCount: 3800,
    region: '경상북도'
  },
  // --- 부산광역시 ---
  {
    id: '11',
    name: '해동용궁사',
    description: '바다 위에 지어진 한국에서 가장 아름다운 사찰',
    image: 'https://images.unsplash.com/photo-1614066060010-3882f073d74c?q=80&w=1080',
    location: '부산광역시 기장군 기장읍 용궁길 86',
    category: '사찰',
    distance: 0.0,
    lat: 35.1885,
    lng: 129.2234,
    stampCollected: false,
    rating: 4.7,
    reviewCount: 2900,
    region: '부산광역시'
  },
  // --- 전라남도 ---
  {
    id: '12',
    name: '여수 돌산대교',
    description: '밤바다가 아름다운 여수의 상징적인 대교',
    image: 'https://images.unsplash.com/photo-1540960351744-8846be068417?q=80&w=1080',
    location: '전라남도 여수시 돌산읍',
    category: '교량',
    distance: 0.0,
    lat: 34.7298,
    lng: 127.7303,
    stampCollected: false,
    rating: 4.8,
    reviewCount: 1800,
    region: '전라남도'
  },
  // --- 제주특별자치도 ---
  {
    id: '13',
    name: '성산일출봉',
    description: '바다 위에 솟아오른 거대한 성채 모양의 화산체',
    image: 'https://images.unsplash.com/photo-1612977437034-483a02fa5531?q=80&w=1080',
    location: '제주특별자치도 서귀포시 성산읍 일출로 284-6',
    category: '자연',
    distance: 0.0,
    lat: 33.4585,
    lng: 126.9423,
    stampCollected: false,
    rating: 4.9,
    reviewCount: 7200,
    region: '제주도'
  },
  // --- 충청남도 ---
  {
    id: '14',
    name: '공주 공산성',
    description: '백제 시대의 도읍지를 지키던 산성',
    image: 'https://images.unsplash.com/photo-1632733796839-84724a275e7a?q=80&w=1080',
    location: '충청남도 공주시 금성동 53-51',
    category: '성곽',
    distance: 0.0,
    lat: 36.4608,
    lng: 127.1215,
    stampCollected: false,
    rating: 4.5,
    reviewCount: 1200,
    region: '충청남도'
  },
  // --- 경상남도 ---
  {
    id: '15',
    name: '진주성',
    description: '임진왜란 3대 대첩 중 하나인 진주대첩의 현장',
    image: 'https://images.unsplash.com/photo-1601618361822-19e346513361?q=80&w=1080',
    location: '경상남도 진주시 남강로 626',
    category: '성곽',
    distance: 0.0,
    lat: 35.1881,
    lng: 128.0772,
    stampCollected: false,
    rating: 4.6,
    reviewCount: 950,
    region: '경상남도'
  },
  // --- 경상북도 (독도 포함) ---
  {
    id: '16',
    name: '독도',
    description: '대한민국 최동단, 역사적·지리적·국제법적으로 명백한 우리 고유의 영토',
    // 이미지 로딩 안될 시 대체 이미지 사용 (Placeholder)
    image: 'https://images.unsplash.com/photo-1610912170881-22e37996c5c0?q=80&w=800&h=600&fit=crop',
    location: '경상북도 울릉군 울릉읍 독도리',
    category: '섬/자연',
    distance: 0.0,
    lat: 37.2447,
    lng: 131.8696,
    stampCollected: false,
    rating: 5.0, // 우리 땅이니까 5점!
    reviewCount: 10004,
    region: '경상북도'
  },
  {
    id: '17',
    name: '안동 하회마을',
    description: '풍산 류씨가 600여 년간 대대로 살아온 한국의 대표적인 동성(同姓)마을',
    image: 'https://images.unsplash.com/photo-1623916298285-b88934571ac3?q=80&w=800&h=600&fit=crop',
    location: '경상북도 안동시 풍천면 하회종가길 2-1',
    category: '민속마을',
    distance: 0.0,
    lat: 36.5392,
    lng: 128.5186,
    stampCollected: false,
    rating: 4.7,
    reviewCount: 2800,
    region: '경상북도'
  },
  // --- 서울특별시 ---
  {
    id: '18',
    name: '롯데월드타워',
    description: '대한민국 최고층 빌딩(123층, 555m)이자 서울의 새로운 마천루',
    image: 'https://images.unsplash.com/photo-1596404988775-6900f9547d95?q=80&w=800&h=600&fit=crop',
    location: '서울특별시 송파구 올림픽로 300',
    category: '전망대/복합시설',
    distance: 0.0,
    lat: 37.5126,
    lng: 127.1025,
    stampCollected: false,
    rating: 4.8,
    reviewCount: 8500,
    region: '서울특별시'
  },
  {
    id: '19',
    name: '명동성당',
    description: '한국 가톨릭교회의 상징이자 대표적인 고딕 양식 건축물',
    image: 'https://images.unsplash.com/photo-1616782410631-6e8d11d13f57?q=80&w=800&h=600&fit=crop',
    location: '서울특별시 중구 명동길 74',
    category: '성당/건축',
    distance: 0.0,
    lat: 37.5632,
    lng: 126.9874,
    stampCollected: false,
    rating: 4.6,
    reviewCount: 3100,
    region: '서울특별시'
  },
  // --- 부산광역시 ---
  {
    id: '20',
    name: '감천문화마을',
    description: '산자락을 따라 계단식으로 들어선 파스텔톤 집들이 이루는 아름다운 정경',
    image: 'https://images.unsplash.com/photo-1649232812046-6819548bd2d0?q=80&w=800&h=600&fit=crop',
    location: '부산광역시 사하구 감내2로 203',
    category: '벽화마을/문화공간',
    distance: 0.0,
    lat: 35.0975,
    lng: 129.0105,
    stampCollected: false,
    rating: 4.7,
    reviewCount: 5200,
    region: '부산광역시'
  },
  // --- 경기도 ---
  {
    id: '21',
    name: '한국민속촌',
    description: '조선시대 후기의 생활상을 재현한 국내 유일의 전통문화 테마파크',
    image: 'https://images.unsplash.com/photo-1632733796839-84724a275e7a?q=80&w=800&h=600&fit=crop', // 화성 이미지 재활용 (민속촌 느낌)
    location: '경기도 용인시 기흥구 민속촌로 90',
    category: '테마파크/민속',
    distance: 0.0,
    lat: 37.2586,
    lng: 127.1166,
    stampCollected: false,
    rating: 4.6,
    reviewCount: 4300,
    region: '경기도'
  },
  // --- 인천광역시 ---
  {
    id: '22',
    name: '송도 센트럴파크',
    description: '대한민국 최초로 바닷물을 이용한 해수 공원이자 국제도시의 휴식처',
    image: 'https://images.unsplash.com/photo-1601618361822-19e346513361?q=80&w=800&h=600&fit=crop', // 진주성 이미지 재활용 (현대적 건축물 느낌)
    location: '인천광역시 연수구 컨벤시아대로 160',
    category: '공원/도시공원',
    distance: 0.0,
    lat: 37.3917,
    lng: 126.6385,
    stampCollected: false,
    rating: 4.8,
    reviewCount: 3700,
    region: '인천광역시'
  },
  // --- 강원도 ---
  {
    id: '23',
    name: '남이섬',
    description: '메타세쿼이아 길과 다양한 문화예술 행사가 열리는 동화 같은 섬',
    image: 'https://images.unsplash.com/photo-1621258169145-2b4772658c2c?q=80&w=800&h=600&fit=crop', // 낙산사 이미지 재활용 (자연 느낌)
    location: '강원특별자치도 춘천시 남산면 남이섬길 1',
    category: '섬/자연테마',
    distance: 0.0,
    lat: 37.7911,
    lng: 127.5255,
    stampCollected: false,
    rating: 4.7,
    reviewCount: 6500,
    region: '강원도'
  },
  // --- 전라북도 ---
  {
    id: '24',
    name: '전주 한옥마을',
    description: '700여 채의 한옥이 군락을 이루고 있는 국내 최대 규모의 한옥 주거지',
    image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=800&h=600&fit=crop', // 불국사 이미지 재활용 (전통 느낌)
    location: '전라북도 전주시 완산구 기린대로 99',
    category: '한옥마을',
    distance: 0.0,
    lat: 35.8146,
    lng: 127.1528,
    stampCollected: false,
    rating: 4.8,
    reviewCount: 9200,
    region: '전라북도'
  },
  // --- 전라남도 ---
  {
    id: '25',
    name: '순천만국가정원',
    description: '세계 5대 연안습지인 순천만을 보호하기 위해 조성된 대한민국 1호 국가정원',
    image: 'https://images.unsplash.com/photo-1614066060010-3882f073d74c?q=80&w=800&h=600&fit=crop', // 해동용궁사 이미지 재활용 (자연 느낌)
    location: '전라남도 순천시 국가정원1호길 162-11',
    category: '정원/자연',
    distance: 0.0,
    lat: 34.9312,
    lng: 127.5103,
    stampCollected: false,
    rating: 4.9,
    reviewCount: 5100,
    region: '전라남도'
  },
  // --- 충청북도 ---
  {
    id: '26',
    name: '단양 도담삼봉',
    description: '남한강 상류 한가운데 솟은 세 개의 기암봉우리',
    image: 'https://images.unsplash.com/photo-1540960351744-8846be068417?q=80&w=800&h=600&fit=crop', // 돌산대교 이미지 재활용 (수변 느낌)
    location: '충청북도 단양군 매포읍 삼봉로 644',
    category: '자연명승',
    distance: 0.0,
    lat: 36.9926,
    lng: 128.3491,
    stampCollected: false,
    rating: 4.6,
    reviewCount: 1900,
    region: '충청북도'
  },
  // --- 충청남도 ---
  {
    id: '27',
    name: '태안 꽃지해수욕장',
    description: '할미·할아비 바위 너머로 지는 낙조가 아름다운 서해안 대표 해수욕장',
    image: 'https://images.unsplash.com/photo-1612977437034-483a02fa5531?q=80&w=800&h=600&fit=crop', // 성산일출봉 이미지 재활용 (해변 느낌)
    location: '충청남도 태안군 안면읍 승언리',
    category: '해수욕장/자연',
    distance: 0.0,
    lat: 36.5023,
    lng: 126.3312,
    stampCollected: false,
    rating: 4.7,
    reviewCount: 2300,
    region: '충청남도'
  },
  // --- 대전광역시 ---
  {
    id: '28',
    name: '엑스포과학공원 (한빛탑)',
    description: '93년 대전 엑스포의 상징이자 대전의 과거와 미래를 연결하는 랜드마크',
    image: 'https://images.unsplash.com/photo-1644380031300-2af18adec01c?q=80&w=800&h=600&fit=crop', // 경복궁 이미지 재활용 (건축물 느낌)
    location: '대전광역시 유성구 대덕대로 480',
    category: '테마공원/전망대',
    distance: 0.0,
    lat: 36.3761,
    lng: 127.3871,
    stampCollected: false,
    rating: 4.5,
    reviewCount: 1500,
    region: '대전광역시'
  },
  // --- 대구광역시 ---
  {
    id: '29',
    name: '김광석 다시그리기길',
    description: '고(故) 김광석의 삶과 음악을 벽화와 조형물로 만나는 추억의 거리',
    image: 'https://images.unsplash.com/photo-1662527982815-1f2d12d183aa?q=80&w=800&h=600&fit=crop', // 조계사 이미지 재활용 (도심 속 문화 느낌)
    location: '대구광역시 중구 달구벌대로 2238',
    category: '벽화거리/문화공간',
    distance: 0.0,
    lat: 35.8608,
    lng: 128.6074,
    stampCollected: false,
    rating: 4.6,
    reviewCount: 2600,
    region: '대구광역시'
  },
  // --- 광주광역시 ---
  {
    id: '30',
    name: '국립아시아문화전당(ACC)',
    description: '아시아의 문화 교류와 창제작을 위한 세계적 규모의 복합 문화예술 기관',
    image: 'https://images.unsplash.com/photo-1655212055884-1e785700d10f?q=80&w=800&h=600&fit=crop', // 숭례문 이미지 재활용 (현대적 건축 느낌)
    location: '광주광역시 동구 문화전당로 38',
    category: '문화전당/복합공간',
    distance: 0.0,
    lat: 35.1471,
    lng: 126.9201,
    stampCollected: false,
    rating: 4.7,
    reviewCount: 1800,
    region: '광주광역시'
  }
];

export const collectedStamps: Stamp[] = [
  {
    id: 's1',
    siteId: '1',
    siteName: '경복궁',
    collectedAt: new Date('2026-03-10T10:30:00'),
    image: 'https://images.unsplash.com/photo-1644380031300-2af18adec01c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMHBhbGFjZSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzMzODY1MDh8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 's2',
    siteId: '2',
    siteName: '조계사',
    collectedAt: new Date('2026-03-11T14:20:00'),
    image: 'https://images.unsplash.com/photo-1662527982815-1f2d12d183aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0ZW1wbGUlMjBidWRkaGlzdHxlbnwxfHx8fDE3NzMzODY1MDh8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 's3',
    siteId: '5',
    siteName: '창덕궁',
    collectedAt: new Date('2026-03-12T11:00:00'),
    image: 'https://images.unsplash.com/photo-1644380031300-2af18adec01c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMHBhbGFjZSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzMzODY1MDh8MA&ixlib=rb-4.1.0&q=80&w=1080'
  }
];

export const reviews: Review[] = [
  {
    id: 'r1',
    siteId: '1',
    userName: '김민수',
    userAvatar: '👤',
    rating: 5,
    comment: '정말 아름다운 궁궐입니다. 특히 경회루의 야경이 멋있어요!',
    createdAt: new Date('2026-03-09T15:30:00')
  },
  {
    id: 'r2',
    siteId: '1',
    userName: '이지은',
    userAvatar: '👤',
    rating: 4,
    comment: '관람객이 많아서 조금 복잡했지만 볼거리가 정말 많습니다.',
    createdAt: new Date('2026-03-08T11:20:00')
  },
  {
    id: 'r3',
    siteId: '2',
    userName: '박서준',
    userAvatar: '👤',
    rating: 5,
    comment: '도심 속에서 평화로운 시간을 보낼 수 있었어요.',
    createdAt: new Date('2026-03-11T16:45:00')
  }
];

export const gifts: Gift[] = [
  {
    id: 'g1',
    name: '전통 부채',
    description: '한국 전통 문양이 그려진 수공예 부채',
    requiredStamps: 3,
    image: '🪭',
    available: true,
    category: '전통공예'
  },
  {
    id: 'g2',
    name: '문화상품권',
    description: '1만원 문화상품권',
    requiredStamps: 5,
    image: '🎫',
    available: true,
    category: '상품권'
  },
  {
    id: 'g3',
    name: '전통 찻잔 세트',
    description: '청자 문양의 전통 찻잔 세트',
    requiredStamps: 7,
    image: '🍵',
    available: false,
    category: '전통공예'
  },
  {
    id: 'g4',
    name: '궁중 한과 세트',
    description: '전통 방식으로 만든 궁중 한과 선물 세트',
    requiredStamps: 10,
    image: '🍪',
    available: false,
    category: '음식'
  },
  {
    id: 'g5',
    name: '한복 체험권',
    description: '전통 한복 대여 및 촬영 체험권 (1일)',
    requiredStamps: 15,
    image: '👘',
    available: false,
    category: '체험'
  }
];

