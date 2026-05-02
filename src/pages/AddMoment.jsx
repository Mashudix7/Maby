import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import { createMoment } from '../services/momentService';

export default function AddMoment() {
  const { user, coupleId } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const max_size = 500;

          if (width > height) {
            if (width > max_size) {
              height *= max_size / width;
              width = max_size;
            }
          } else {
            if (height > max_size) {
              width *= max_size / height;
              height = max_size;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.5));
        };
        img.onerror = error => reject(error);
      };
      reader.onerror = error => reject(error);
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Judul momen wajib diisi');
      return;
    }
    setError('');
    setLoading(true);
    try {
      let imageUrl = '';
      if (imageFile) {
        try {
          imageUrl = await compressImage(imageFile);
        } catch (e) {
          throw new Error('Gagal memproses foto. Pastikan format didukung.');
        }
      }
      await createMoment(coupleId, user.uid, {
        title: title.trim(),
        story: story || '',
        image_url: imageUrl || '',
        date: date || null,
        location: location || '',
      });
      navigate('/momen');
    } catch (err) {
      console.error('Gagal menyimpan:', err);
      setError(err.message || 'Gagal menyimpan momen');
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainLayout activePage="/momen">
      <div className="max-w-[800px] mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <h1 className="font-serif text-3xl md:text-5xl text-primary dark:text-rose-300 mb-4 italic">Abadikan Kenangan Baru</h1>
          <p className="text-lg text-on-surface-variant dark:text-zinc-400">Setiap detail bikin ceritanya jadi lengkap ✨</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12">
          {/* Section 1: Visual */}
          <section className="glass-panel rounded-2xl p-6 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-primary dark:text-rose-300 text-3xl">image</span>
              <h2 className="font-serif text-2xl text-on-surface dark:text-[#ede0df]">Visualnya</h2>
            </div>
            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden mb-4">
                <img src={imagePreview} alt="Preview" className="w-full max-h-[300px] object-cover" />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(''); }}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-outline-variant/50 dark:border-zinc-700 rounded-2xl p-12 text-center bg-surface-container-low/50 dark:bg-white/5 hover:bg-surface-container-low dark:hover:bg-white/10 transition-colors duration-300 cursor-pointer group block">
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-primary text-4xl">add_photo_alternate</span>
                </div>
                <p className="text-base text-on-surface-variant dark:text-zinc-400 mb-2">Klik untuk pilih foto</p>
                <p className="text-xs font-semibold text-outline dark:text-zinc-600">JPG, PNG, atau WebP</p>
              </label>
            )}
          </section>

          {/* Section 2: Details */}
          <section className="glass-panel rounded-2xl p-6 md:p-12 space-y-6 md:space-y-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary dark:text-rose-300 text-3xl">edit_note</span>
              <h2 className="font-serif text-2xl text-on-surface dark:text-[#ede0df]">Detailnya</h2>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface-variant dark:text-zinc-400 ml-2">Judul momen ini *</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="glass-input"
                placeholder="contoh: Pagi pertama di Paris..."
                type="text"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-on-surface-variant dark:text-zinc-400 ml-2">Kapan momen ini terjadi?</label>
                <input
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="glass-input"
                  type="date"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-on-surface-variant dark:text-zinc-400 ml-2">Di mana kita waktu itu?</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="glass-input"
                  placeholder="Cari lokasi..."
                  type="text"
                />
              </div>
            </div>
          </section>

          {/* Section 3: Story */}
          <section className="glass-panel rounded-2xl p-6 md:p-12 space-y-6 md:space-y-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary dark:text-rose-300 text-3xl">favorite</span>
              <h2 className="font-serif text-2xl text-on-surface dark:text-[#ede0df]">Ceritanya</h2>
            </div>
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="glass-input resize-none"
              placeholder="Ceritain momen kamu di sini... 💭"
              rows="6"
            />
          </section>

          {/* Error */}
          {error && (
            <div className="bg-error-container/50 text-on-error-container text-sm p-4 rounded-xl text-center">{error}</div>
          )}

          {/* Action */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-primary to-secondary text-on-primary text-xs font-semibold tracking-wide px-12 py-5 rounded-full shadow-[0_10px_30px_rgba(113,88,91,0.3)] hover:shadow-[0_15px_40px_rgba(113,88,91,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined">check</span>
              )}
              {loading ? 'Menyimpan...' : 'Simpan Kenangan'}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
