import { memo, useMemo, useState, useEffect } from 'react';
import { Grid } from 'react-window';

/**
 * A responsive grid component that uses virtualization for high performance.
 */
export default function VirtualGrid({
  items,
  renderItem,
  gap = 24,
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
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const { columnCount, columnWidth } = useMemo(() => {
    if (containerWidth === 0) return { columnCount: 1, columnWidth: minColumnWidth };
    const count = Math.max(1, Math.floor((containerWidth + gap) / (minColumnWidth + gap)));
    const width = (containerWidth - (count - 1) * gap) / count;
    return { columnCount: count, columnWidth: width };
  }, [containerWidth, minColumnWidth, gap]);

  const rowCount = Math.ceil(items.length / columnCount);

  if (!items || items.length === 0) return null;

  return (
    <div id="virtual-grid-container" className="w-full min-h-[500px]">
      {containerWidth > 0 && (
        <Grid
          columnCount={columnCount}
          columnWidth={columnWidth + gap}
          height={Math.min(window.innerHeight - 200, rowCount * (itemHeight + gap))} 
          rowCount={rowCount}
          rowHeight={itemHeight + gap}
          width={containerWidth}
          style={{ overflowX: 'hidden' }}
          cellProps={{}} // Added this to prevent crash in react-window v2.2.7
          cellComponent={({ columnIndex, rowIndex, style }) => {
            const index = rowIndex * columnCount + columnIndex;
            if (index >= items.length) return null;
            
            return (
              <div 
                style={{
                  ...style,
                  left: parseFloat(style.left) || 0,
                  top: parseFloat(style.top) || 0,
                  width: (parseFloat(style.width) || 0) - gap,
                  height: (parseFloat(style.height) || 0) - gap,
                  padding: `${gap / 2}px`
                }}
              >
                {renderItem(items[index], index)}
              </div>
            );
          }}
        />
      )}
    </div>
  );
}
