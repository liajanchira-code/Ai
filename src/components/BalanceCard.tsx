
import React, { useState } from 'react';
import { Eye, EyeOff, Wallet, ArrowRightLeft, ShieldCheck, Fingerprint } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
  accountId: string;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance, accountId }) => {
  const [showBalance, setShowBalance] = useState(false);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#E2136E] via-[#B00E56] to-[#8E0B45] rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(226,19,110,0.4)] transition-all duration-500 hover:shadow-[0_25px_60px_-12px_rgba(226,19,110,0.5)]">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>
      
      <div className="relative p-7 sm:p-9">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <p className="text-white/70 text-[11px] font-black uppercase tracking-[0.2em]">Available Balance</p>
            </div>
            <h2 className="text-white font-black text-xs opacity-60 ml-8 uppercase tracking-widest">Premium Account</h2>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center space-x-2 border border-white/10">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <span className="text-[10px] text-white font-black uppercase tracking-tighter">Verified</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Account ID Display - New Section */}
          <div className="flex items-center space-x-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-sm self-center">
            <Fingerprint className="w-3.5 h-3.5 text-pink-200" />
            <span className="text-[10px] text-white/90 font-black uppercase tracking-[0.15em]">Account ID: {accountId}</span>
          </div>

          <div 
            onClick={() => setShowBalance(!showBalance)}
            className="relative w-full group cursor-pointer"
          >
            {/* The Glassy Container */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] py-6 px-4 flex flex-col items-center justify-center transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/30 active:scale-[0.98]">
              <div className="relative overflow-hidden h-10 w-full flex items-center justify-center">
                <div className={`absolute transition-all duration-500 transform flex items-center ${showBalance ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                  <span className="text-4xl font-black text-white tracking-tight">
                    <span className="text-2xl mr-1 opacity-80 font-normal">৳</span>
                    {balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                
                <div className={`absolute transition-all duration-500 transform ${!showBalance ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'}`}>
                  <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full border border-white/10">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-2 h-2 bg-white/60 rounded-full"></div>
                      ))}
                    </div>
                    <span className="text-xs font-black text-white uppercase tracking-widest">Tap to see</span>
                  </div>
                </div>
              </div>

              {/* Toggle Icon */}
              <div className="mt-4 flex items-center justify-center">
                <div className="p-2 bg-white/20 rounded-full transition-transform group-hover:rotate-12">
                  {showBalance ? <EyeOff className="w-5 h-5 text-white" /> : <Eye className="w-5 h-5 text-white" />}
                </div>
              </div>
            </div>
            
            {/* Animated Glow under the card */}
            <div className="absolute -bottom-2 inset-x-10 h-1 bg-white/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>

        {/* Bottom Utility Bar */}
        <div className="mt-8 flex justify-between items-center px-2">
          <div className="flex items-center space-x-3">
             <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center animate-pulse">
                <ArrowRightLeft className="w-4 h-4 text-[#8E0B45]" />
             </div>
             <div>
               <p className="text-[10px] text-white/60 font-black uppercase leading-none mb-1">Status</p>
               <p className="text-xs text-white font-bold">Earning Mode: <span className="text-green-400">+20%</span></p>
             </div>
          </div>
          <div className="text-right">
             <p className="text-[10px] text-white/60 font-black uppercase leading-none mb-1">Today's Profit</p>
             <p className="text-sm font-black text-white">৳ 0.00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
