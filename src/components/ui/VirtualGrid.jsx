import { useMemo } from 'react';
import { List } from 'react-window';
import { AutoSizer } from 'react-virtualized-auto-sizer';

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
  return (
    <div className="w-full h-[600px] md:h-[800px]">
      <AutoSizer>
        {({ height, width }) => {
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
            <List
              height={height}
              itemCount={rowCount}
              itemSize={itemHeight + gap}
              width={width}
              className="hide-scrollbar"
            >
              {Row}
            </List>
          );
        }}
      </AutoSizer>
    </div>
  );
}
