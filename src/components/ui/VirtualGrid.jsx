import { memo, useMemo, useState, useEffect, useCallback } from 'react';
import { Grid } from 'react-window';

/**
 * A responsive grid component that uses virtualization for high performance.
 * Optimized to prevent card cropping and handle gaps correctly.
 */
export default function VirtualGrid({
  items,
  renderItem,
  gap = 20, // Slightly reduced for better mobile fit
  minColumnWidth = 300,
  itemHeight = 400
}) {
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      const el = document.getElementById('virtual-grid-container');
      if (el) setContainerWidth(el.offsetWidth);
    };
    updateWidth();
    // Use a small delay to ensure DOM is ready
    const timer = setTimeout(updateWidth, 100);
    window.addEventListener('resize', updateWidth);
    return () => {
      window.removeEventListener('resize', updateWidth);
      clearTimeout(timer);
    };
  }, []);

  const { columnCount, columnWidth } = useMemo(() => {
    if (containerWidth === 0) return { columnCount: 1, columnWidth: minColumnWidth };
    // Calculate how many columns can fit including their gaps
    const count = Math.max(1, Math.floor((containerWidth + gap) / (minColumnWidth + gap)));
    // Total width of one "slot" (card + gap)
    const slotWidth = containerWidth / count;
    return { columnCount: count, columnWidth: slotWidth };
  }, [containerWidth, minColumnWidth, gap]);

  const rowCount = Math.ceil(items.length / columnCount);

  // Memoize the Cell component to prevent re-creation on every render
  const Cell = useCallback(({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    if (index >= items.length) return null;
    
    return (
      <div 
        style={{
          ...style,
          // Use padding to create the gap, ensuring no cropping occurs at edges
          padding: `${gap / 2}px`,
          boxSizing: 'border-box'
        }}
      >
        <div className="w-full h-full">
          {renderItem(items[index], index)}
        </div>
      </div>
    );
  }, [items, renderItem, columnCount, gap]);

  if (!items || items.length === 0) return null;

  return (
    <div id="virtual-grid-container" className="w-full min-h-[500px] overflow-hidden">
      {containerWidth > 0 && (
        <Grid
          columnCount={columnCount}
          columnWidth={columnWidth}
          height={Math.min(window.innerHeight - 150, rowCount * (itemHeight + gap))} 
          rowCount={rowCount}
          rowHeight={itemHeight + gap}
          width={containerWidth}
          style={{ overflowX: 'hidden' }}
          overscanRowCount={3}
          cellProps={{}} 
          cellComponent={Cell}
        />
      )}
    </div>
  );
}
