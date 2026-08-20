import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router'; 

export default function CameraPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const landmarkId = searchParams.get('id');
    const landmarkName = searchParams.get('name');
    const currentUserId = "user123"; 

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const intervalRef = useRef<number | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const isProcessing = useRef(false);
    const holdStartRef = useRef<number | null>(null); 

    const [status, setStatus] = useState("서버 연결 중...");
    const [score, setScore] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null); 

    useEffect(() => {

        if (isSaving) return; 

        const cleanUpAll = () => {
            if (intervalRef.current) window.clearInterval(intervalRef.current);
            if (socketRef.current) socketRef.current.close();
            if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
        };

        const socket = new WebSocket('ws://localhost:5000/ws/python');
        socketRef.current = socket;
        socket.onopen = () => setStatus("Searching");

        socket.onmessage = (event) => {
            if (isSaving || status === "Success!") return;
            const data = JSON.parse(event.data);
            setScore(data.score);

            if (data.status === "Holding") {
                if (holdStartRef.current === null) {
                    holdStartRef.current = Date.now();
                    setStatus("Holding... 3s");
                } else {
                    const elapsed = (Date.now() - holdStartRef.current) / 1000;
                    const remaining = Math.max(0, 3 - Math.floor(elapsed));
                    
                    if (elapsed >= 3) {
                        setStatus("Success!");
                        setIsSaving(true); 
                        if (canvasRef.current) {
                            setCapturedImage(canvasRef.current.toDataURL('image/jpeg', 0.8));
                        }
                        cleanUpAll(); 
                        handleSaveAndExit(); 
                        return;
                    }
                    setStatus(`Holding... ${remaining}s`);
                }
            } else {
                holdStartRef.current = null;
                setStatus(data.status);
            }
            isProcessing.current = false;
        };

        const handleSaveAndExit = () => {
            setStatus("Success!");
            setIsSaving(true);
            setTimeout(() => {
                navigate(`/quiz?id=${landmarkId}&name=${encodeURIComponent(landmarkName || '')}`);
            }, 3000);
        };

        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment', width: 480, height: 640 },
                });
                streamRef.current = stream;
                if (videoRef.current) videoRef.current.srcObject = stream;

                intervalRef.current = window.setInterval(() => {
                    if (!isProcessing.current && !isSaving && socketRef.current?.readyState === WebSocket.OPEN && videoRef.current && canvasRef.current) {
                        const ctx = canvasRef.current.getContext('2d');
                        if (ctx) {
                            ctx.drawImage(videoRef.current, 0, 0, 360, 480);
                        
                            const payload = {
                                image: canvasRef.current.toDataURL('image/jpeg', 0.05), // 압축률을 0.05에서 0.1로 살짝 올려 화질 개선
                                id: landmarkId // 👈 파이썬 서버의 .pt 파일명과 매칭될 ID (예: "tar1" 또는 landmark 고유 ID)
                            };

                            socketRef.current.send(JSON.stringify(payload));
                            isProcessing.current = true;
                        }
                    }
                }, 100);
            } catch (err) { setStatus("카메라 오류"); }
        };

        startCamera();
        return () => cleanUpAll();
    }, [landmarkId, navigate, isSaving]);

    return (
        <div style={{ position: 'relative',textAlign: 'center', padding: '20px', backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
            <h2 style={{textAlign: 'left', maxWidth: '500px', margin: '0 auto 10px auto', paddingLeft: '5px',fontWeight: 'bold'}}>
                {landmarkName} 
            </h2>

            <div style={{ marginBottom: '15px', position: 'absolute', top: '25px', right: '15px', zIndex: 10  }}>
                <span style={{ 
                    padding: '10px 20px', borderRadius: '20px', 
                    backgroundColor: status === 'Success!' ? '#00FF00' : (status.includes('Holding') ? '#FF5E00' : '#444'),
                    fontSize: '1.2rem', fontWeight: 'bold', transition: 'all 0.3s'
                }}>
                    {status}
                </span>
            </div>

            <p>
                정확도: <span style={{ color: '#FF5E00', fontWeight: 'bold' }}>{(score * 100).toFixed(1)}%</span>
            </p>

            {/* 비디오 영역 */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
                
                {/* 1. 실제 카메라 화면 또는 캡처된 이미지 (이게 꼭 있어야 합니다!) */}
                {capturedImage ? (
                    <img src={capturedImage} style={{ width: '100%', borderRadius: '15px', display: 'block' }} alt="Result" />
                ) : (
                    <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: '15px', display: 'block' }} />
                )}

                {/* 2. 가이드라인 (카메라가 켜져 있을 때만 비디오 위에 겹쳐서 보여줌) */}
                {!capturedImage && (
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%', 
                        transform: 'translate(-50%, -50%)',
                        width: '70%', height: '70%', // 가이드라인 크기
                        
                        border: '2px dashed rgba(255, 255, 255, 0.7)', // 0.7은 약간 투명하게, 취향껏 조절 가능
                        borderRadius: '10px', 
                        
                        pointerEvents: 'none',
                        overflow: 'hidden', // 이미지가 테두리를 넘지 않게 함
                        zIndex: 5
                    }}>
                        <img 
                            src={`/guideline/${landmarkId}.png`} 
                            alt="가이드 라인"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover', 
                                opacity: 0.4, 
                            }}
                        />
                    </div>
                )}

                {/* 보이지 않는 캔버스 (데이터 전송용) */}
                <canvas ref={canvasRef} width="360" height="480" style={{ display: 'none' }} />
            </div>

            {/* 하단 버튼 */}
            <div style={{ marginTop: '25px' }}>
                <button onClick={() => navigate('/')} style={{ padding: '10px 25px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    취소
                </button>
            </div>
        </div>
    );
}
