import { useState, useEffect, useRef } from 'react';
import { List } from 'react-window';

/**
 * A responsive virtualized grid component using react-window's FixedSizeList.
 * It automatically calculates columns based on the container width.
 */
export default function VirtualGrid({
  items,
  renderItem,
  itemHeight = 300,
  gap = 24,
  minColumnWidth = 300,
}) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const { width, height } = dimensions;

  // Render nothing until we have dimensions
  if (width === 0 || height === 0) {
    return <div ref={containerRef} className="w-full h-[600px] md:h-[800px]" />;
  }

  // Calculate how many columns fit
  const columns = Math.max(1, Math.floor((width + gap) / (minColumnWidth + gap)));
  // Total rows needed
  const rowCount = Math.ceil(items.length / columns);
  
  // Row renderer
  const Row = ({ index, style }) => {
    const startIndex = index * columns;
    const rowItems = items.slice(startIndex, startIndex + columns);
    
    return (
      <div 
        style={{
          ...style,
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: `${gap}px`,
          paddingBottom: `${gap}px`, // simulate gap between rows
        }}
      >
        {rowItems.map((item, colIndex) => renderItem(item, startIndex + colIndex))}
      </div>
    );
  };

  return (
    <div ref={containerRef} className="w-full h-[600px] md:h-[800px]">
      <List
        height={height}
        itemCount={rowCount}
        itemSize={itemHeight + gap}
        width={width}
        className="hide-scrollbar"
      >
        {Row}
      </List>
    </div>
  );
}
