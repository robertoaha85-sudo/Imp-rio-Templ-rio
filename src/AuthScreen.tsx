import React, { useState } from 'react';
import { Castle, Shield, Mail, Lock, CheckCircle, XCircle } from 'lucide-react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification, 
  sendPasswordResetEmail 
} from './lib/firebase';

export default function AuthScreen({ onEnter }: { onEnter: (user: any) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // Password validation
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isPasswordValid = hasUppercase && hasSpecialChar && password.length >= 6;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (isForgotPassword) {
        await sendPasswordResetEmail(auth, email);
        setMessage('E-mail de redefinição de senha enviado. Verifique sua caixa de entrada.');
        setIsForgotPassword(false);
      } else if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
          setError('Por favor, confirme seu e-mail antes de entrar.');
          await auth.signOut();
        } else {
          onEnter(userCredential.user);
        }
      } else {
        if (!isPasswordValid) {
          setError('A senha não atende aos requisitos.');
          setLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        setMessage('Conta criada! Enviamos um link de confirmação para seu e-mail.');
        await auth.signOut();
        setIsLogin(true);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') setError('E-mail ou senha incorretos.');
      else if (err.code === 'auth/email-already-in-use') setError('Este e-mail já está em uso.');
      else setError(err.message || 'Ocorreu um erro.');
    } finally {
      setLoading(false);
    }
  };

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

        {error && <div className="w-full bg-red-900/50 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm mb-4">{error}</div>}
        {message && <div className="w-full bg-emerald-900/50 border border-emerald-500/50 text-emerald-200 p-3 rounded-lg text-sm mb-4">{message}</div>}

        <form className="w-full space-y-4 md:space-y-5 text-left" onSubmit={handleAuth}>
          <div className="space-y-2">
             <label className="block text-sm md:text-base font-bold text-white/90">E-mail</label>
             <div className="relative">
               <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input 
                 type="email" 
                 required
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 placeholder="cavaleiro@reino.com"
                 className="w-full bg-white/10 border border-white/30 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fca311] focus:border-transparent transition text-base md:text-lg backdrop-blur-sm"
               />
             </div>
          </div>

          {!isForgotPassword && (
            <div className="space-y-2">
               <label className="block text-sm md:text-base font-bold text-white/90">Senha</label>
               <div className="relative">
                 <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                 <input 
                   type="password" 
                   required
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder="Sua senha secreta"
                   className="w-full bg-white/10 border border-white/30 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fca311] focus:border-transparent transition text-base md:text-lg backdrop-blur-sm"
                 />
               </div>
               
               {!isLogin && password && (
                 <div className="bg-black/40 border border-white/10 rounded-lg p-3 mt-2 text-xs md:text-sm space-y-2">
                   <p className="text-gray-300 font-medium">Requisitos da senha:</p>
                   <div className="flex items-center gap-2">
                     {hasUppercase ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                     <span className={hasUppercase ? 'text-emerald-400' : 'text-gray-400'}>Uma letra maiúscula</span>
                   </div>
                   <div className="flex items-center gap-2">
                     {hasSpecialChar ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                     <span className={hasSpecialChar ? 'text-emerald-400' : 'text-gray-400'}>Um caractere especial (!@#$%...)</span>
                   </div>
                   <div className="flex items-center gap-2">
                     {password.length >= 6 ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                     <span className={password.length >= 6 ? 'text-emerald-400' : 'text-gray-400'}>Mínimo de 6 caracteres</span>
                   </div>
                 </div>
               )}
            </div>
          )}

          {isLogin && !isForgotPassword && (
            <div className="text-right">
              <button 
                type="button" 
                onClick={() => setIsForgotPassword(true)}
                className="text-xs md:text-sm text-[#fca311] hover:text-white transition"
              >
                Esqueci minha senha
              </button>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading || (!isLogin && !isPasswordValid)}
            className="w-full bg-[#8B0000] hover:bg-[#660000] disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold uppercase tracking-wider transition-all shadow-xl hover:shadow-red-900/50 flex justify-center items-center gap-3 text-sm md:text-base mt-2"
          >
            {loading ? 'Aguarde...' : (isForgotPassword ? 'Enviar E-mail' : (isLogin ? 'Entrar no Reino' : 'Criar Conta'))}
          </button>
        </form>

        {!isForgotPassword && (
          <>
            <div className="flex items-center gap-4 w-full my-6 opacity-60">
              <div className="flex-1 h-px bg-white/20"></div>
              <span className="text-xs text-white uppercase font-bold tracking-widest">Ou</span>
              <div className="flex-1 h-px bg-white/20"></div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-3 text-sm md:text-base backdrop-blur-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className="w-5 h-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Entrar com Google
            </button>
          </>
        )}

        <div className="mt-8 text-sm text-gray-300">
          {isForgotPassword ? (
            <button onClick={() => setIsForgotPassword(false)} className="hover:text-white underline">Voltar para o Login</button>
          ) : isLogin ? (
            <p>Novo no reino? <button onClick={() => setIsLogin(false)} className="text-[#fca311] hover:text-white font-bold ml-1 transition">Aliste-se</button></p>
          ) : (
            <p>Já é um cavaleiro? <button onClick={() => setIsLogin(true)} className="text-[#fca311] hover:text-white font-bold ml-1 transition">Entrar</button></p>
          )}
        </div>
      </div>
    </div>
  );
}
