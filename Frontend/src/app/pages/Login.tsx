import { useNavigate } from 'react-router';
import { Stamp, MapPin } from 'lucide-react';
// import { toast } from 'sonner'; 이제 여기서 통신 안할거라 일단 주석처리

export function Login() {
  const navigate = useNavigate();

  // 현재 접속한 도메인 자동 인식
  const BASE_URL = window.location.origin;

  // 카카오 로그인 설정
  const KAKAO_CLIENT_ID = 'f03731266c0fae4f844f404a0ffc1e10';
  const KAKAO_REDIRECT_URI = `${BASE_URL}/kakaologin`;
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;

  // 네이버 로그인 설정
  const NAVER_CLIENT_ID = 'OU5On9cK56h1zUDeUaAe';
  const NAVER_REDIRECT_URI = `${BASE_URL}/naverlogin`;
  const STATE = Math.random().toString(36).substring(3, 14); // 네이버 해킹 방지용 난수
  const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_REDIRECT_URI}&state=${STATE}`;

  // 구글 로그인 설정
  const GOOGLE_CLIENT_ID = '147281860929-h7ovf71ou4ggb1jve6coujee7fgkqer1.apps.googleusercontent.com';
  const GOOGLE_REDIRECT_URI = `${BASE_URL}/googlelogin`;
  const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=email profile`;

  // 각 버튼 클릭 시 해당 소셜 로그인 페이지로 이동
  const handleKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  const handleNaverLogin = () => {
    window.location.href = NAVER_AUTH_URL;
  };

  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
              <Stamp className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl mb-2">문화재 스탬프 투어</h1>
            <p className="text-gray-600 flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4" />
              문화재를 방문하고 스탬프를 모으세요
            </p>
          </div>

          <div className="space-y-3 mb-4">
            <button
              onClick={handleKakaoLogin}
              className="w-full bg-[#FEE500] text-[#000000] py-3 px-4 rounded-lg flex items-center justify-center gap-3 hover:bg-[#FDDC3F] transition-colors"
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.586 1.793 4.848 4.5 6.364-.196.722-.726 2.667-.833 3.093-.127.506.186.5.39.363.146-.098 2.348-1.613 3.26-2.234C10.127 18.27 11.053 18.5 12 18.5c5.523 0 10-3.477 10-7.5S17.523 3 12 3z"/>
              </svg>
              <span>카카오톡으로 계속하기</span>
            </button>

            <button
              onClick={handleNaverLogin}
              className="w-full bg-[#03C75A] text-white py-3 px-4 rounded-lg flex items-center justify-center gap-3 hover:bg-[#02B350] transition-colors"
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"/>
              </svg>
              <span>네이버로 계속하기</span>
            </button>

            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg border border-gray-300 flex items-center justify-center gap-3 transition-colors"
            >
              <svg className="size-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Google로 계속하기</span>
            </button>
          </div>

          {/* Features */}
          
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          로그인하면 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}