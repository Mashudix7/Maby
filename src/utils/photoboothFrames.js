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
  }
];
