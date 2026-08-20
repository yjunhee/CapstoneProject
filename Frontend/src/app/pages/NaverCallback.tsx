import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export function NaverCallback() {
    const navigate = useNavigate();
    const isProcessed = useRef(false);

    useEffect(() => {
        if (isProcessed.current) return;
        isProcessed.current = true;

        const urlParams = new URL(window.location.href).searchParams;
        const code = urlParams.get('code');
        const state = urlParams.get('state'); // 네이버는 state 값도 필수!

        if (code && state) {
            console.log('네이버 인가 코드 확보 완료:', code);
            sendCodeToBackend(code, state);
        } else {
            toast.error('네이버 로그인 에러', {
                description: '인증 코드를 받아오지 못했습니다.'
            });
            navigate('/login');
        }
    }, [navigate]);

    // 뽑아낸 코드와 state를 백엔드로 전송
    const sendCodeToBackend = async (code: string, state: string) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/naver', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, state }), // state도 같이 전송
            });

            if (!response.ok) {
                throw new Error('백엔드 서버 응답 에러!');
            }

            const data = await response.json();
            console.log('백엔드에서 처리 후 받은 응답:', data);

            // (수정)JWT 토큰 저장
            localStorage.setItem('token', data.token);

            // 백엔드에서 준 유저 데이터를 로컬 스토리지에 저장
            localStorage.setItem('user', JSON.stringify({
                ...data.user,
                loginAt: new Date().toISOString()
            }));

            toast.success('네이버 로그인 성공!', {
                description: `${data.user.name || '사용자'}님, 환영합니다!`
            });

            // 메인 홈 화면으로 이동
            navigate('/');

        } catch (error) {
            console.error('로그인 실패:', error);
            toast.error('네이버 로그인 처리 실패', {
                description: '네이버 로그인 중 문제가 발생하였습니다.'
            });
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 text-center">
                <div className="animate-spin inline-block w-10 h-10 border-[4px] border-current border-t-transparent text-[#03C75A] rounded-full mb-4" role="status" aria-label="loading"></div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">네이버 로그인 중...</h2>
                <p className="text-gray-500 text-sm">스탬프 투어를 준비하고 있어요!</p>
            </div>
        </div>
    );
}