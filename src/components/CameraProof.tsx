import { useRef, useState, useEffect } from 'react';
import { RefreshCw, Upload, AlertCircle, ArrowLeft } from 'lucide-react';

interface CameraProofProps {
  onCapture: (imageDataUrl: string, imageBlob: Blob) => void;
  onCancel: () => void;
  cluePrompt: string;
}

export const CameraProof: React.FC<CameraProofProps> = ({
  onCapture,
  onCancel,
  cluePrompt,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  // Initialize camera stream
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    async function startCamera() {
      setCameraError(null);
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera access is not supported on this browser.');
        }

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        setHasMultipleCameras(videoDevices.length > 1);

        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        currentStream = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          await videoRef.current.play();
        }
      } catch (err: any) {
        console.warn('Camera initialization notice:', err);
        setCameraError(
          err.name === 'NotAllowedError'
            ? 'Camera permission was not granted. You can still upload or pick an outdoor photo below.'
            : err.message || 'Unable to open camera.'
        );
      }
    }

    if (!capturedPhotoUrl) {
      startCamera();
    }

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode, capturedPhotoUrl]);

  // Flip between rear and front camera
  const toggleFacingMode = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Capture frame from video stream
  const takeSnapshot = () => {
    const video = videoRef.current;
    if (!video) return;

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    canvas.toBlob(
      blob => {
        if (blob) {
          setCapturedPhotoUrl(dataUrl);
          setCapturedBlob(blob);
          // Stop stream during preview to save battery
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
          }
        }
      },
      'image/jpeg',
      0.85
    );
  };

  // Handle image file upload fallback
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const result = event.target?.result as string;
      if (result) {
        setCapturedPhotoUrl(result);
        setCapturedBlob(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRetake = () => {
    setCapturedPhotoUrl(null);
    setCapturedBlob(null);
  };

  const handleConfirmProof = () => {
    if (capturedPhotoUrl && capturedBlob) {
      onCapture(capturedPhotoUrl, capturedBlob);
    }
  };

  // Quick test helper to load real sample specimen photos
  const loadSamplePhoto = async (samplePath: string) => {
    try {
      const res = await fetch(samplePath);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onload = event => {
        const result = event.target?.result as string;
        if (result) {
          setCapturedPhotoUrl(result);
          setCapturedBlob(blob);
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
          }
        }
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.warn('Sample photo load error:', err);
    }
  };

  const sampleSpecimens = [
    { label: '🪵 Tree Bark', path: '/sample-proofs/01-rough-tree-bark.jpg' },
    { label: '🍃 Green Leaf', path: '/sample-proofs/02-green-leaf-veins.jpg' },
    { label: '🪨 River Stone', path: '/sample-proofs/03-smooth-river-stone.jpg' },
    { label: '🌿 Y-Twig', path: '/sample-proofs/04-fallen-y-twig.jpg' },
    { label: '🌼 Dandelion', path: '/sample-proofs/05-yellow-dandelion.jpg' },
    { label: '💻 Laptop (Distractor)', path: '/sample-proofs/06-distractor-indoor-laptop.jpg' },
    { label: '🚗 Red Car (Distractor)', path: '/sample-proofs/07-distractor-red-car.jpg' },
  ];

  return (
    <div className="fixed inset-0 z-40 bg-[var(--ink)] flex flex-col justify-between text-white select-none">
      {/* Top Bar */}
      <header className="p-4 flex items-center justify-between bg-black/60 backdrop-blur-xs z-10 border-b border-white/10">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 px-3 py-2 rounded font-medium touch-control text-white hover:bg-white/10"
          aria-label="Back to clue"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="text-center px-2 flex-1 max-w-xs truncate text-xs sm:text-sm text-[var(--paper)] font-medium">
          {cluePrompt}
        </div>

        {hasMultipleCameras && !capturedPhotoUrl && !cameraError && (
          <button
            onClick={toggleFacingMode}
            className="p-2 rounded touch-control text-white hover:bg-white/10"
            aria-label="Switch camera"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        )}
      </header>

      {/* Viewfinder or Preview Area */}
      <div className="relative flex-1 flex items-center justify-center bg-black overflow-hidden">
        {capturedPhotoUrl ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={capturedPhotoUrl}
              alt="Captured outdoor proof"
              className="max-h-full max-w-full object-contain"
            />
            <div className="absolute top-4 left-4 bg-black/60 px-3 py-1.5 rounded-lg text-xs text-white border border-white/20">
              Proof Photo Preview
            </div>
          </div>
        ) : cameraError ? (
          <div className="max-w-md p-6 text-center space-y-4 m-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm">
            <AlertCircle className="w-12 h-12 text-[var(--blaze)] mx-auto" />
            <h3 className="text-lg font-bold">Camera Unavailable</h3>
            <p className="text-xs text-white/80 leading-relaxed">{cameraError}</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3.5 px-4 rounded-xl bg-[var(--blaze)] text-white font-bold flex items-center justify-center gap-2 touch-control hover:bg-[var(--blaze-dark)] shadow-md"
            >
              <Upload className="w-5 h-5" />
              <span>Choose Photo from Device</span>
            </button>

            {/* Quick Test Demo Chips */}
            <div className="pt-3 border-t border-white/10 space-y-2 text-left">
              <span className="text-[11px] font-bold text-white/70 uppercase tracking-wider block">
                Or test with sample specimen photos:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {sampleSpecimens.map(sample => (
                  <button
                    key={sample.path}
                    onClick={() => loadSamplePhoto(sample.path)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/15 hover:bg-white/25 border border-white/20 text-white touch-control transition-all active:scale-95"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className="w-full h-full object-cover"
            />
            {/* Viewfinder Target Framing Reticle */}
            <div className="absolute inset-8 sm:inset-16 pointer-events-none border-2 border-white/40 rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 border-t-2 border-l-2 border-white absolute top-0 left-0" />
              <div className="w-8 h-8 border-t-2 border-r-2 border-white absolute top-0 right-0" />
              <div className="w-8 h-8 border-b-2 border-l-2 border-white absolute bottom-0 left-0" />
              <div className="w-8 h-8 border-b-2 border-r-2 border-white absolute bottom-0 right-0" />
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Bottom Controls Bar */}
      <footer className="p-4 sm:p-6 bg-black/70 backdrop-blur-xs flex flex-col items-center gap-3 border-t border-white/10">
        {!capturedPhotoUrl && !cameraError && (
          <div className="w-full max-w-md overflow-x-auto pb-1 flex items-center gap-1.5 no-scrollbar justify-start sm:justify-center">
            <span className="text-[10px] uppercase font-bold text-white/50 shrink-0">Demo:</span>
            {sampleSpecimens.map(sample => (
              <button
                key={sample.path}
                onClick={() => loadSamplePhoto(sample.path)}
                className="px-2 py-1 rounded text-[11px] font-semibold bg-white/10 hover:bg-white/20 border border-white/15 text-white/90 shrink-0 touch-control active:scale-95 transition-all"
              >
                {sample.label}
              </button>
            ))}
          </div>
        )}

        {capturedPhotoUrl ? (
          <div className="flex items-center justify-around w-full max-w-sm">
            <button
              onClick={handleRetake}
              className="py-3 px-6 rounded font-semibold text-white/90 border border-white/30 touch-control hover:bg-white/10"
            >
              Retake
            </button>

            <button
              onClick={handleConfirmProof}
              className="py-3.5 px-8 rounded bg-[var(--blaze)] text-white font-bold shadow-lg touch-control hover:bg-[var(--blaze-dark)] text-base"
            >
              Submit Proof
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-around w-full max-w-sm">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3.5 rounded-full text-white/80 hover:bg-white/10 touch-control"
              aria-label="Upload photo from storage"
            >
              <Upload className="w-6 h-6" />
            </button>

            <button
              onClick={takeSnapshot}
              disabled={!!cameraError}
              className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-white/20 active:bg-white/50 touch-control transition-transform active:scale-95 disabled:opacity-50"
              aria-label="Capture photo"
            >
              <div className="w-14 h-14 rounded-full bg-white" />
            </button>

            <div className="w-12" /> {/* Balance spacer */}
          </div>
        )}
      </footer>
    </div>
  );
};
