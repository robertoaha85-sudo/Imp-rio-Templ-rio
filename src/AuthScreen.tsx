import React, { useState } from 'react';
import { Castle } from 'lucide-react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup 
} from './lib/firebase';

export default function AuthScreen({ onEnter }: { onEnter: (user: any) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onEnter(result.user);
    } catch (err: any) {
      console.error(err);
      setError('Erro ao entrar com o Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-black relative items-center justify-center overflow-x-hidden font-sans text-slate-800 py-10">
      <div 
        className="fixed inset-0 bg-cover bg-[center_top_20%] md:bg-center opacity-70 z-0 animate-in fade-in duration-1000"
        style={{ backgroundImage: 'url(https://i.imgur.com/I0zPau9.jpeg)' }}
      />
      <div className="fixed inset-0 bg-gradient-to-t from-black via-black/40 to-black/20 z-10" />
      
      <div className="relative z-20 w-full max-w-md p-6 md:p-10 mx-4 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/20 shadow-2xl animate-in slide-in-from-bottom-8 fade-in duration-1000 flex flex-col items-center text-center">
        <Castle className="w-12 h-12 md:w-16 md:h-16 text-[#fca311] mb-4 md:mb-6 drop-shadow-md" />
        <h1 className="text-3xl md:text-4xl font-serif text-white mb-2 drop-shadow-lg">Templário</h1>
        <p className="text-red-300 uppercase tracking-widest text-xs md:text-sm mb-6 md:mb-8 drop-shadow-md font-bold">Gestão Financeira</p>

        {error && <div className="w-full bg-red-900/50 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm mb-6">{error}</div>}

        <button 
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 py-4 rounded-xl font-bold transition-all flex justify-center items-center gap-3 text-sm md:text-base backdrop-blur-sm mt-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="w-6 h-6"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          {loading ? 'Aguarde...' : 'Entrar com Google'}
        </button>
      </div>
    </div>
  );
}
