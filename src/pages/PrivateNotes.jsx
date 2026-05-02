import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getPrivateNotes, createPrivateNote, deletePrivateNote } from '../services/privateNoteService';
import { showConfirmDelete, showSuccess, showError } from '../lib/alerts';

export default function PrivateNotes() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    getPrivateNotes(user.uid)
      .then(setNotes)
      .finally(() => setLoading(false));
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!newNote.trim()) return;
    setSubmitting(true);
    try {
      const note = await createPrivateNote(user.uid, newNote);
      setNotes([note, ...notes]);
      setNewNote('');
      await showSuccess(t, 'save');
    } catch (err) {
      console.error(err);
      showError(t, t('private_notes.error_save'));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    const result = await showConfirmDelete(t);
    if (!result.isConfirmed) return;
    
    try {
      await deletePrivateNote(id);
      setNotes(notes.filter(n => n.id !== id));
      await showSuccess(t, 'delete');
    } catch (err) {
      console.error(err);
      showError(t);
    }
  }

  return (
    <MainLayout activePage="/fakta" className="bg-background dark:bg-[#0a0809]">
      <div className="max-w-2xl mx-auto min-h-[80vh] flex flex-col pt-8">
        <div className="text-center mb-10">
          <span className="material-symbols-outlined text-4xl text-zinc-600 mb-4 block">lock</span>
          <h1 className="font-serif text-3xl text-zinc-300 italic mb-2">{t('private_notes.title')}</h1>
          <p className="text-zinc-500 text-sm max-w-sm mx-auto">
            {t('private_notes.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mb-12">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder={t('private_notes.placeholder')}
            className="w-full h-32 bg-[#1a1517]/80 border border-zinc-800/50 rounded-2xl p-4 text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors resize-none shadow-inner"
            disabled={submitting}
          />
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={submitting || !newNote.trim()}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-6 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {submitting ? t('common.loading') : t('private_notes.save')}
            </button>
          </div>
        </form>

        <div className="flex flex-col gap-4 flex-1">
          {loading ? (
            <p className="text-center text-zinc-600 font-serif italic py-10">{t('private_notes.loading')}</p>
          ) : notes.length === 0 ? (
            <div className="text-center py-20 opacity-50">
              <span className="material-symbols-outlined text-4xl text-zinc-700 mb-2 block">speaker_notes_off</span>
              <p className="text-zinc-500 text-sm font-serif italic">{t('private_notes.empty')}</p>
            </div>
          ) : (
            notes.map(note => (
              <div key={note.id} className="bg-[#1a1517]/50 border border-zinc-800/30 rounded-2xl p-5 relative group">
                <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap pr-8">{note.text}</p>
                <div className="flex justify-between items-end mt-4">
                  <span className="text-[10px] text-zinc-600 font-serif italic">
                    {new Date(note.created_at).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="text-zinc-700 hover:text-red-900/80 transition-colors opacity-0 group-hover:opacity-100"
                    title={t('common.delete')}
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
