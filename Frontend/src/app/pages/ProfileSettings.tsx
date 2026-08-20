import { useEffect, useState, useMemo, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Camera,
  User,
  ChevronUp,
  ChevronDown,
  Trophy,
  Target,
  CheckCircle2,
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

interface Landmark {
  id: string;
  name: string;
  region: string;
  stampCollected: boolean;
}

export function ProfileSettings() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [previewImage, setPreviewImage] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [openSections, setOpenSections] = useState({
    myInfo: true,
    challenge: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(userStr);
    setName(user.name || "");
    setEmail(user.email || "");
    setPreviewImage(user.profileImage || "");
    const fetchLandmarks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/landmarks`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setLandmarks(data);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLandmarks();
  }, [navigate]);

  const challenges = useMemo(() => {
    if (landmarks.length === 0) return [];

    const collectedCount = landmarks.filter(l => l.stampCollected).length;

    const isRegionComplete = (regionName: string) => {
      const regionLandmarks = landmarks.filter(l => l.region === regionName);
      if (regionLandmarks.length === 0) return false;
      return regionLandmarks.every(l => l.stampCollected);
    };

    const hasVisited = (name: string) => {
        return landmarks.find(l => l.name.includes(name))?.stampCollected || false;
    }

    const challengeList = [
      { id: 1, title: "첫 스탬프 찍기", completed: collectedCount >= 1 },
      { id: 2, title: "스탬프 10개 찍기", completed: collectedCount >= 10 },
      { id: 3, title: "스탬프 50개 찍기", completed: collectedCount >= 50 },
      { id: 4, title: "스탬프 전부 찍기", completed: collectedCount === landmarks.length && landmarks.length > 0 },
      { id: 5, title: "강원도 전부 채우기", completed: isRegionComplete("강원도") },
      { id: 6, title: "경기도 전부 채우기", completed: isRegionComplete("경기도") },
      { id: 7, title: "경상남도 전부 채우기", completed: isRegionComplete("경상남도") },
      { id: 8, title: "경상북도 전부 채우기", completed: isRegionComplete("경상북도") },
      { id: 9, title: "광주광역시 전부 채우기", completed: isRegionComplete("광주광역시") },
      { id: 10, title: "대구광역시 전부 채우기", completed: isRegionComplete("대구광역시") },
      { id: 11, title: "대전광역시 전부 채우기", completed: isRegionComplete("대전광역시") },
      { id: 12, title: "독도 찍기", completed: hasVisited("독도") },
      { id: 13, title: "부산광역시 채우기", completed: isRegionComplete("부산광역시") },
      { id: 14, title: "서울특별시 채우기", completed: isRegionComplete("서울특별시") },
      { id: 15, title: "울릉도 찍기", completed: hasVisited("울릉도") },
      { id: 16, title: "울산광역시 전부 채우기", completed: isRegionComplete("울산광역시") },
      { id: 17, title: "인천광역시 전부 채우기", completed: isRegionComplete("인천광역시") },
      { id: 18, title: "전라남도 전부 채우기", completed: isRegionComplete("전라남도") },
      { id: 19, title: "전라북도 전부 채우기", completed: isRegionComplete("전라북도") },
      { id: 20, title: "제주도 전부 채우기", completed: isRegionComplete("제주도") },
      { id: 21, title: "충청남도 전부 채우기", completed: isRegionComplete("충청남도") },
      { id: 22, title: "충청북도 전부 채우기", completed: isRegionComplete("충청북도") },
    ];

    //달성된것만 위로
    challengeList.sort((a, b) => {
      if (a.completed === b.completed) {
        return a.id - b.id;
      }
      return a.completed ? -1 : 1;
    });

    return challengeList;
  }, [landmarks]);

  const completedCount = challenges.filter((c) => c.completed).length;
  const challengeRate = challenges.length
    ? Math.round((completedCount / challenges.length) * 100)
    : 0;

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const userStr = localStorage.getItem("user");
    if (!userStr) {
      toast.error("로그인 정보가 없습니다.");
      return;
    }

    const existingUser = JSON.parse(userStr);

    const updatedUser = {
      ...existingUser,
      name,
      email,
      profileImage: previewImage,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    toast.success("프로필이 변경되었습니다.");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold">프로필 / 내정보</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* 내정보 */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleSection("myInfo")}
            className={`w-full flex items-center justify-between p-5 transition-colors ${
              openSections.myInfo ? "bg-purple-50/50" : "bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-500 text-white">
                <User className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-800">내정보 수정</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  프로필 이미지, 이름, 이메일 변경
                </p>
              </div>
            </div>

            {openSections.myInfo ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {openSections.myInfo && (
            <div className="p-4 bg-white border-t border-gray-50 animate-in fade-in slide-in-from-top-2 duration-300">
              <Card>
                <CardHeader>
                  <CardTitle>내 정보</CardTitle>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative">
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt="프로필 미리보기"
                            className="w-24 h-24 rounded-full object-cover border"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                            <User className="w-10 h-10" />
                          </div>
                        )}

                        <label
                          htmlFor="profile-image"
                          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer shadow"
                        >
                          <Camera className="w-4 h-4" />
                        </label>
                      </div>

                      <input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />

                      <p className="text-sm text-gray-500">
                        프로필 이미지를 변경할 수 있습니다
                      </p>

                      {selectedFile && (
                        <p className="text-xs text-gray-400">{selectedFile.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">이름</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="이름 입력"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">이메일</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="이메일 입력"
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      저장하기
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* 도전과제 */}
        <div
          className={`bg-white rounded-3xl shadow-sm border overflow-hidden transition-all ${
            challengeRate >= 80
              ? "border-emerald-200 ring-1 ring-emerald-100"
              : "border-gray-100"
          }`}
        >
          <button
            type="button"
            onClick={() => toggleSection("challenge")}
            className={`w-full flex items-center justify-between p-5 transition-colors ${
              openSections.challenge
                ? challengeRate >= 80
                  ? "bg-emerald-50/50"
                  : "bg-purple-50/50"
                : "bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  challengeRate >= 80
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {challengeRate >= 80 ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <Target className="w-5 h-5" />
                )}
              </div>

              <div className="text-left">
                <h3
                  className={`font-bold ${
                    challengeRate >= 80 ? "text-emerald-700" : "text-gray-800"
                  }`}
                >
                  도전과제
                </h3>

                <div className="flex items-center gap-2 mt-1">
                  <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        challengeRate >= 80 ? "bg-emerald-500" : "bg-purple-500"
                      }`}
                      style={{ width: `${challengeRate}%` }}
                    />
                  </div>
                  <p
                    className={`text-[10px] font-bold ${
                      challengeRate >= 80 ? "text-emerald-600" : "text-gray-400"
                    }`}
                  >
                    {challengeRate}% ({completedCount}/{challenges.length})
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {challengeRate >= 80 && (
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-2 py-0.5 font-bold text-[10px]">
                  완료됨
                </Badge>
              )}
              {openSections.challenge ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </button>

          {openSections.challenge && (
            <div className="p-4 grid grid-cols-1 gap-3 bg-white border-t border-gray-50 animate-in fade-in slide-in-from-top-2 duration-300">
              {challenges.map((item) => (
                <Card
                  key={item.id}
                  className={`border-none shadow-sm rounded-2xl ${
                    !item.completed ? "opacity-70" : ""
                  }`}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h4
                        className={`font-bold text-sm ${
                          item.completed ? "text-gray-800" : "text-gray-400"
                        }`}
                      >
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">
                        {item.completed ? "달성 완료" : "미달성"}
                      </p>
                    </div>

                    {item.completed && (
                      <Badge className="bg-purple-600 border-none px-2 py-1">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* 리더보드 */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleSection("leaderboard")}
            className={`w-full flex items-center justify-between p-5 transition-colors ${
              openSections.leaderboard ? "bg-yellow-50/50" : "bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-yellow-500 text-white">
                <Trophy className="w-5 h-5" />
              </div>

              <div className="text-left">
                <h3 className="font-bold text-gray-800">리더보드</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  사용자 순위 및 점수
                </p>
              </div>
            </div>

            {openSections.leaderboard ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {openSections.leaderboard && (
            <div className="p-4 grid grid-cols-1 gap-3 bg-white border-t border-gray-50 animate-in fade-in slide-in-from-top-2 duration-300">
              {leaderboard.map((user) => (
                <Card key={user.id} className="border-none shadow-sm rounded-2xl">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm text-gray-700">
                        {user.rank}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-800">
                          {user.name}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">
                          점수 {user.score}점
                        </p>
                      </div>
                    </div>

                    {user.rank <= 3 && (
                      <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none">
                        TOP {user.rank}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}