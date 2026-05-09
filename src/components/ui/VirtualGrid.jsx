import { memo, useMemo, useState, useEffect, useCallback } from 'react';
import { Grid } from 'react-window';

/**
 * A responsive grid component that uses virtualization for high performance.
 * Optimized to prevent card cropping and handle gaps correctly.
 */
export default function VirtualGrid({
  items,
  renderItem,
  gap = 16, // Reduced gap for better mobile fit
  minColumnWidth = 280, // Reduced to fit smaller screens (like 320px with padding)
  itemHeight = 400
}) {
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      const el = document.getElementById('virtual-grid-container');
      if (el) {
        // Use clientWidth to exclude scrollbars/borders
        setContainerWidth(el.clientWidth);
      }
    };
    
    updateWidth();
    // Use a small delay to ensure DOM is ready and layout has settled
    const timer = setTimeout(updateWidth, 150);
    
    // ResizeObserver is more reliable than 'resize' event for specific elements
    const observer = new ResizeObserver(updateWidth);
    const el = document.getElementById('virtual-grid-container');
    if (el) observer.observe(el);

    window.addEventListener('resize', updateWidth);
    return () => {
      window.removeEventListener('resize', updateWidth);
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  const { columnCount, columnWidth } = useMemo(() => {
    if (containerWidth === 0) return { columnCount: 1, columnWidth: 280 };
    // Calculate how many columns can fit
    const count = Math.max(1, Math.floor((containerWidth + gap) / (minColumnWidth + gap)));
    const slotWidth = containerWidth / count;
    return { columnCount: count, columnWidth: slotWidth };
  }, [containerWidth, minColumnWidth, gap]);

  const rowCount = Math.ceil(items.length / columnCount);

  const Cell = useCallback(({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    if (index >= items.length) return null;
    
    return (
      <div 
        style={{
          ...style,
          padding: `${gap / 2}px`,
          boxSizing: 'border-box'
        }}
      >
        <div className="w-full h-full overflow-hidden">
          {renderItem(items[index], index)}
        </div>
      </div>
    );
  }, [items, renderItem, columnCount, gap]);

  if (!items || items.length === 0) return null;

  return (
    <div id="virtual-grid-container" className="w-full min-h-[500px] overflow-x-hidden box-border">
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
