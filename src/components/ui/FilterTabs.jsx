export default function FilterTabs({ tabs = [], activeTab = '', onTabChange = () => {} }) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`px-6 py-2 rounded-full glass-panel font-sans text-xs font-semibold tracking-wide transition-all ${
            activeTab === tab.value
              ? 'bg-primary-container text-on-primary-container shadow-sm'
              : 'text-on-surface-variant opacity-70 hover:opacity-100 hover:bg-surface-container'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
