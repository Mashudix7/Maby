import { useState, useEffect, useRef, memo } from 'react';
import { List } from 'react-window';

/**
 * Internal Row component for the VirtualGrid.
 * Optimized with memo to prevent unnecessary re-renders.
 */
const GridRow = memo(({ index, style, data }) => {
  const { items, columns, gap, renderItem } = data;
  const startIndex = index * columns;
  const rowItems = items.slice(startIndex, startIndex + columns);

  return (
    <div
      style={{
        ...style,
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
        paddingBottom: `${gap}px`,
      }}
    >
      {rowItems.map((item, colIndex) => (
        <div key={item.id || startIndex + colIndex} className="h-full">
          {renderItem(item, startIndex + colIndex)}
        </div>
      ))}
      {/* Fill empty slots in the last row to maintain grid alignment */}
      {rowItems.length < columns && 
        Array.from({ length: columns - rowItems.length }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))
      }
    </div>
  );
});

/**
 * A responsive virtualized grid component using react-window's List.
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
        // Only update if there's a significant change to avoid jitter
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

  // Memoize the data object passed to rows
  const itemData = {
    items,
    columns,
    gap,
    renderItem
  };

  return (
    <div ref={containerRef} className="w-full h-[600px] md:h-[800px]">
      <List
        height={height}
        itemCount={rowCount}
        itemSize={itemHeight + gap}
        width={width}
        itemData={itemData}
        className="hide-scrollbar"
      >
        {GridRow}
      </List>
    </div>
  );
}

