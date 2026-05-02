export default function IconButton({ icon, onClick, className = '', label = '' }) {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${className}`}
      aria-label={label}
    >
      <span className="material-symbols-outlined">{icon}</span>
    </button>
  );
}
