import { memo } from 'react';

const GlassCard = ({ children, className = '', rounded = 'rounded-[2rem]', padding = 'p-8', ...props }) => {
  return (
    <div className={`glass-panel ${rounded} ${padding} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default memo(GlassCard);
