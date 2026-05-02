export const generatePhotoboothStrip = async (photoUrls, frame) => {
  return new Promise((resolve, reject) => {
    // Standard strip dimensions (high resolution for download)
    const STRIP_WIDTH = 600;
    const PADDING = 30; // Outer padding
    const SPACING = 20; // Spacing between photos
    const BOTTOM_MARGIN = 150; // Space for the frame text/graphics at the bottom
    
    // Calculate photo dimensions
    // We want photos to fit within (STRIP_WIDTH - 2 * PADDING)
    const PHOTO_WIDTH = STRIP_WIDTH - (PADDING * 2);
    // Assuming 4:3 aspect ratio from camera
    const PHOTO_HEIGHT = Math.floor(PHOTO_WIDTH * (4/3));
    
    const STRIP_HEIGHT = PADDING + (photoUrls.length * PHOTO_HEIGHT) + ((photoUrls.length - 1) * SPACING) + BOTTOM_MARGIN;

    const canvas = document.createElement('canvas');
    canvas.width = STRIP_WIDTH;
    canvas.height = STRIP_HEIGHT;
    const ctx = canvas.getContext('2d');

    // 1. Draw Background
    ctx.fillStyle = frame.backgroundColor;
    ctx.fillRect(0, 0, STRIP_WIDTH, STRIP_HEIGHT);

    // 2. Load and Draw Photos
    let loadedPhotos = 0;
    const images = [];

    photoUrls.forEach((url, index) => {
      const img = new Image();
      img.onload = () => {
        // Calculate position
        const x = PADDING;
        const y = PADDING + (index * (PHOTO_HEIGHT + SPACING));
        
        // Apply versatile beauty filter
        ctx.filter = 'brightness(1.05) contrast(1.05) saturate(1.1) sepia(0.08)';

        // Calculate object-fit: cover crop dimensions
        const imgAspect = img.width / img.height;
        const targetAspect = PHOTO_WIDTH / PHOTO_HEIGHT;
        
        let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height;
        
        if (imgAspect > targetAspect) {
          // Image is wider, crop sides
          sWidth = img.height * targetAspect;
          sx = (img.width - sWidth) / 2;
        } else {
          // Image is taller, crop top/bottom
          sHeight = img.width / targetAspect;
          sy = (img.height - sHeight) / 2;
        }

        if (frame.clipShape === 'heart') {
          ctx.save();
          // Define heart clipping path
          ctx.beginPath();
          const cx = x + PHOTO_WIDTH / 2;
          const cy = y;
          const w = PHOTO_WIDTH;
          const h = PHOTO_HEIGHT;
          
          ctx.translate(cx, cy);
          ctx.moveTo(0, h/4);
          ctx.bezierCurveTo(0, 0, -w/2, 0, -w/2, h/4);
          ctx.bezierCurveTo(-w/2, h/2, 0, h*3/4, 0, h*0.85); // Pointed bottom
          ctx.bezierCurveTo(0, h*3/4, w/2, h/2, w/2, h/4);
          ctx.bezierCurveTo(w/2, 0, 0, 0, 0, h/4);
          ctx.clip();
          
          // Reset transform so image draws in correct absolute coords
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, PHOTO_WIDTH, PHOTO_HEIGHT);
          ctx.restore();
        } else {
          // Normal rectangular draw
          ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, PHOTO_WIDTH, PHOTO_HEIGHT);
        }
        
        // Reset filter for subsequent drawings (like frame text)
        ctx.filter = 'none';
        
        // Draw inner border/shadow if needed
        if (frame.id === 'polaroid-stack') {
           ctx.strokeStyle = '#e0e0e0';
           ctx.lineWidth = 1;
           ctx.strokeRect(x, y, PHOTO_WIDTH, PHOTO_HEIGHT);
        }

        loadedPhotos++;
        if (loadedPhotos === photoUrls.length) {
          // 3. Render Frame Overlays (Text, Graphics)
          if (frame.renderOverlay) {
            frame.renderOverlay(ctx, STRIP_WIDTH, STRIP_HEIGHT);
          }
          
          // 4. Export
          resolve(canvas.toDataURL('image/png'));
        }
      };
      img.onerror = reject;
      img.src = url;
    });
  });
};
