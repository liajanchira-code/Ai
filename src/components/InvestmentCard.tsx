
import React, { useEffect, useState } from 'react';
import { Timer, CheckCircle2, Monitor, Coins, Zap, Sparkles, CreditCard, ArrowDown, Activity } from 'lucide-react';
import { Investment } from '../types';

interface InvestmentCardProps {
  investment: Investment;
  onClaim: () => void;
  isActive: boolean;
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({ investment, onClaim, isActive }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [canClaim, setCanClaim] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      if (!investment.last_claim_at) {
        setCanClaim(true);
        setTimeLeft('Available');
        return;
      }

      const lastClaim = new Date(investment.last_claim_at).getTime();
      const now = Date.now();
      const diff = now - lastClaim;
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (diff >= twentyFourHours) {
        setCanClaim(true);
        setTimeLeft('Available');
      } else {
        setCanClaim(false);
        const remaining = twentyFourHours - diff;
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${minutes}m`);
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 60000);
    return () => clearInterval(timer);
  }, [investment.last_claim_at]);

  const daysRemaining = investment.total_days - investment.days_passed;
  const progress = (investment.days_passed / investment.total_days) * 100;

  return (
    <div className="relative group overflow-hidden rounded-[3rem] p-[1.5px] transition-all hover:scale-[1.02] active:scale-[0.98] duration-500 shadow-2xl">
      {/* Premium Outer Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E2136E] via-pink-400 to-indigo-500 opacity-20 group-hover:opacity-40 blur-2xl transition-opacity"></div>
      
      <div className="relative bg-white/80 backdrop-blur-3xl rounded-[3rem] border border-white/60 shadow-inner flex min-h-[250px] overflow-hidden">
        
        {/* LEFT SIDE: Realistic ATM Booth Structure */}
        <div className="w-32 sm:w-40 bg-gradient-to-b from-gray-100/40 to-white/60 border-r border-white/50 relative flex flex-col items-center py-6 px-3">
          {/* Machine Body Bezel */}
          <div className="absolute inset-y-4 inset-x-2 bg-gradient-to-b from-gray-200/50 to-gray-50/50 rounded-[2rem] border border-white/80 shadow-inner"></div>
          
          <div className="relative z-10 flex flex-col items-center space-y-6 w-full">
            {/* ATM Neon Digital Screen */}
            <div className="w-full aspect-[4/5] bg-gray-950 rounded-2xl p-2 border-2 border-gray-300 shadow-[0_0_15px_rgba(59,130,246,0.3)] relative overflow-hidden group-hover:border-blue-400 transition-colors">
              <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>
              <div className="flex flex-col items-center justify-center h-full space-y-2">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-green-500 rounded-full animate-ping"></div>
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                </div>
                <Monitor className="w-7 h-7 text-blue-400 opacity-80" />
                <div className="text-center">
                  <p className="text-[6px] font-black text-blue-300 uppercase tracking-tighter">System Active</p>
                  <p className="text-[5px] text-blue-500/60 font-mono">ID: {investment.id.slice(-5).toUpperCase()}</p>
                </div>
              </div>
            </div>

            {/* ATM Card Reader Slot */}
            <div className="w-14 h-2 bg-gray-800 rounded-full border border-gray-600 shadow-inner relative">
               <div className="absolute inset-y-0 left-0 w-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,1)]"></div>
            </div>

            {/* Premium Cash Dispenser (Payout Slot) */}
            <div className="w-full bg-gradient-to-b from-[#E2136E] to-[#B00E56] rounded-[1.8rem] py-4 shadow-xl border border-white/20 flex flex-col items-center space-y-2 relative overflow-hidden group-hover:shadow-pink-200 transition-shadow">
               <div className="absolute top-0 inset-x-0 h-1 bg-white/20"></div>
               <div className="p-2 bg-white/10 rounded-full">
                  <Coins className="w-8 h-8 text-yellow-300 animate-bounce" />
               </div>
               <div className="flex flex-col items-center leading-none">
                  <span className="text-[7px] text-white font-black uppercase tracking-widest">Withdrawal</span>
                  <ArrowDown className="w-3 h-3 text-white/60 animate-bounce mt-1" />
               </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Financial Info & Controls */}
        <div className="flex-1 p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#E2136E] rounded-full animate-pulse"></div>
                  <h4 className="text-[10px] font-black text-[#E2136E] uppercase tracking-[0.2em]">Premium Booth v4.2</h4>
                </div>
                <div className="flex items-baseline space-x-1.5">
                   <span className="text-xl font-bold text-gray-400">৳</span>
                   <h3 className="text-4xl font-black text-gray-900 tracking-tight">{investment.plan_amount.toLocaleString()}</h3>
                </div>
              </div>
              <div className="bg-green-50 px-3 py-1.5 rounded-xl border border-green-100 flex items-center space-x-1.5">
                 <Activity className="w-3.5 h-3.5 text-green-500" />
                 <span className="text-[9px] font-black text-green-600 uppercase">Operational</span>
              </div>
            </div>

            {/* High Performance Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/60 backdrop-blur-md border border-white p-3.5 rounded-2xl shadow-sm">
                 <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest mb-1.5">Daily Flow</p>
                 <div className="flex items-center space-x-1.5">
                    <Zap className="w-4 h-4 text-[#E2136E] fill-[#E2136E]" />
                    <p className="text-lg font-black text-gray-800">৳{investment.daily_return}</p>
                 </div>
              </div>
              <div className="bg-white/60 backdrop-blur-md border border-white p-3.5 rounded-2xl shadow-sm">
                 <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest mb-1.5">Duration</p>
                 <div className="flex items-center space-x-1.5">
                    <Timer className="w-4 h-4 text-blue-500" />
                    <p className="text-lg font-black text-gray-800">{daysRemaining}<span className="text-[10px] ml-0.5 text-gray-400">D</span></p>
                 </div>
              </div>
            </div>

            {/* Performance Progress */}
            <div className="space-y-2 pt-2">
               <div className="flex justify-between items-center px-1">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                    <Sparkles className="w-3 h-3 mr-1 text-yellow-500" />
                    Extraction Progress
                  </span>
                  <span className="text-xs font-black text-[#E2136E]">{Math.round(progress)}%</span>
               </div>
               <div className="h-3 w-full bg-gray-100/50 rounded-full p-0.5 overflow-hidden border border-white shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-[#E2136E] via-pink-400 to-[#E2136E] rounded-full transition-all duration-1000 relative" 
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-24 animate-shine"></div>
                  </div>
               </div>
            </div>
          </div>

          {/* Main Action Call to Booth */}
          <div className="pt-4">
            <button 
              disabled={!canClaim}
              onClick={onClaim}
              className={`w-full py-5 rounded-[1.8rem] font-black text-lg transition-all transform active:scale-95 flex items-center justify-center space-x-3 relative overflow-hidden group/btn ${
                canClaim 
                  ? 'bg-gray-900 text-white shadow-2xl shadow-gray-200' 
                  : 'bg-gray-50 text-gray-300 border border-gray-100'
              }`}
            >
              {canClaim ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                  <CreditCard className="w-6 h-6 text-[#E2136E]" />
                  <span className="tracking-tight uppercase text-sm">Harvest ৳{investment.daily_return}</span>
                  <div className="p-1 bg-white/10 rounded-lg ml-2">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </>
              ) : (
                <>
                  <Timer className="w-5 h-5 opacity-60" />
                  <span className="text-sm font-bold">Cooldown: {timeLeft}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-shine { animation: shine 3.5s linear infinite; }
        .animate-spin-slow { animation: spin-slow 10s linear infinite; }
      `}} />
    </div>
  );
};

export default InvestmentCard;
