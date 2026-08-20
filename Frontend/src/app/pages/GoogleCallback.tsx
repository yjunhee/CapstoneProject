import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export function GoogleCallback() {
    const navigate = useNavigate();
    const isProcessed = useRef(false);

    useEffect(() => {
        if (isProcessed.current) return;
        isProcessed.current = true;

        const code = new URL(window.location.href).searchParams.get('code');

        if (code) {
            console.log('구글 인가 코드 확보 완료:', code);
            sendCodeToBackend(code);
        } else {
            toast.error('구글 로그인 에러', {
                description: '인증 코드를 받아오지 못했습니다.'
            });
            navigate('/login');
        }
    }, [navigate]);

    const sendCodeToBackend = async (code: string) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            });

            if (!response.ok) {
                throw new Error('백엔드 서버 응답 에러!');
            }

            const data = await response.json();
            console.log('백엔드에서 처리 후 받은 응답:', data);

            // (수정)JWT 토큰 저장
            localStorage.setItem('token', data.token);

            // 유저 데이터 저장
            localStorage.setItem('user', JSON.stringify({
                ...data.user,
                loginAt: new Date().toISOString()
            }));

            toast.success('구글 로그인 성공!', {
                description: `${data.user.name || '사용자'}님, 환영합니다!`
            });

            navigate('/');

        } catch (error) {
            console.error('로그인 실패:', error);
            toast.error('구글 로그인 처리 실패', {
                description: '구글 로그인 중 문제가 발생하였습니다.'
            });
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 text-center">
                <div className="animate-spin inline-block w-10 h-10 border-[4px] border-current border-t-transparent text-[#4285F4] rounded-full mb-4" role="status" aria-label="loading"></div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">구글 로그인 중...</h2>
                <p className="text-gray-500 text-sm">스탬프 투어를 준비하고 있어요!</p>
            </div>
        </div>
    );
}