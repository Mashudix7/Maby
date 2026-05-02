import { useState, useEffect, useRef } from 'react';
import { PHOTOBOOTH_FRAMES } from '../../utils/photoboothFrames';
import { generatePhotoboothStrip } from '../../utils/canvasExport';

export default function PhotoboothPreview({ photos, onRetake }) {
  const [selectedFrame, setSelectedFrame] = useState(PHOTOBOOTH_FRAMES[0]);
  const [isExporting, setIsExporting] = useState(false);
  const [finalImageUrl, setFinalImageUrl] = useState(null);
  const previewCanvasRef = useRef(null);

  // Generate a live preview when frame or photos change
  useEffect(() => {
    let isMounted = true;
    
    const updatePreview = async () => {
      try {
        const url = await generatePhotoboothStrip(photos, selectedFrame);
        if (isMounted) {
          setFinalImageUrl(url);
        }
      } catch (err) {
        console.error("Preview generation failed", err);
      }
    };
    
    updatePreview();
    
    return () => { isMounted = false; };
  }, [photos, selectedFrame]);

  const handleDownload = () => {
    if (!finalImageUrl) return;
    setIsExporting(true);
    
    const link = document.createElement('a');
    link.href = finalImageUrl;
    link.download = `Maby_Photobooth_${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => setIsExporting(false), 500);
  };

  return (
    <div className="flex flex-col h-full w-full bg-background dark:bg-[#1a1517] text-on-background dark:text-[#ede0df]">
      {/* Top Header */}
      <div className="flex justify-between items-center p-4 z-10">
        <button 
          onClick={onRetake}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <span className="font-serif font-bold italic">Preview</span>
        <button 
          onClick={handleDownload}
          disabled={isExporting || !finalImageUrl}
          className="bg-primary text-on-primary px-4 py-2 rounded-full font-bold shadow-md disabled:opacity-50 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          Save
        </button>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 overflow-y-auto flex items-center justify-center p-6 hide-scrollbar">
        {finalImageUrl ? (
          <img 
            src={finalImageUrl} 
            alt="Photobooth Strip Preview" 
            className="w-full max-w-[280px] shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
            style={{ borderRadius: selectedFrame.id === 'polaroid-stack' ? '4px' : '0' }}
          />
        ) : (
          <div className="flex flex-col items-center gap-4 opacity-50">
            <span className="material-symbols-outlined text-4xl animate-spin">refresh</span>
            <p className="font-serif italic text-sm">Rendering magic...</p>
          </div>
        )}
      </div>

      {/* Frame Selection Carousel */}
      <div className="pb-8 pt-4 px-4 bg-surface-container/30 backdrop-blur-md">
        <p className="text-xs font-semibold uppercase tracking-widest text-center mb-4 opacity-70">Select Frame</p>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar snap-x px-2">
          {PHOTOBOOTH_FRAMES.map((frame) => (
            <button
              key={frame.id}
              onClick={() => setSelectedFrame(frame)}
              className={`snap-center shrink-0 w-20 h-28 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 overflow-hidden relative ${
                selectedFrame.id === frame.id 
                  ? 'border-primary ring-2 ring-primary/30 scale-105' 
                  : 'border-white/10 opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: frame.backgroundColor }}
            >
              <div 
                className="w-12 h-16 border-dashed border-2 opacity-50"
                style={{ borderColor: frame.textColor }}
              />
              <span 
                className="text-[10px] font-bold text-center absolute bottom-2 w-full px-1 truncate"
                style={{ color: frame.textColor }}
              >
                {frame.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
