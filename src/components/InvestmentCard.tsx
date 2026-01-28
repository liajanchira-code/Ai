
import React, { useEffect, useState } from 'react';
import { Timer, CheckCircle2, Zap, TrendingUp, Calendar, ArrowUp } from 'lucide-react';
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

  return (
    <div className="bg-white rounded-[1.8rem] p-4 flex items-center justify-between shadow-sm border border-gray-100 active:scale-[0.98] transition-all group relative overflow-hidden">
      {/* Background Subtle Shine for Claimable items */}
      {canClaim && (
        <div className="absolute inset-0 bg-pink-50/30 animate-pulse pointer-events-none"></div>
      )}

      <div className="flex items-center space-x-4 relative z-10">
        {/* Left Icon Section */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-colors ${canClaim ? 'bg-[#E2136E] text-white' : 'bg-pink-50 text-[#E2136E]'}`}>
           <Zap className={`w-6 h-6 ${canClaim ? 'fill-white' : 'fill-current'}`} />
        </div>
        
        {/* Info Section */}
        <div className="space-y-1">
          <h4 className="font-black text-gray-900 text-base">৳{investment.plan_amount} প্ল্যান</h4>
          <div className="flex items-center space-x-3 text-[9px] font-black uppercase tracking-tighter">
            <span className="flex items-center text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" /> 
              ৳{investment.daily_return}
            </span>
            <span className="flex items-center text-blue-500">
              <Calendar className="w-3 h-3 mr-1" /> 
              মেয়াদ: {daysRemaining} দিন
            </span>
          </div>
        </div>
      </div>

      {/* Right Side Action Button */}
      <button 
        disabled={!canClaim}
        onClick={onClaim}
        className={`w-12 h-12 rounded-full flex flex-col items-center justify-center transition-all shadow-lg relative z-10 ${
          canClaim 
            ? 'bg-[#E2136E] text-white shadow-pink-100 hover:scale-110' 
            : 'bg-gray-100 text-gray-400 border border-gray-200 shadow-none cursor-not-allowed'
        }`}
      >
        {canClaim ? (
          <ArrowUp className="w-6 h-6 rotate-45" />
        ) : (
          <div className="flex flex-col items-center">
             <Timer className="w-4 h-4 mb-0.5" />
             <span className="text-[7px] font-black">{timeLeft}</span>
          </div>
        )}
      </button>
    </div>
  );
};

export default InvestmentCard;
