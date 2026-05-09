export default function DateIdeaCard({ image, imageIcon, title, description, tags = [], isFavorited = false, className = '' }) {
  return (
    <article className={`glass-panel rounded-2xl p-6 flex flex-col relative group overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary-container/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Image or Icon Placeholder */}
      <div className="h-48 rounded-xl mb-6 overflow-hidden">
        {image ? (
          <img
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            src={image}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full bg-primary-container/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-primary opacity-50">
              {imageIcon || 'lightbulb'}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex justify-between items-start mb-4 z-10">
        <h3 className="font-serif text-2xl text-primary">{title}</h3>
        <button className="text-outline hover:text-primary transition-colors">
          <span
            className="material-symbols-outlined"
            style={isFavorited ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            favorite
          </span>
        </button>
      </div>
      <p className="font-sans text-base text-on-surface-variant mb-6 flex-grow z-10">{description}</p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex gap-2 z-10">
          {tags.map((tag, i) => (
            <span
              key={i}
              className={`px-3 py-1 rounded-full font-sans text-[10px] font-semibold italic ${tag.className || 'bg-secondary-container/50 text-on-secondary-container'}`}
            >
              {tag.label}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
