import { Facebook } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: { id: string; name: string; email: string; avatar: string }) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const handleFacebookLogin = () => {
    // Mock Facebook SSO login
    const mockUser = {
      id: '1',
      name: '김요리',
      email: 'kim.yori@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
    };
    onLogin(mockUser);
  };

  const handleKakaoLogin = () => {
    // Mock Kakao SSO login
    const mockUser = {
      id: '2',
      name: '박맛집',
      email: 'park.matjib@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
    };
    onLogin(mockUser);
  };

  const handleNaverLogin = () => {
    // Mock Naver SSO login
    const mockUser = {
      id: '3',
      name: '이셰프',
      email: 'lee.chef@example.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop'
    };
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🍳</div>
            <h1 className="text-3xl mb-2">맛있는 레시피</h1>
            <p className="text-gray-600">요리를 사랑하는 사람들의 커뮤니티</p>
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
              onClick={handleFacebookLogin}
              className="w-full bg-[#1877F2] text-white py-3 px-4 rounded-lg flex items-center justify-center gap-3 hover:bg-[#0c63d4] transition-colors"
            >
              <Facebook className="size-5" />
              <span>Facebook으로 계속하기</span>
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">또는</span>
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="이메일"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="password"
              placeholder="비밀번호"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors">
              로그인
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            계정이 없으신가요?{' '}
            <button className="text-orange-500 hover:text-orange-600">
              회원가입
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}