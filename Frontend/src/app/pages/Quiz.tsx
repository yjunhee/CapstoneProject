import React, { useEffect, useMemo, useState } from 'react';

type QuizItem = {
    id: number;
    question: string;
    answer: boolean;
    explanation: string;
};

export function Quiz() {
    const params = useMemo(() => new URLSearchParams(window.location.search), []);

    const landmarkId = params.get('id');
    const landmarkName = params.get('name') || '문화재';
    const region = params.get('region') || '지역 정보 없음';

    const [quiz, setQuiz] = useState<QuizItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!landmarkId) return;

        const fetchQuiz = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:5000/api/quizzes/${landmarkId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('퀴즈를 불러오는데 실패했습니다.');
                }

                const data = await response.json();
                
                // o,x를 true, false로 변환하여 저장
                setQuiz({
                    id: data.id,
                    question: data.question,
                    answer: data.answer === 'O',
                    explanation: data.explanation
                });

            } catch (error) {
                console.error('퀴즈 로딩 에러:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchQuiz();
    }, [landmarkId]);

    const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const isCorrect = submitted && quiz && selectedAnswer === quiz.answer;

    const handleChoice = (value: boolean) => {
        if (submitted) return;
        setSelectedAnswer(value);
        setSubmitted(true);
    };

    const handleBackWithStamp = async () => {
        if (!landmarkId) {
            window.location.href = `/`; 
            return;
        }

        try {
            const token = localStorage.getItem('token'); 
            
            const response = await fetch('http://localhost:5000/api/stamps', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ landmarkId }) 
            });

            if (response.ok) {
                alert(`${landmarkName} 스탬프 획득!`);
            } else if (response.status === 409) {
                alert('이미 스탬프를 획득한 장소입니다!');
            } else {
                alert('스탬프 저장 실패.');
            }
        } catch (error) {
            console.error('스탬프 저장 중 오류 발생:', error);
            alert('네트워크 오류가 발생했습니다.');
        } finally {
            window.location.href = `/`; 
        }
    };


    const handleRetry = () => {
        setSelectedAnswer(null);
        setSubmitted(false);
    };

    const cardClassName = submitted
        ? isCorrect
            ? 'border-green-400 bg-green-50'
            : 'border-red-400 bg-red-50'
        : 'border-pink-200 bg-white';

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8]">
                <div className="text-center font-bold text-gray-500 animate-pulse">
                    퀴즈를 불러오는 중입니다...
                </div>
            </div>
        );
    }

    // 퀴즈 없을 때 
    if (!quiz) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f8f8] gap-4">
                <div className="text-center font-bold text-red-500">
                    해당 장소의 퀴즈를 찾을 수 없습니다.
                </div>
                <button onClick={() => window.location.href = '/'} className="px-4 py-2 bg-slate-900 text-white rounded-xl">
                    지도로 돌아가기
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f8f8] px-4 py-6 pb-24">
            <div className="mx-auto max-w-2xl">
                <div
                    className={`rounded-[28px] border-[4px] p-5 shadow-sm transition-all ${cardClassName}`}
                >
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-[15px] text-slate-700">문화재 퀴즈 / {landmarkName}</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <p className="text-right text-[15px] text-slate-700">{landmarkName}</p>
                        <p className="mt-2 text-[18px] leading-9 text-slate-800">
                            {quiz.question}
                        </p>
                    </div>

                    <div className="my-6 border-t border-slate-300" />

                    <div className="space-y-4">
                        <button
                            type="button"
                            onClick={() => handleChoice(true)}
                            className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-5 text-left transition ${
                                submitted
                                    ? selectedAnswer === true
                                        ? isCorrect
                                            ? 'border-green-500 bg-white'
                                            : 'border-red-500 bg-white'
                                        : 'border-slate-200 bg-white'
                                    : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                            }`}
                        >
                            <span className="text-[22px] font-semibold text-slate-800">O</span>
                            <span className="text-[16px] text-slate-700">맞다</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleChoice(false)}
                            className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-5 text-left transition ${
                                submitted
                                    ? selectedAnswer === false
                                        ? isCorrect
                                            ? 'border-green-500 bg-white'
                                            : 'border-red-500 bg-white'
                                        : 'border-slate-200 bg-white'
                                    : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                            }`}
                        >
                            <span className="text-[22px] font-semibold text-slate-800">X</span>
                            <span className="text-[16px] text-slate-700">틀리다</span>
                        </button>
                    </div>

                    {submitted && (
                        <div
                            className={`mt-6 rounded-2xl border px-4 py-4 ${
                                isCorrect
                                    ? 'border-green-300 bg-green-100'
                                    : 'border-red-300 bg-red-100'
                            }`}
                        >
                            <p
                                className={`text-[17px] font-semibold ${
                                    isCorrect ? 'text-green-700' : 'text-red-700'
                                }`}
                            >
                                {isCorrect ? '정답입니다.' : '오답입니다.'}
                            </p>

                            <p className="mt-3 text-[15px] leading-7 text-slate-800">
                                {quiz.explanation}
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-5 flex gap-3">
                    <button
                        type="button"
                        onClick={handleRetry}
                        className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-white hover:bg-slate-800"
                    >
                        다시 풀기
                    </button>

                    <button
                        type="button"
                        onClick={handleBackWithStamp}
                        className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-700 hover:bg-slate-50"
                    >
                        지도로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
}
