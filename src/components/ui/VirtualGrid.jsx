import { memo } from 'react';

/**
 * A responsive grid component (temporarily non-virtualized for troubleshooting).
 */
export default function VirtualGrid({
  items,
  renderItem,
  gap = 24,
  minColumnWidth = 300,
}) {
  if (!items || items.length === 0) return null;

  return (
    <div 
      className="grid gap-6 w-full"
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${minColumnWidth}px, 1fr))`,
        gap: `${gap}px`
      }}
    >
      {items.map((item, index) => (
        <div key={item.id || index}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

