import React, { useRef, useEffect } from 'react';

interface QRScannerProps {
  onScan: (data: string, mode: 'pay' | 'redeem') => void;
  onClose: () => void;
}


export const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const [mode, setMode] = React.useState<'pay' | 'redeem'>('pay');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let animationId: number;
  let stream: MediaStream | null = null;

  useEffect(() => {
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        alert('Could not access camera.');
        onClose();
      }
    };
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      cancelAnimationFrame(animationId);
    };
    // eslint-disable-next-line
  }, []);

  // Minimal QR decode using jsQR (add to package.json)
  useEffect(() => {
    let jsQR: any;
    let mounted = true;
    import('jsqr').then(mod => {
      jsQR = mod.default;
      const scan = () => {
        if (!mounted) return;
        if (videoRef.current && canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            if (code && code.data) {
              onScan(code.data, mode);
              onClose();
              return;
            }
          }
        }
        animationId = requestAnimationFrame(scan);
      };
      scan();
    });
    return () => { mounted = false; };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="qr-scanner-modal">
      <div className="bg-white shadow-xl rounded-2xl flex flex-col items-center max-w-xs w-full p-0" style={{ minWidth: 300 }}>
        <div className="w-full flex flex-col items-stretch gap-2">
          <div className="flex items-center justify-between w-full px-5 pt-5">
            <span className="text-flow-teal text-lg font-semibold">Scan QR Code</span>
            <button onClick={onClose} className="qr-scanner-close text-2xl">×</button>
          </div>
          <div className="flex gap-2 justify-center mt-3 px-5">
            <button
              className={`px-4 py-1 rounded-full text-sm font-semibold border transition-colors focus:outline-none ${mode === 'pay' ? 'bg-flow-teal text-white border-flow-teal' : 'bg-white text-flow-teal border-cloud-grey'}`}
              aria-pressed={mode === 'pay'}
              onClick={() => setMode('pay')}
              type="button"
            >
              Pay
            </button>
            <button
              className={`px-4 py-1 rounded-full text-sm font-semibold border transition-colors focus:outline-none ${mode === 'redeem' ? 'bg-flow-teal text-white border-flow-teal' : 'bg-white text-flow-teal border-cloud-grey'}`}
              aria-pressed={mode === 'redeem'}
              onClick={() => setMode('redeem')}
              type="button"
            >
              Redeem
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full px-5 pt-4 pb-2">
          <div className="relative w-[240px] h-[240px] bg-cloud-grey rounded-xl flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover rounded-xl shadow border border-cloud-grey"
              style={{ background: '#E0E0E0', maxWidth: 240, maxHeight: 240 }}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        </div>
        <div className="qr-scanner-footer bg-white w-full text-center px-5 pb-4 pt-2 rounded-b-2xl text-flow-teal text-base font-medium">
          {mode === 'pay'
            ? 'Point your camera at a merchant QR code to pay.'
            : 'Point your camera at a reward QR code to redeem.'}
        </div>
      </div>
    </div>
  );
};
