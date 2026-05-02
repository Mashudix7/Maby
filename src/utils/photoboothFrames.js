export const PHOTOBOOTH_FRAMES = [
  {
    id: 'classic-white',
    name: 'Classic White',
    backgroundColor: '#ffffff',
    textColor: '#1a1517',
    photosCount: 3,
    renderOverlay: (ctx, width, height) => {
      ctx.fillStyle = '#1a1517';
      ctx.font = 'italic 32px serif';
      ctx.textAlign = 'center';
      ctx.fillText('Maby & You', width / 2, height - 30);
    }
  },
  {
    id: 'romantic-rose',
    name: 'Romantic Rose',
    backgroundColor: '#fff0f3',
    textColor: '#e11d48',
    photosCount: 3,
    renderOverlay: (ctx, width, height) => {
      ctx.fillStyle = '#e11d48';
      ctx.font = 'italic 36px serif';
      ctx.textAlign = 'center';
      ctx.fillText('Our Space', width / 2, height - 25);
      
      // Draw a simple heart
      const drawHeart = (x, y, w, h) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.beginPath();
        ctx.moveTo(0, h/4);
        ctx.bezierCurveTo(0, 0, -w/2, 0, -w/2, h/4);
        ctx.bezierCurveTo(-w/2, h/2, 0, h*3/4, 0, h);
        ctx.bezierCurveTo(0, h*3/4, w/2, h/2, w/2, h/4);
        ctx.bezierCurveTo(w/2, 0, 0, 0, 0, h/4);
        ctx.fill();
        ctx.restore();
      };
      drawHeart(width / 2, height - 80, 24, 24);
    }
  },
  {
    id: 'vintage-film',
    name: 'Vintage Film',
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    photosCount: 3,
    renderOverlay: (ctx, width, height) => {
      ctx.fillStyle = '#ffffff';
      
      // Draw film holes on the left and right edges
      const holeWidth = 10;
      const holeHeight = 20;
      const margin = 8;
      const gap = 35;
      
      for (let y = 10; y < height; y += gap) {
        // Left side holes
        ctx.fillRect(margin, y, holeWidth, holeHeight);
        // Right side holes
        ctx.fillRect(width - margin - holeWidth, y, holeWidth, holeHeight);
      }
      
      ctx.font = '24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('KODAK 400', width / 2, height - 30);
    }
  },
  {
    id: 'polaroid-stack',
    name: 'Polaroid Style',
    backgroundColor: '#f8f8f8',
    textColor: '#4a4a4a',
    photosCount: 3,
    renderOverlay: (ctx, width, height) => {
      ctx.fillStyle = '#4a4a4a';
      ctx.font = 'italic 32px "Comic Sans MS", cursive, sans-serif';
      ctx.textAlign = 'center';
      const date = new Date().toLocaleDateString();
      ctx.fillText(`Memories ${date}`, width / 2, height - 40);
    }
  },
  {
    id: 'maby-valentine',
    name: 'Maby Valentine',
    backgroundColor: '#fff0f3',
    textColor: '#e11d48',
    photosCount: 3,
    clipShape: 'heart', // Special property to trigger canvas clipping
    renderOverlay: (ctx, width, height) => {
      ctx.fillStyle = '#e11d48';
      ctx.font = 'italic bold 36px serif';
      ctx.textAlign = 'center';
      ctx.fillText('Happy Valentine Maby', width / 2, height - 35);
      
      const drawHeart = (x, y, w, h, color) => {
        ctx.save();
        ctx.fillStyle = color;
        ctx.translate(x, y);
        ctx.beginPath();
        ctx.moveTo(0, h/4);
        ctx.bezierCurveTo(0, 0, -w/2, 0, -w/2, h/4);
        ctx.bezierCurveTo(-w/2, h/2, 0, h*3/4, 0, h);
        ctx.bezierCurveTo(0, h*3/4, w/2, h/2, w/2, h/4);
        ctx.bezierCurveTo(w/2, 0, 0, 0, 0, h/4);
        ctx.fill();
        ctx.restore();
      };
      
      // Decorative hearts around text
      drawHeart(width / 2 - 180, height - 45, 24, 24, '#e11d48');
      drawHeart(width / 2 + 180, height - 45, 24, 24, '#e11d48');
      
      // Floating hearts around the strip
      drawHeart(30, 60, 16, 16, 'rgba(225, 29, 72, 0.4)');
      drawHeart(width - 40, 100, 24, 24, 'rgba(225, 29, 72, 0.3)');
      drawHeart(40, height * 0.35, 20, 20, 'rgba(225, 29, 72, 0.2)');
      drawHeart(width - 30, height * 0.5, 18, 18, 'rgba(225, 29, 72, 0.5)');
      drawHeart(50, height * 0.75, 26, 26, 'rgba(225, 29, 72, 0.3)');
      drawHeart(width - 50, height * 0.85, 14, 14, 'rgba(225, 29, 72, 0.4)');
    }
  }
];
