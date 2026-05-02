import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PhotoboothPreview from '../components/ui/PhotoboothPreview';

export default function Photobooth() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('user'); // 'user' or 'environment'
  
  const [photos, setPhotos] = useState([]);
  const [mode, setMode] = useState('camera'); // 'camera' or 'preview'
  
  const [timerDuration, setTimerDuration] = useState(3); // 3, 5, 10
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [currentShot, setCurrentShot] = useState(1);
  const TOTAL_SHOTS = 3;

  // Initialize Camera
  const startCamera = useCallback(async () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      // Fallback or error handling could be added here
    }
  }, [facingMode]);

  useEffect(() => {
    if (mode === 'camera') {
      startCamera();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode, mode, startCamera]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    
    // If front camera, mirror the image horizontally
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Flash effect
    const flash = document.createElement('div');
    flash.className = 'fixed inset-0 bg-white z-[100] transition-opacity duration-300 pointer-events-none';
    document.body.appendChild(flash);
    setTimeout(() => { flash.style.opacity = '0'; }, 50);
    setTimeout(() => { document.body.removeChild(flash); }, 350);

    return canvas.toDataURL('image/jpeg', 0.9);
  };

  const startCaptureSingle = async () => {
    setIsCapturing(true);
    
    // Countdown
    for (let i = timerDuration; i > 0; i--) {
      setCountdown(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    setCountdown(null);
    
    // Capture
    const photoUrl = takePhoto();
    if (photoUrl) {
      setPhotos(prev => [...prev, photoUrl]);
    }
    
    setIsCapturing(false);
  };

  const removeLastPhoto = () => {
    setPhotos(prev => prev.slice(0, -1));
  };

  const handleNext = () => {
    setMode('preview');
  };

  const handleRetake = () => {
    setPhotos([]);
    setMode('camera');
  };

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    navigate('/');
  };

  if (mode === 'preview') {
    return <PhotoboothPreview photos={photos} onRetake={handleRetake} />;
  }

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col">
      {/* Hidden canvas for capturing frames */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Top Controls */}
      <div className="absolute top-0 w-full p-4 flex justify-between items-start z-20 bg-gradient-to-b from-black/50 to-transparent pt-safe-top">
        <button onClick={handleClose} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 backdrop-blur-md">
          <span className="material-symbols-outlined">close</span>
        </button>
        
        {!isCapturing && (
          <div className="flex bg-white/20 backdrop-blur-md rounded-full p-1">
            {[3, 5, 10].map(time => (
              <button
                key={time}
                onClick={() => setTimerDuration(time)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-colors ${timerDuration === time ? 'bg-primary' : 'hover:bg-white/10'}`}
              >
                {time}s
              </button>
            ))}
          </div>
        )}
        
        {!isCapturing && (
          <button onClick={toggleCamera} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 backdrop-blur-md">
            <span className="material-symbols-outlined">flip_camera_ios</span>
          </button>
        )}
      </div>

      {/* Camera Viewfinder */}
      <div className="flex-1 relative overflow-hidden bg-black flex items-center justify-center">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className={`h-full w-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
          style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1) sepia(0.08)' }}
        />
        
        {/* Countdown Overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <span className="text-[150px] font-bold text-white drop-shadow-[0_0_20px_rgba(0,0,0,0.5)] animate-pulse">
              {countdown}
            </span>
          </div>
        )}

        {/* Shot Progress Indicator */}
        <div className="absolute top-20 w-full flex justify-center gap-2 z-20">
          {Array.from({ length: TOTAL_SHOTS }).map((_, idx) => (
            <div 
              key={idx} 
              className={`w-3 h-3 rounded-full transition-all duration-300 shadow-sm ${
                idx < photos.length ? 'bg-primary' : 'bg-white/40 backdrop-blur-sm'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="h-48 bg-black pb-safe-bottom flex flex-col items-center justify-center relative z-20 gap-4 pt-4">
        {/* Thumbnails */}
        {photos.length > 0 && !isCapturing && (
          <div className="flex gap-3 h-20 items-center justify-center">
            {photos.map((url, idx) => (
              <div key={idx} className="relative w-12 h-16 rounded border-2 border-white/80 overflow-visible shadow-md">
                <img src={url} alt={`Shot ${idx+1}`} className="w-full h-full object-cover rounded-[2px]" style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1) sepia(0.08)' }} />
                {idx === photos.length - 1 && (
                  <button 
                    onClick={removeLastPhoto}
                    className="absolute -top-3 -right-3 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform z-10"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Shutter / Next Button */}
        <div className="flex items-center justify-center h-20">
          {photos.length < TOTAL_SHOTS && !isCapturing && (
            <button 
              onClick={startCaptureSingle}
              className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center p-1 active:scale-95 transition-transform"
            >
              <div className="w-full h-full rounded-full bg-white hover:bg-zinc-200 transition-colors" />
            </button>
          )}

          {photos.length === TOTAL_SHOTS && !isCapturing && (
            <button 
              onClick={handleNext}
              className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(225,29,72,0.5)] animate-pulse hover:scale-105 active:scale-95 transition-all"
            >
              Lanjut
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
