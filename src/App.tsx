import React, { useState, useMemo, useEffect } from 'react';
import { LayoutDashboard, Wallet, Receipt, TrendingUp, Calculator, Plus, Trash2, Castle, Menu, X, Calendar, LogOut, Shield, Target, Home, Car, Sword, Coins, Plane, Monitor, Heart, Landmark, Crown, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import AuthScreen from './AuthScreen';
import { auth, signOut } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

type EntryTypeIncome = 'salary' | 'extra';
type EntryTypeExpense = 'fixed' | 'ifood' | 'variables' | 'unforeseen';
type EntryTypeInvestment = 'main' | 'emergency';

interface Entry {
  id: string;
  amount: number;
  description: string;
  date: string;
  category?: string;
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};

function useUserData<T>(userName: string, key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const prefixedKey = `templario_${userName}_${key}`;
  
  const [state, setState] = useState<T>(() => {
    try {
      const data = localStorage.getItem(prefixedKey);
      return data ? JSON.parse(data) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(prefixedKey, JSON.stringify(state));
  }, [prefixedKey, state]);

  return [state, setState];
}

function CurrencyInput({ value, onValueChange, ...props }: { value: string | number; onValueChange: (val: string) => void; [x: string]: any }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (!val) {
      onValueChange('');
      return;
    }
    const numericValue = parseInt(val, 10) / 100;
    onValueChange(numericValue.toString());
  };

  const formattedValue = (value === '' || value === undefined)
    ? '' 
    : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value));

  return (
    <input
      type="text"
      inputMode="numeric"
      value={formattedValue}
      onChange={handleChange}
      {...props}
    />
  );
}

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Hide splash screen after 2.5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!user) {
    return <AuthScreen onEnter={setUser} />;
  }

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const displayName = user.displayName || user.email?.split('@')[0] || 'Cavaleiro';

  return <MainApp key={user.uid} userName={user.uid} displayUserName={displayName} onLogout={handleLogout} />;
}

function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden group">
       {/* Cinematic Background */}
       <div 
         className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 duration-[3000ms] ease-out transform transition-transform" 
         style={{ backgroundImage: 'url(https://i.imgur.com/A1y6lMe.jpeg)' }}
       />
       <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
       
       <div className="relative z-10 flex flex-col items-center animate-in zoom-in duration-1000 slide-in-from-bottom-5">
         <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/5 rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_50px_rgba(139,0,0,0.5)] mb-6 backdrop-blur-md">
           <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-[#8B0000] drop-shadow-[0_0_15px_rgba(139,0,0,0.8)]" />
         </div>
         <h1 className="text-3xl sm:text-5xl font-serif text-white tracking-widest drop-shadow-lg uppercase font-bold text-center">
            Templário
         </h1>
         <p className="mt-4 text-gray-300 font-medium tracking-widest uppercase text-sm sm:text-base drop-shadow-md text-center max-w-xs">
            Forjando seu Império
         </p>
         
         <div className="mt-12 flex space-x-2">
            <div className="w-2 h-2 bg-[#8B0000] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-[#8B0000] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-[#8B0000] rounded-full animate-bounce"></div>
         </div>
       </div>
    </div>
  );
}

function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-40 flex justify-center animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-white/20 p-4 md:px-6 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-4 max-w-lg w-full text-white">
        <div className="p-3 bg-white/10 rounded-xl hidden sm:block">
           <Shield className="w-6 h-6 text-[#8B0000]" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-serif font-bold text-lg">Instalar Templário</h3>
          <p className="text-xs text-gray-400 mt-1">Adicione o aplicativo à sua tela inicial para uma experiência premium em tela cheia.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button onClick={() => setIsVisible(false)} className="flex-1 sm:flex-none px-4 py-2 text-sm text-gray-400 hover:text-white transition">Agora não</button>
          <button onClick={handleInstallClick} className="flex-1 sm:flex-none px-4 py-2 bg-[#8B0000] hover:bg-[#660000] text-white rounded-lg text-sm font-bold shadow-lg transition">Instalar App</button>
        </div>
      </div>
    </div>
  );
}

const getEffectiveAmount = (entry: any, monthStr: string) => {
  if (entry.category !== 'fixed') return Number(entry.amount);
  if (entry.exceptions && entry.exceptions[monthStr] !== undefined) return Number(entry.exceptions[monthStr]);
  
  let currentAmount = Number(entry.amount);
  if (entry.permanents && Array.isArray(entry.permanents)) {
    const sorted = [...entry.permanents].sort((a: any, b: any) => a.month.localeCompare(b.month));
    for (const p of sorted) {
      if (p.month <= monthStr) currentAmount = Number(p.amount);
    }
  }
  return currentAmount;
};

function MainApp({ userName, displayUserName, onLogout }: React.PropsWithChildren<{ userName: string, displayUserName: string, onLogout: () => void }>) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State
  const [incomes, setIncomes] = useUserData<Entry[]>(userName, 'incomes', []);
  const [expenses, setExpenses] = useUserData<Entry[]>(userName, 'expenses', []);
  const [investments, setInvestments] = useUserData<Entry[]>(userName, 'investments', []);
  const [goals, setGoals] = useUserData<any[]>(userName, 'goals', []);

  const safeIncomes = Array.isArray(incomes) ? incomes : [];
  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const safeInvestments = Array.isArray(investments) ? investments : [];

  // Simple generic add entry
  const generateId = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);

  const addEntry = (setter: React.Dispatch<React.SetStateAction<Entry[]>>, entry: Omit<Entry, 'id'>) => {
    setter(prev => Array.isArray(prev) ? [...prev, { ...entry, id: generateId() }] : [{ ...entry, id: generateId() }]);
  };

  const updateEntry = (setter: React.Dispatch<React.SetStateAction<Entry[]>>, id: string, updates: Partial<Entry>) => {
    setter(prev => Array.isArray(prev) ? prev.map(item => item.id === id ? { ...item, ...updates } : item) : []);
  };

  const removeEntry = (setter: React.Dispatch<React.SetStateAction<Entry[]>>, id: string) => {
    setter(prev => Array.isArray(prev) ? prev.filter(item => item.id !== id) : []);
  };

  // Calculations
  const getFilteredTotal = (list: Entry[], cat: string) => 
    (Array.isArray(list) ? list : []).filter(i => i.category === cat).reduce((acc, item) => acc + (Number(item.amount) || 0), 0);

  const getMonthTotal = (list: any[], cat: string, monthStr: string) => {
    return (Array.isArray(list) ? list : []).filter(i => i.category === cat).reduce((acc, item) => {
      if (item.category !== 'fixed') {
        if (typeof item.date === 'string' && item.date.startsWith(monthStr)) return acc + Number(item.amount);
        return acc;
      }
      if (!item.date || item.date.substring(0, 7) <= monthStr) return acc + getEffectiveAmount(item, monthStr);
      return acc;
    }, 0);
  };

  const [selectedMonthStr, setSelectedMonthStr] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  });
  
  const monthIncome = useMemo(() => getMonthTotal(safeIncomes, 'salary', selectedMonthStr) + getMonthTotal(safeIncomes, 'extra', selectedMonthStr), [safeIncomes, selectedMonthStr]);
  const monthExpense = useMemo(() => getMonthTotal(safeExpenses, 'fixed', selectedMonthStr) + getMonthTotal(safeExpenses, 'ifood', selectedMonthStr) + getMonthTotal(safeExpenses, 'variables', selectedMonthStr) + getMonthTotal(safeExpenses, 'unforeseen', selectedMonthStr), [safeExpenses, selectedMonthStr]);
  const monthInvestedMain = useMemo(() => getMonthTotal(safeInvestments, 'main', selectedMonthStr), [safeInvestments, selectedMonthStr]);
  const monthInvestedEmergency = useMemo(() => getMonthTotal(safeInvestments, 'emergency', selectedMonthStr), [safeInvestments, selectedMonthStr]);
  const monthBalance = monthIncome - monthExpense;

  const totalIncome = useMemo(() => safeIncomes.reduce((acc, item) => acc + (Number(item.amount) || 0), 0), [safeIncomes]);
  const totalExpense = useMemo(() => safeExpenses.reduce((acc, item) => acc + (Number(item.amount) || 0), 0), [safeExpenses]);
  
  const mainInvested = useMemo(() => getFilteredTotal(safeInvestments, 'main'), [safeInvestments]);
  const emergencyInvested = useMemo(() => getFilteredTotal(safeInvestments, 'emergency'), [safeInvestments]);
  
  const balance = totalIncome - totalExpense;

    const getBackgroundImage = () => {
    switch(activeTab) {
      case 'dashboard': return 'url(https://i.imgur.com/I0zPau9.jpeg)';
      case 'income': return 'url(https://i.imgur.com/SIxQbj1.jpeg)';
      case 'expenses': return 'url(https://i.imgur.com/IEwdV3o.jpeg)';
      case 'investments': return 'url(https://i.imgur.com/qph1E9J.jpeg)';
      case 'annual': return 'url(https://i.imgur.com/I0zPau9.jpeg)';
      case 'goals': return 'url(https://i.imgur.com/A1y6lMe.jpeg)';
      case 'calculator': return 'url(https://i.imgur.com/A1y6lMe.jpeg)';
      default: return 'none';
    }
  };

  return (
    <div className="flex h-screen bg-[#fdfbf7] text-slate-900 font-sans overflow-hidden">
      
      <PWAInstallPrompt />

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 h-screen w-[85%] max-w-[320px] md:w-72 bg-[#5e0a0a] text-[#f4efe6] flex flex-col shadow-2xl z-50 border-r border-[#3a0606] transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 md:p-8 flex flex-col gap-5 md:gap-6 bg-[#4a0808] border-b border-[#731212]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <Castle className="w-10 h-10 text-[#fca311]" />
               <div>
                  <h1 className="text-xl font-bold uppercase tracking-widest font-serif text-[#fca311] leading-none">Templário</h1>
               </div>
            </div>
            <button 
              className="md:hidden text-red-200 hover:text-white p-2 border border-transparent hover:border-red-400 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="bg-black/20 rounded-xl p-3 flex items-center justify-between border border-[#731212]/50 shadow-inner">
             <div className="flex items-center gap-2 overflow-hidden">
                <Shield className="w-5 h-5 text-gray-300 flex-shrink-0" />
                <span className="text-sm font-medium text-white truncate max-w-[120px] md:max-w-[140px]" title={`Cavaleiro ${userName}`}>
                  Cavaleiro {userName}
                </span>
             </div>
             <button 
               onClick={onLogout}
               className="p-2 hover:bg-black/30 rounded-lg text-red-300 hover:text-red-100 transition flex-shrink-0"
               title="Trocar Cavaleiro"
             >
               <LogOut className="w-4 h-4" />
             </button>
          </div>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Painel Inicial', icon: LayoutDashboard },
            { id: 'income', label: 'Dinheiro do Mês', icon: Wallet },
            { id: 'expenses', label: 'Despesas do Mês', icon: Receipt },
            { id: 'investments', label: 'Investimentos', icon: TrendingUp },
            { id: 'annual', label: 'Visualização Anual', icon: Calendar },
            { id: 'goals', label: 'Objetivos Reais', icon: Target },
            { id: 'calculator', label: 'Calculadora do Futuro', icon: Calculator },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-4 md:py-3 rounded-lg transition-all duration-300 font-medium ${
                activeTab === item.id 
                  ? 'bg-[#801313] text-white shadow-md border-l-4 border-[#fca311]' 
                  : 'text-red-200 hover:bg-[#6e0c0c] hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="p-6 text-xs text-center text-red-300 border-t border-[#731212] font-serif mt-auto">
          &copy; 2026 Ordem Financeira
        </div>
      </aside>

      {/* Main Content Areas */}
      <main 
        className="flex-1 overflow-y-auto relative w-full h-screen bg-cover md:bg-fixed bg-[center_right] md:bg-center bg-no-repeat transition-all duration-700"
        style={{ backgroundImage: getBackgroundImage() }}
      >
        <div className="fixed inset-0 bg-gradient-to-b from-black/45 to-black/65 z-0 transition-opacity duration-700 pointer-events-none" />
        
        {/* Mobile Header */}
        <div className="md:hidden flex flex-row items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent relative z-20">
          <div className="flex items-center gap-3">
             <Castle className="w-8 h-8 text-[#fca311]" />
             <h1 className="text-xl font-bold uppercase tracking-widest font-serif text-white">Templário</h1>
          </div>
          <button 
            className="text-white p-2 hover:bg-white/10 rounded-md transition"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-7 h-7" />
          </button>
        </div>

        <div className="relative z-10 w-full px-4 sm:px-8 py-6 md:py-10">
          <div className="max-w-6xl mx-auto">

            <div className="flex items-center justify-between bg-black/40 backdrop-blur-md rounded-2xl p-2 md:p-3 border border-[#d4af37]/30 text-white w-full max-w-xs mx-auto mb-6 shadow-lg relative z-50">
              <button onClick={() => {
                const parts = selectedMonthStr.split('-');
                let y = parseInt(parts[0], 10);
                let m = parseInt(parts[1], 10) - 1;
                if (m === 0) { m = 12; y -= 1; }
                setSelectedMonthStr(`${y}-${m.toString().padStart(2, '0')}`);
              }} className="p-2 hover:bg-white/10 rounded-xl transition text-[#d4af37]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <span className="font-serif font-bold text-lg md:text-xl capitalize text-white" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>
                {new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date(selectedMonthStr + '-02T00:00:00'))}
              </span>
              <button onClick={() => {
                const parts = selectedMonthStr.split('-');
                let y = parseInt(parts[0], 10);
                let m = parseInt(parts[1], 10) + 1;
                if (m === 13) { m = 1; y += 1; }
                setSelectedMonthStr(`${y}-${m.toString().padStart(2, '0')}`);
              }} className="p-2 hover:bg-white/10 rounded-xl transition text-[#d4af37]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>

            {activeTab === 'dashboard' && (
              <Dashboard 
                balance={monthBalance} 
                income={monthIncome} 
                expense={monthExpense} 
                invested={monthInvestedMain}
                allTimeInvested={mainInvested}
                investmentsData={safeInvestments.filter((i: any) => i.category === 'main')}
                emergencyTotal={emergencyInvested}
                emergencyMonth={monthInvestedEmergency}
                userName={displayUserName}
              />
            )}
          {activeTab === 'income' && (
            <IncomeTab 
              entries={safeIncomes} 
              addEntry={(e: any) => addEntry(setIncomes, e)} 
              removeEntry={(id: string) => removeEntry(setIncomes, id)}
              getFilteredTotal={(cat: string) => getMonthTotal(safeIncomes, cat, selectedMonthStr)}
              selectedMonthStr={selectedMonthStr}
            />
          )}
          {activeTab === 'expenses' && (
             <ExpensesTab 
              entries={safeExpenses} 
              addEntry={(e: any) => addEntry(setExpenses, e)} 
              removeEntry={(id: string) => removeEntry(setExpenses, id)}
              updateEntry={(id: string, updates: any) => updateEntry(setExpenses, id, updates)}
              getFilteredTotal={(cat: string) => getMonthTotal(safeExpenses, cat, selectedMonthStr)}
              selectedMonthStr={selectedMonthStr}
            />
          )}
          {activeTab === 'investments' && (
            <InvestmentsTab 
              entries={safeInvestments} 
              addEntry={(e: any) => addEntry(setInvestments, e)} 
              removeEntry={(id: string) => removeEntry(setInvestments, id)}
              getFilteredTotal={(cat: string) => getMonthTotal(safeInvestments, cat, selectedMonthStr)}
              selectedMonthStr={selectedMonthStr}
            />
          )}
          {activeTab === 'annual' && (
            <AnnualView incomes={safeIncomes} expenses={safeExpenses} investments={safeInvestments} />
          )}
          {activeTab === 'goals' && (
            <GoalsTab goals={goals} setGoals={setGoals} />
          )}
          {activeTab === 'calculator' && <FutureCalculator />}
          </div>
        </div>
      </main>
    </div>
  );
}

// --- SUB COMPONENTS ---

function Dashboard({ balance, income, expense, invested, allTimeInvested, investmentsData, emergencyTotal, emergencyMonth, userName }: any) {
  const chartData = useMemo(() => {
    if (!investmentsData || investmentsData.length === 0) return [];
    
    // Group by month
    const grouped = investmentsData.reduce((acc: any, curr: any) => {
      const monthLine = typeof curr?.date === 'string' ? curr.date.substring(0, 7) : '0000-00';
      acc[monthLine] = (acc[monthLine] || 0) + Number(curr.amount || 0);
      return acc;
    }, {});

    const sortedMonths = Object.keys(grouped).sort();
    let accumulated = 0;
    return sortedMonths.map(month => {
      accumulated += grouped[month];
      return {
        name: month.split('-').reverse().join('/'),
        valor: accumulated
      };
    });
  }, [investmentsData]);

  const prevEvolVal = allTimeInvested - invested;
  const percentEvol = allTimeInvested > 0 && prevEvolVal > 0 
    ? ((invested / prevEvolVal) * 100).toFixed(1) 
    : (invested > 0 ? '100.0' : '0.0');

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-4 border-b border-white/20 pb-6 text-center lg:text-left">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight drop-shadow-lg leading-tight">
          Bem-vindo ao seu controle financeiro,<br className="hidden sm:block" /> <span className="text-[#b91c1c] font-bold drop-shadow-md">Cavaleiro {userName}</span>
        </h1>
      </header>

      {/* Patrimônio Total Card */}
      <div className="bg-gradient-to-br from-[#1a0505] via-[#3d0808] to-[#140000] p-6 lg:p-8 rounded-[2rem] border border-[#d4af37]/30 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2.5s_infinite] transition-all" />
        
        <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-8 relative z-10">
          <div className="space-y-6 flex-1">
             <div className="flex items-center gap-3">
               <div className="p-3 bg-[#d4af37]/10 rounded-2xl backdrop-blur-md border border-[#d4af37]/40 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                 <Crown className="w-7 h-7 text-[#d4af37]" />
               </div>
               <h2 className="text-[#fca311] font-serif text-xl md:text-2xl font-medium tracking-widest uppercase text-shadow-sm">Patrimônio Total</h2>
             </div>
             
             <div>
               <div className="text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 drop-shadow-md tracking-tight py-1">
                 {formatCurrency(allTimeInvested)}
               </div>
               <p className="text-gray-400 font-medium text-xs md:text-sm mt-1">
                 Investimentos + Reserva de Emergência: <span className="text-gray-200">{formatCurrency(allTimeInvested + (emergencyTotal || 0))}</span>
               </p>
               <p className="text-[#d4af37]/80 font-serif italic mt-3 text-sm md:text-base">
                 "Seu reino financeiro continua crescendo, Cavaleiro."
               </p>
             </div>
             
             <div className="flex flex-wrap gap-3 pt-4 border-t border-[#d4af37]/10">
               <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm md:text-base text-emerald-400 font-bold">+{percentEvol}%</span>
                  <span className="text-xs md:text-sm text-gray-400 font-medium ml-1">evolução</span>
               </div>
               <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                  <Coins className="w-5 h-5 text-[#fca311]" />
                  <span className="text-sm md:text-base text-white font-bold">{formatCurrency(invested)}</span>
                  <span className="text-xs md:text-sm text-gray-400 font-medium ml-1">este mês</span>
               </div>
             </div>
          </div>
          
          <div className="w-full lg:w-[45%] h-[180px] lg:h-[220px] bg-black/40 rounded-2xl p-4 border border-[#d4af37]/10 backdrop-blur-md shadow-inner flex items-end">
            {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="80%">
              <LineChart data={chartData}>
                <Line type="monotone" dataKey="valor" stroke="#fca311" strokeWidth={3} dot={{ r: 0 }} activeDot={{ r: 6, fill: '#8B0000', stroke: '#fca311', strokeWidth: 2 }} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Patrimônio']} 
                  labelFormatter={() => ''}
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(252,163,17,0.3)', borderRadius: '12px', color: '#fff', fontSize: '14px' }}
                  itemStyle={{ color: '#fca311', fontWeight: 'bold' }}
                />
              </LineChart>
            </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#d4af37]/40 text-sm font-serif">
                Acumule riqueza para ver sua evolução patrimonial.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        <SummaryCard title="Receitas do Mês" value={income} type="positive" icon={Wallet} />
        <SummaryCard title="Despesas do Mês" value={expense} type="negative" icon={Receipt} />
        <SummaryCard title="Investido no Mês" value={invested} type="indigo" icon={Castle} />
        <SummaryCard title="Saldo Restante" value={balance} type={balance >= 0 ? "positive" : "negative"} icon={LayoutDashboard} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        <div className="bg-gradient-to-br from-indigo-950 via-blue-900 to-indigo-950 p-6 rounded-[2rem] border border-blue-400/30 shadow-xl relative overflow-hidden group">
           <div className="flex items-center gap-3 mb-4">
               <div className="p-3 bg-blue-500/20 rounded-2xl backdrop-blur-md border border-blue-400/30">
                 <Shield className="w-6 h-6 text-blue-300" />
               </div>
               <h3 className="text-blue-100 font-serif text-lg md:text-xl font-medium tracking-wide">Reserva de Emergência</h3>
           </div>
           <div className="text-3xl md:text-4xl font-bold text-white mb-2">{formatCurrency(emergencyTotal || 0)}</div>
           <div className="text-sm text-blue-300 font-medium">+ {formatCurrency(emergencyMonth || 0)} aportado este mês</div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, type, icon: Icon }: any) {
  const borderColors: Record<string, string> = {
    positive: "border-emerald-200/60",
    negative: "border-red-200/60",
    neutral: "border-slate-200/60",
    indigo: "border-indigo-200/60",
    teal: "border-teal-200/60",
  };

  const textColors: Record<string, string> = {
    positive: "text-emerald-700",
    negative: "text-red-700",
    neutral: "text-slate-700",
    indigo: "text-indigo-700",
    teal: "text-teal-700",
  };

  return (
    <div className={`p-6 rounded-2xl border shadow-xl flex flex-col justify-between space-y-4 bg-white/90 backdrop-blur-md ${borderColors[type]}`}>
      <div className="flex justify-between items-center text-slate-600">
        <span className="font-semibold text-sm uppercase tracking-wider">{title}</span>
        <Icon className="w-5 h-5 opacity-50" />
      </div>
      <div className={`text-4xl font-bold tracking-tight ${textColors[type]}`}>
        {formatCurrency(value)}
      </div>
    </div>
  );
}

function IncomeTab({ entries, addEntry, removeEntry, getFilteredTotal, selectedMonthStr }: any) {
  const filterEntries = (cat: string) => entries.filter((e: any) => e.category === cat && (!e.date || e.date.startsWith(selectedMonthStr)));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl md:text-3xl font-serif text-white drop-shadow-lg font-medium">Dinheiro do Mês</h2>
        <p className="text-gray-200 mt-1 text-sm md:text-base drop-shadow-md font-medium">Registre todas as suas entradas (salário e extras).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <EntrySection title="Salário" category="salary" accentColor="emerald" entries={filterEntries('salary')} addEntry={addEntry} removeEntry={removeEntry} total={getFilteredTotal('salary')} />
        <EntrySection title="Extras" category="extra" accentColor="blue" entries={filterEntries('extra')} addEntry={addEntry} removeEntry={removeEntry} total={getFilteredTotal('extra')} />
      </div>
    </div>
  );
}

function ExpensesTab({ entries, addEntry, removeEntry, updateEntry, getFilteredTotal, selectedMonthStr }: any) {
  const filterOneOff = (cat: string) => entries.filter((e: any) => e.category === cat && (!e.date || e.date.startsWith(selectedMonthStr)));
  const filterFixed = () => entries.filter((e: any) => e.category === 'fixed' && (!e.date || e.date.substring(0, 7) <= selectedMonthStr));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl md:text-3xl font-serif text-white drop-shadow-lg font-medium">Despesas do Mês</h2>
        <p className="text-gray-200 mt-1 text-sm md:text-base drop-shadow-md font-medium">Controle rigoroso dos seus gastos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <EntrySection title="Despesas Fixas" category="fixed" accentColor="red" entries={filterFixed()} addEntry={addEntry} removeEntry={removeEntry} updateEntry={updateEntry} total={getFilteredTotal('fixed')} selectedMonthStr={selectedMonthStr} getEffectiveAmount={getEffectiveAmount} />
        <EntrySection title="iFood" category="ifood" accentColor="orange" entries={filterOneOff('ifood')} addEntry={addEntry} removeEntry={removeEntry} total={getFilteredTotal('ifood')} />
        <EntrySection title="Variáveis (Lazer, Roupas)" category="variables" accentColor="purple" entries={filterOneOff('variables')} addEntry={addEntry} removeEntry={removeEntry} total={getFilteredTotal('variables')} />
        <EntrySection title="Imprevistos (Emergências)" category="unforeseen" accentColor="slate" entries={filterOneOff('unforeseen')} addEntry={addEntry} removeEntry={removeEntry} total={getFilteredTotal('unforeseen')} />
      </div>
    </div>
  );
}

function InvestmentsTab({ entries, addEntry, removeEntry, getFilteredTotal, selectedMonthStr }: any) {
  const filterEntries = (cat: string) => entries.filter((e: any) => e.category === cat && (!e.date || e.date.startsWith(selectedMonthStr)));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl md:text-3xl font-serif text-white drop-shadow-lg font-medium">Investimentos</h2>
        <p className="text-gray-200 mt-1 text-sm md:text-base drop-shadow-md font-medium">A fortaleza do seu futuro.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <EntrySection title="Investimento Principal" category="main" accentColor="indigo" entries={filterEntries('main')} addEntry={addEntry} removeEntry={removeEntry} total={getFilteredTotal('main')} />
        <EntrySection title="Reserva de Emergência" category="emergency" accentColor="teal" entries={filterEntries('emergency')} addEntry={addEntry} removeEntry={removeEntry} total={getFilteredTotal('emergency')} />
      </div>
    </div>
  );
}

// Reusable Section for adding and listing items
function EntrySection({ title, category, accentColor, entries, addEntry, removeEntry, updateEntry, total, selectedMonthStr, getEffectiveAmount }: any) {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    addEntry({
      description: desc || title,
      amount: Number(amount),
      date: new Date().toISOString().split('T')[0],
      category
    });
    setDesc('');
    setAmount('');
  };

  const handleEditSave = (e: React.FormEvent, entry: any, type: 'month' | 'permanent' | 'simple') => {
    e.preventDefault();
    if (!editAmount || isNaN(Number(editAmount))) return;
    
    if (type === 'simple') {
      updateEntry(entry.id, { amount: Number(editAmount) });
    } else if (type === 'month') {
      const newEx = { ...(entry.exceptions || {}), [selectedMonthStr]: Number(editAmount) };
      updateEntry(entry.id, { exceptions: newEx });
    } else if (type === 'permanent') {
      const newPerms = [...(entry.permanents || []), { month: selectedMonthStr, amount: Number(editAmount) }];
      updateEntry(entry.id, { permanents: newPerms });
    }
    
    setEditingId(null);
    setEditAmount('');
  };

  const bgColors: any = {
    emerald: 'bg-emerald-50 border-emerald-100',
    blue: 'bg-blue-50 border-blue-100',
    red: 'bg-red-50 border-red-100',
    orange: 'bg-orange-50 border-orange-100',
    purple: 'bg-purple-50 border-purple-100',
    slate: 'bg-slate-50 border-slate-200',
    indigo: 'bg-indigo-50 border-indigo-100',
    teal: 'bg-teal-50 border-teal-100',
  };

  const textColors: any = {
    emerald: 'text-emerald-700',
    blue: 'text-blue-700',
    red: 'text-red-700',
    orange: 'text-orange-700',
    purple: 'text-purple-700',
    slate: 'text-slate-700',
    indigo: 'text-indigo-700',
    teal: 'text-teal-700',
  };

  return (
    <div className={`p-6 rounded-3xl border border-white/40 shadow-xl flex flex-col space-y-6 bg-white/90 backdrop-blur-md`}>
      <div className="flex flex-row justify-between items-center border-b border-gray-200 pb-4 gap-4">
        <h3 className="font-serif text-lg md:text-xl text-slate-900 font-medium drop-shadow-sm leading-tight">{title}</h3>
        <span className={`font-bold text-base md:text-lg ${textColors[accentColor]} drop-shadow-sm whitespace-nowrap`}>{formatCurrency(total)}</span>
      </div>

      <form onSubmit={handleAdd} className="flex flex-col gap-3">
        <input 
          type="text"
          placeholder="Descrição"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="bg-white/80 border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition backdrop-blur-sm"
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <CurrencyInput 
            placeholder="Valor (R$)"
            value={amount}
            required
            onValueChange={setAmount}
            className="flex-1 bg-white/80 border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition backdrop-blur-sm"
          />
          <button 
            type="submit" 
            className="bg-[#8B0000] text-white p-3 px-6 rounded-xl hover:bg-[#660000] transition shadow-md flex justify-center items-center w-full sm:w-auto"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </form>

      <div className="flex-1 overflow-y-auto max-h-48 space-y-2 pr-2">
        {entries.length === 0 ? (
          <p className="text-sm text-slate-500 font-medium italic text-center py-4">Nenhum registro.</p>
        ) : (
          entries.map((entry: any) => {
            const isEditing = editingId === entry.id;
            const shownAmount = category === 'fixed' && getEffectiveAmount ? getEffectiveAmount(entry, selectedMonthStr) : entry.amount;

            return (
              <div key={entry.id} className="flex flex-col bg-white/90 p-3 rounded-lg border border-gray-200 shadow-sm space-y-3">
                <div className="flex justify-between items-center group">
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-slate-800 truncate">{entry.description}</p>
                    <p className="text-xs text-slate-500">{entry.date}</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 pl-2">
                    <span className="text-sm font-semibold text-slate-700">{formatCurrency(shownAmount)}</span>
                    {updateEntry && category === 'fixed' && (
                       <button onClick={() => { setEditingId(entry.id); setEditAmount(''); }} className="text-blue-500 hover:text-blue-700 transition p-1" title="Editar">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                       </button>
                    )}
                    <button onClick={() => removeEntry(entry.id)} className="text-red-400 hover:text-red-600 transition p-1" title="Excluir">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {isEditing && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex flex-col gap-3 mt-2 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-bold text-gray-500 uppercase">Editar valor</span>
                       <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4"/></button>
                    </div>
                    <CurrencyInput 
                      placeholder={`Novo Valor (R$)`}
                      value={editAmount}
                      onValueChange={setEditAmount}
                      className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex flex-col sm:flex-row gap-2 mt-1">
                      <button onClick={(e) => handleEditSave(e, entry, 'month')} className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 rounded-md text-xs font-bold transition">Apenas {new Date(selectedMonthStr + '-02T00:00:00').toLocaleDateString('pt-BR', {month:'short'})}</button>
                      <button onClick={(e) => handleEditSave(e, entry, 'permanent')} className="flex-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 py-2 rounded-md text-xs font-bold transition">Permanente</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function FutureCalculator() {
  const [vp, setVp] = useState<number | string>(''); // Valor Inicial
  const [pmt, setPmt] = useState<number | string>(''); // Aporte Mensal
  const [years, setYears] = useState<number | ''>(''); // Tempo

  const interestRateYear = 0.10; // 10% a.a
  const inflationYear = 0.05; // 5% a.a

  const calculate = () => {
    const numVp = Number(vp) || 0;
    const numPmt = Number(pmt) || 0;
    const numYears = Number(years) || 0;

    // Conversão de taxa anual para taxa mensal equivalente
    const iMensal = Math.pow(1 + interestRateYear, 1 / 12) - 1;
    const tMeses = numYears * 12;

    // VF = VP(1+i)^t + PMT(((1+i)^t -1)/i)
    const factor = Math.pow(1 + iMensal, tMeses);
    const vf = (numVp * factor) + (numPmt * ((factor - 1) / iMensal));

    // Descontando inflação a.a. para valor real: ValorReal = VF / (1+inflação)^t
    // Note: t in this formula is years
    const valorReal = numYears > 0 ? vf / Math.pow(1 + inflationYear, numYears) : vf;

    return { vf, valorReal };
  };

  const { vf, valorReal } = calculate();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl md:text-3xl font-serif text-white drop-shadow-lg font-medium">Calculadora do Futuro</h2>
        <p className="text-gray-200 mt-1 text-sm md:text-base drop-shadow-md font-medium">Preveja a conquista do seu império com base em estimativas de mercado.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Formulário */}
        <div className="p-6 md:p-8 rounded-3xl border border-white/40 bg-white/90 shadow-xl backdrop-blur-md space-y-6">
          <div className="space-y-2">
             <label className="text-sm font-bold text-slate-800">Quanto de dinheiro tenho agora? (R$)</label>
             <CurrencyInput placeholder="0" value={vp} onValueChange={setVp} className="w-full border border-gray-300 bg-white/80 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition" />
          </div>
          
          <div className="space-y-2">
             <label className="text-sm font-bold text-slate-800">Quanto vou investir por mês? (R$)</label>
             <CurrencyInput placeholder="0" value={pmt} onValueChange={setPmt} className="w-full border border-gray-300 bg-white/80 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition" />
          </div>

          <div className="space-y-2">
             <label className="text-sm font-bold text-slate-800">Durante quanto tempo? (Anos)</label>
             <input type="number" placeholder="0" value={years} onChange={e => setYears(e.target.value === '' ? '' : Number(e.target.value))} className="w-full border border-gray-300 bg-white/80 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition" />
          </div>

          <div className="bg-gray-100/80 text-xs text-slate-600 p-4 rounded-xl font-mono border border-gray-200">
            Estimativa: Rentabilidade de 10% a.a.<br/>
            Estimativa: Inflação de 5% a.a.
          </div>
        </div>

        {/* Resultados */}
        <div className="p-8 rounded-3xl bg-[#8B0000]/95 backdrop-blur-md text-white shadow-xl border border-[#a81a1a]/50 space-y-8 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <Castle className="w-48 h-48" />
          </div>

          <div className="relative z-10 space-y-2 text-center md:text-left">
            <h4 className="text-red-200 font-medium uppercase tracking-widest text-sm">Patrimônio Bruto Futuro</h4>
            <p className="text-4xl md:text-5xl font-bold font-serif">{formatCurrency(vf)}</p>
            <p className="text-red-300 text-sm">Total acumulado com rentabilidade (sem descontar inflação).</p>
          </div>

          <div className="relative z-10 border-t border-[#a81a1a] pt-8 space-y-2 text-center md:text-left">
            <h4 className="text-red-200 font-medium uppercase tracking-widest text-sm">Valor Real (Poder de Compra)</h4>
            <p className="text-3xl md:text-4xl font-bold font-serif text-[#fca311]">{formatCurrency(valorReal)}</p>
            <p className="text-red-300 text-sm">Descontando a inflação média, este é o poder de compra equivalente aos valores de hoje.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

function AnnualView({ incomes, expenses, investments }: any) {
  const currentYearStr = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState(currentYearStr);
  
  // Extract all years that have data
  const allDates = [...incomes, ...expenses, ...investments]
    .map((e: any) => e?.date)
    .filter(Boolean);
  const yearsWithData = Array.from(new Set(allDates.map((d: any) => {
    if (typeof d === 'string') return d.split('-')[0];
    return null;
  }))).filter(Boolean);
  if (!yearsWithData.includes(currentYearStr)) {
    yearsWithData.push(currentYearStr);
  }
  const uniqueYears = yearsWithData.sort().reverse();

  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  
  const annualData = months.map((monthName, index) => {
    const monthStr = (index + 1).toString().padStart(2, '0');
    const prefix = `${selectedYear}-${monthStr}`;
    
    const mIncome = incomes.filter((i: any) => typeof i.date === 'string' && i.date.startsWith(prefix)).reduce((sum: number, item: any) => sum + (Number(item.amount) || 0), 0);
    const mExpense = expenses.filter((i: any) => typeof i.date === 'string' && i.date.startsWith(prefix)).reduce((sum: number, item: any) => sum + (Number(item.amount) || 0), 0);
    const mMainInv = investments.filter((i: any) => typeof i.date === 'string' && i.date.startsWith(prefix) && i.category === 'main').reduce((sum: number, item: any) => sum + (Number(item.amount) || 0), 0);
    const mEmergInv = investments.filter((i: any) => typeof i.date === 'string' && i.date.startsWith(prefix) && i.category === 'emergency').reduce((sum: number, item: any) => sum + (Number(item.amount) || 0), 0);
    const mExpCount = expenses.filter((i: any) => typeof i.date === 'string' && i.date.startsWith(prefix)).length;

    return {
      name: monthName,
      monthStr,
      income: mIncome,
      expense: mExpense,
      balance: mIncome - mExpense,
      invested: mMainInv + mEmergInv,
      emergencyInvested: mEmergInv,
      expenseCount: mExpCount
    };
  });

  const totalIncome = annualData.reduce((sum: number, m: any) => sum + m.income, 0);
  const totalExpense = annualData.reduce((sum: number, m: any) => sum + m.expense, 0);
  const totalInvested = annualData.reduce((sum: number, m: any) => sum + m.invested, 0);
  const totalBalance = totalIncome - totalExpense;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif text-white drop-shadow-lg font-medium">Visualização Anual</h2>
          <p className="text-gray-200 mt-1 text-sm md:text-base drop-shadow-md font-medium">Seu progresso mês a mês.</p>
        </div>
        <select 
          value={selectedYear} 
          onChange={e => setSelectedYear(e.target.value)}
          className="bg-white/90 border border-white/50 text-slate-800 rounded-xl px-4 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-[#8B0000] cursor-pointer shadow-md"
        >
          {uniqueYears.map(year => (
            <option key={year as string} value={year as string}>{year as string}</option>
          ))}
        </select>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
         <AnnualSummaryCard title={`Receitas ${selectedYear}`} value={totalIncome} type="positive" />
         <AnnualSummaryCard title={`Despesas ${selectedYear}`} value={totalExpense} type="negative" />
         <AnnualSummaryCard title={`Saldo ${selectedYear}`} value={totalBalance} type={totalBalance >= 0 ? "positive" : "negative"} />
         <AnnualSummaryCard title={`Investido ${selectedYear}`} value={totalInvested} type="indigo" />
      </div>

      {/* Chart */}
      <div className="p-6 md:p-8 rounded-3xl border border-white/40 shadow-xl bg-white/95 backdrop-blur-md overflow-hidden hidden md:block">
        <h3 className="font-serif text-xl text-slate-900 font-medium mb-6">Balanço Anual ({selectedYear})</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={annualData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{fontSize: 12}} tickFormatter={(val) => val.substring(0,3)} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(val) => `R$ ${val}`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} cursor={{fill: 'rgba(0,0,0,0.05)'}} />
              <Legend wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} />
              <Bar dataKey="income" name="Receita" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Despesa" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="invested" name="Investido" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Months Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {annualData.map(month => (
          <div key={month.monthStr} className="p-5 rounded-2xl border flex justify-between flex-col border-white/40 bg-white/95 backdrop-blur-md shadow-lg group hover:-translate-y-1 transition-transform duration-300">
            <h4 className="font-serif text-lg font-bold text-slate-800 mb-4 border-b border-gray-200 pb-2">{month.name}</h4>
            <div className="space-y-3 text-sm flex-1 flex flex-col justify-end">
              <div className="flex justify-between items-center">
                 <span className="text-slate-500 font-medium">Receitas</span>
                 <span className="text-emerald-600 font-bold">{formatCurrency(month.income)}</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-slate-500 font-medium">Despesas ({month.expenseCount})</span>
                 <span className="text-red-600 font-bold">{formatCurrency(month.expense)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                 <span className="text-slate-700 font-bold">Saldo</span>
                 <span className={`font-bold ${month.balance >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>{formatCurrency(month.balance)}</span>
              </div>
              
              {month.invested > 0 && (
                <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-100">
                  <span className="text-indigo-600 font-medium flex items-center gap-1"><TrendingUp className="w-3 h-3"/> Investido</span>
                  <span className="text-indigo-700 font-bold">{formatCurrency(month.invested)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnnualSummaryCard({ title, value, type }: any) {
   const colors: Record<string, string> = {
    positive: "text-emerald-700 bg-emerald-50/95 border-emerald-200/60",
    negative: "text-red-700 bg-red-50/95 border-red-200/60",
    indigo: "text-indigo-700 bg-indigo-50/95 border-indigo-200/60",
  };

  return (
    <div className={`p-4 md:p-5 rounded-2xl border shadow-lg flex flex-col justify-center space-y-2 backdrop-blur-md ${colors[type]}`}>
      <span className="font-semibold text-xs md:text-sm uppercase tracking-wider opacity-70 truncate">{title}</span>
      <div className={`text-xl md:text-2xl font-bold tracking-tight truncate`}>
        {formatCurrency(value)}
      </div>
    </div>
  );
}

function GoalSummaryCard({ title, value, type, isString = false }: any) {
   const colors: Record<string, string> = {
    neutral: "text-slate-800 bg-white/95 border-gray-200",
    positive: "text-emerald-700 bg-emerald-50/95 border-emerald-200/60",
    negative: "text-red-700 bg-red-50/95 border-red-200/60",
    indigo: "text-indigo-700 bg-indigo-50/95 border-indigo-200/60",
    gold: "text-yellow-700 bg-yellow-50/95 border-yellow-200/60",
  };

  return (
    <div className={`p-4 md:p-5 rounded-2xl border shadow-lg flex flex-col justify-center space-y-2 backdrop-blur-md ${colors[type]}`}>
      <span className="font-semibold text-xs md:text-sm uppercase tracking-wider opacity-70 truncate">{title}</span>
      <div className={`text-xl md:text-2xl font-bold tracking-tight truncate`}>
        {isString ? value : formatCurrency(value)}
      </div>
    </div>
  );
}

function GoalCard({ goal, addProgress, removeGoal, iconsList }: any) {
  const [addAmount, setAddAmount] = useState('');
  const IconObj = iconsList.find((i: any) => i.id === goal.icon)?.icon || Sword;
  const isCompleted = goal.currentValue >= goal.targetValue;
  const percentage = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));

  return (
    <div className={`p-6 rounded-3xl border shadow-xl flex flex-col space-y-5 backdrop-blur-md transition-all ${isCompleted ? 'bg-[#fdfaec]/95 border-[#fca311]/50' : 'bg-white/95 border-white/40'}`}>
       <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
             <div className={`p-3 rounded-xl flex-shrink-0 ${isCompleted ? 'bg-[#fca311]/20 text-[#d4af37]' : 'bg-red-50 text-[#8B0000]'}`}>
               <IconObj className="w-6 h-6" />
             </div>
             <div className="overflow-hidden">
                <h4 className="font-serif text-lg md:text-xl text-slate-900 font-medium leading-tight truncate">{goal.name}</h4>
                {goal.deadline && <p className="text-xs text-slate-500 mt-1 truncate">Prazo: {goal.deadline}</p>}
                {goal.description && <p className="text-sm text-slate-600 mt-1 truncate">{goal.description}</p>}
             </div>
          </div>
          <button onClick={() => removeGoal(goal.id)} className="text-red-400 hover:text-red-600 transition p-2 flex-shrink-0">
            <Trash2 className="w-4 h-4" />
          </button>
       </div>

       <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
             <span className="text-slate-700">{formatCurrency(goal.currentValue)}</span>
             <span className="text-slate-500">{formatCurrency(goal.targetValue)}</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
             <div 
               className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-gradient-to-r from-[#d4af37] to-[#fca311]' : 'bg-gradient-to-r from-[#8B0000] to-red-600'}`}
               style={{ width: `${percentage}%` }}
             />
          </div>
          <div className="flex justify-between text-xs font-semibold">
             <span className={isCompleted ? 'text-[#d4af37]' : 'text-[#8B0000]'}>{percentage}% concluído</span>
             {!isCompleted && <span className="text-slate-500">Falta {formatCurrency(goal.targetValue - goal.currentValue)}</span>}
          </div>
       </div>

       {isCompleted ? (
         <div className="bg-[#fca311]/10 rounded-xl p-3 flex items-center justify-center gap-2 text-[#d4af37] font-bold border border-[#fca311]/30 mt-auto">
           <CheckCircle className="w-5 h-5" />
           Missão concluída, Cavaleiro.
         </div>
       ) : (
         <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-100 mt-auto">
            <CurrencyInput 
              placeholder="Adicionar valor R$"
              value={addAmount}
              onValueChange={setAddAmount}
              className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition"
            />
            <button 
              onClick={() => { addProgress(goal.id, addAmount); setAddAmount(''); }}
              className="bg-[#8B0000] text-white px-4 py-3 sm:py-2 rounded-xl text-sm font-bold hover:bg-[#660000] transition shadow-md w-full sm:w-auto"
            >
              Adicionar
            </button>
         </div>
       )}
    </div>
  );
}

function GoalsTab({ goals, setGoals }: any) {
  const safeGoals = Array.isArray(goals) ? goals : [];
  
  const totalGoals = safeGoals.length;
  const completedGoals = safeGoals.filter((g: any) => g.currentValue >= g.targetValue).length;
  const totalAccumulated = safeGoals.reduce((sum: number, g: any) => sum + (Number(g.currentValue) || 0), 0);

  const [name, setName] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [currentValue, setCurrentValue] = useState('0');
  const [deadline, setDeadline] = useState('');
  const [desc, setDesc] = useState('');
  const [icon, setIcon] = useState('Sword');

  const iconsList = [
    { id: 'Home', icon: Home, label: 'Casa' },
    { id: 'Car', icon: Car, label: 'Veículo' },
    { id: 'Plane', icon: Plane, label: 'Viagem' },
    { id: 'Target', icon: Target, label: 'Alvo Financeiro' },
    { id: 'Sword', icon: Sword, label: 'Conquista/Império' },
    { id: 'Coins', icon: Coins, label: 'Reserva' },
    { id: 'Monitor', icon: Monitor, label: 'Setup/Tech' },
    { id: 'Heart', icon: Heart, label: 'Casamento/Família' },
    { id: 'Landmark', icon: Landmark, label: 'Aposentadoria / Investimento' },
  ];

  const generateId = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetValue) return;

    const newGoal = {
      id: generateId(),
      name,
      targetValue: Number(targetValue),
      currentValue: Number(currentValue) || 0,
      deadline,
      description: desc,
      icon
    };

    setGoals([...safeGoals, newGoal]);
    setName('');
    setTargetValue('');
    setCurrentValue('0');
    setDeadline('');
    setDesc('');
    setIcon('Sword');
  };

  const addProgress = (id: string, amountStr: string) => {
    const amount = Number(amountStr);
    if (!amount || amount <= 0) return;
    setGoals(safeGoals.map((g: any) => g.id === id ? { ...g, currentValue: g.currentValue + amount } : g));
  };
  
  const removeGoal = (id: string) => {
    setGoals(safeGoals.filter((g: any) => g.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div>
        <h2 className="text-2xl md:text-3xl font-serif text-white drop-shadow-lg font-medium">Objetivos Reais</h2>
        <p className="text-gray-200 mt-1 text-sm md:text-base drop-shadow-md font-medium">Forje seu império financeiro, meta por meta.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <GoalSummaryCard title="Total de Objetivos" value={totalGoals.toString()} type="neutral" isString />
        <GoalSummaryCard title="Objetivos Concluídos" value={completedGoals.toString()} type="gold" isString />
        <GoalSummaryCard title="Valor Acumulado" value={totalAccumulated} type="positive" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Form */}
         <div className="lg:col-span-1">
           <div className="p-6 md:p-8 rounded-3xl border border-white/40 shadow-xl bg-white/95 backdrop-blur-md sticky top-6">
             <h3 className="font-serif text-xl text-slate-900 font-medium mb-6">Iniciar Nova Conquista</h3>
             <form onSubmit={handleAdd} className="space-y-4">
                 
                 <div className="space-y-1">
                   <label className="text-sm font-bold text-slate-800">Nome do Objetivo</label>
                   <input required type="text" placeholder="Ex: Casa Própria" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/80 border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition shadow-sm" />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                     <label className="text-sm font-bold text-slate-800">Alvo (R$)</label>
                     <CurrencyInput required placeholder="200000" value={targetValue} onValueChange={setTargetValue} className="w-full bg-white/80 border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition shadow-sm" />
                   </div>
                   <div className="space-y-1">
                     <label className="text-sm font-bold text-slate-800">Já guardado (R$)</label>
                     <CurrencyInput placeholder="0" value={currentValue} onValueChange={setCurrentValue} className="w-full bg-white/80 border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition shadow-sm" />
                   </div>
                 </div>

                 <div className="space-y-1">
                   <label className="text-sm font-bold text-slate-800">Prazo (Opcional)</label>
                   <input type="text" placeholder="Ex: Dezembro 2028" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full bg-white/80 border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition shadow-sm" />
                 </div>

                 <div className="space-y-1">
                   <label className="text-sm font-bold text-slate-800">Círculo / Categoria</label>
                   <select value={icon} onChange={e => setIcon(e.target.value)} className="w-full bg-white/80 border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition shadow-sm">
                     {iconsList.map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
                   </select>
                 </div>

                 <div className="space-y-1">
                   <label className="text-sm font-bold text-slate-800">Descrição (Opcional)</label>
                   <textarea placeholder="Pequenos detalhes sobre o objetivo..." value={desc} onChange={e => setDesc(e.target.value)} className="w-full bg-white/80 border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition shadow-sm resize-none h-20" />
                 </div>

                 <button type="submit" className="w-full bg-[#8B0000] text-white py-3 rounded-xl hover:bg-[#660000] transition shadow-md font-bold mt-2 flex items-center justify-center gap-2">
                   <Plus className="w-5 h-5"/> Criar Objetivo
                 </button>
             </form>
           </div>
         </div>

         {/* Goals Grid */}
         <div className="lg:col-span-2">
            {safeGoals.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 lg:p-24 border-2 border-dashed border-white/40 rounded-3xl bg-black/20 backdrop-blur-sm">
                <Target className="w-16 h-16 text-white/50 mb-4" />
                <h3 className="text-xl font-serif text-white font-medium mb-2">Nenhum objetivo traçado</h3>
                <p className="text-white/70 text-sm">Registre sua primeira grande conquista ao lado e comece a forjar seu império.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {safeGoals.map((goal: any) => (
                   <GoalCard key={goal.id} goal={goal} addProgress={addProgress} removeGoal={removeGoal} iconsList={iconsList} />
                 ))}
              </div>
            )}
         </div>
      </div>
    </div>
  );
}

