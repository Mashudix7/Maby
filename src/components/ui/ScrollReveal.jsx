import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

export default function ScrollReveal({ 
  children, 
  className = '', 
  delay = 0,
  direction = 'up', // 'up', 'down', 'left', 'right', 'none'
  duration = 300, // Reduced from 400 for snappier feel
  distance = '10px', // Reduced from 15px
  threshold = 0.01 // Triggers as soon as 1% of the element is visible
}) {
  const [ref, isVisible] = useIntersectionObserver({ threshold });

  const getTransform = () => {
    if (direction === 'none') return 'none';
    const axis = (direction === 'up' || direction === 'down') ? 'Y' : 'X';
    const value = (direction === 'up' || direction === 'left') ? distance : `-${distance}`;
    return `translate${axis}(${value})`;
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0,0)' : getTransform(),
        transition: `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        transitionDelay: `${delay}ms`,
        willChange: isVisible ? 'auto' : 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
}
