import MainLayout from '../components/layout/MainLayout';

const MAP_BG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCVcOpmvDTob__wN13qrLOBhoyYhTwS1xuHBkz8A_d1--hW6e8d3O91TnWciv2bmmm3ukLwPvgMU7Fegh54vqXmfywstFw7SdbXvV3ESvKxBvQv7APyk4amEbQGslwRp2ottr6NxSCuJbzqZN43Ag-_ewMn7_9PXJYRrBRybOwrY8Rd8GAg86a70uMMn_B12lTqlce0T7WsWpD6Jfu80CHgdUDc_84rr42ko35kc83gZMiOAkNkTjKYLvZ6vN1k9q1CuIzl8eowg';
const COFFEE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqiLCYZXPth6yokS4Yc4DYd88mDCf-nZUuIptEbRg-Rw-jk__QK84HCnZZdIxSqbvQeRGdZ7FRa0iQGq2aSmahGd--Z02DqamtkiGLseC1a0FrDYBhqNJ9C5hu0TVVRl6QZknVNF-M2aqyXDfgXNqqyliaCEHbUvg6JlZUxcZFh0QJVtnoNFQNu6zCLZS5nCkw5a1JAJAfFGqyI6dDf5Jf-mB3ZvPsQQ34PPb2d9WV9PqOWdQp8OkKjhw9R-T8UKdF79Q33pru8w';

const filters = [
  { label: 'Semua Kenangan', active: true },
  { label: 'Kencan Pertama', active: false },
  { label: 'Jalan-Jalan', active: false },
  { label: 'Spesial', active: false },
];

export default function InteractiveMap() {
  return (
    <MainLayout activePage="/peta" className="!pt-0 !pb-0 !px-0">
      <div className="relative w-full h-screen">
        {/* Map Background */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <img alt="Peta romantis" className="w-full h-full object-cover opacity-60 mix-blend-multiply" src={MAP_BG} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-background/10 pointer-events-none" />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col pt-32 px-6 md:px-12 pb-32">
          {/* Filters */}
          <div className="w-full flex justify-center mb-12">
            <div className="glass-panel rounded-full p-2 flex gap-2 ambient-shadow pointer-events-auto">
              {filters.map((f) => (
                <button
                  key={f.label}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
                    f.active ? 'bg-primary-container text-on-primary-container shadow-sm' : 'text-on-surface hover:bg-surface-container/50'
                  } ${f.label === 'Jalan-Jalan' ? 'hidden sm:block' : ''}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Map Markers */}
          <div className="relative w-full h-full pointer-events-none">
            {/* Marker: Trip */}
            <button className="absolute top-[20%] left-[25%] pointer-events-auto transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-white text-secondary hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>flight</span>
              </div>
            </button>

            {/* Marker: Special */}
            <button className="absolute bottom-[30%] right-[20%] pointer-events-auto transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-white text-tertiary hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
            </button>

            {/* Active Marker + Popup */}
            <div className="absolute top-[45%] left-[55%] lg:left-[45%] pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-6">
              <button className="relative w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(113,88,91,0.3)] border-4 border-white text-white z-20 animate-[pulse-soft_3s_infinite_ease-in-out]">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              </button>

              <div className="glass-panel rounded-2xl p-4 w-[280px] sm:w-[320px] ambient-shadow relative z-30">
                <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-white/60 border-l border-b border-white/40 transform rotate-45 backdrop-blur-md" />
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-4 shadow-sm transform -rotate-1">
                  <img alt="Kenangan kopi" className="w-full h-full object-cover" src={COFFEE} />
                  <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-primary flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                    12 Okt
                  </div>
                </div>
                <div className="px-2">
                  <h3 className="font-serif text-2xl text-on-surface mb-1">Kopi Pertama Kita</h3>
                  <p className="text-xs font-semibold text-on-surface-variant flex items-center gap-1 mb-3">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    Le Petit Café, Paris
                  </p>
                  <div className="border-t border-outline-variant/30 pt-3 mt-2">
                    <p className="font-serif text-xl italic text-primary leading-tight opacity-90">
                      &quot;Kita ngobrol 4 jam dan biarin kopinya dingin. Hari terbaik.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAB */}
        <button className="absolute bottom-32 md:bottom-12 right-6 md:right-12 w-16 h-16 bg-gradient-to-tr from-primary to-surface-tint rounded-full flex items-center justify-center text-white shadow-[0_10px_25px_rgba(113,88,91,0.4)] hover:scale-105 transition-transform z-40">
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>
    </MainLayout>
  );
}
