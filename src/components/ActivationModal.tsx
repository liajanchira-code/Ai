import React from 'react';
import { X, Zap, ShieldCheck, AlertCircle, CheckCircle2, TrendingUp, Calendar } from 'lucide-react';
import { InvestmentPlan } from '../types';

interface ActivationModalProps {
  isOpen: boolean;
  plan: InvestmentPlan | null;
  userBalance: number;
  onClose: () => void;
  onConfirm: () => void;
  onDeposit: () => void;
}

const ActivationModal: React.FC<ActivationModalProps> = ({ 
  isOpen, 
  plan, 
  userBalance, 
  onClose, 
  onConfirm,
  onDeposit
}) => {
  if (!isOpen || !plan) return null;

  const hasBalance = userBalance >= plan.amount;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-300 p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 max-h-[90vh] flex flex-col">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#E2136E] to-[#B00E56] p-8 text-white relative shrink-0">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-4 bg-white/20 rounded-[2rem] backdrop-blur-md mb-2">
               <Zap className="w-8 h-8 text-yellow-300 fill-yellow-300" />
            </div>
            <h3 className="text-2xl font-black tracking-tight">অফার অ্যাক্টিভেশন</h3>
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Premium Investment Plan</p>
          </div>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
          {/* Plan Details Card */}
          <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 space-y-5">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200/50">
               <span className="text-gray-400 font-bold text-xs uppercase tracking-wider">ইনভেস্টমেন্ট অ্যামাউন্ট</span>
               <span className="text-2xl font-black text-gray-900">৳{plan.amount}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">দৈনিক আয়</p>
                  <div className="flex items-center space-x-1">
                     <TrendingUp className="w-4 h-4 text-green-500" />
                     <p className="font-black text-gray-800 text-lg">৳{plan.dailyReturn}</p>
                  </div>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">মোট লাভ</p>
                  <p className="font-black text-gray-800 text-lg">৳{plan.totalReturn}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">অফার মেয়াদ</p>
                  <div className="flex items-center space-x-1">
                     <Calendar className="w-4 h-4 text-[#E2136E]" />
                     <p className="font-black text-gray-800 text-lg">{plan.validity} দিন</p>
                  </div>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">সিকিউরিটি</p>
                  <div className="flex items-center space-x-1">
                     <ShieldCheck className="w-4 h-4 text-blue-500" />
                     <p className="font-black text-gray-800 text-xs">সুরক্ষিত</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Balance Notice Section */}
          {!hasBalance ? (
            <div className="bg-red-50 border border-red-100 p-5 rounded-2xl flex items-start space-x-3 animate-pulse">
               <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
               <div className="space-y-1">
                  <p className="text-red-700 font-black text-sm">পর্যাপ্ত ব্যালেন্স নেই!</p>
                  <p className="text-red-600/70 text-xs font-bold leading-relaxed">
                    আপনার আরও ৳{plan.amount - userBalance} প্রয়োজন। দয়া করে আগে ব্যালেন্স রিচার্জ করুন।
                  </p>
               </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-100 p-5 rounded-2xl flex items-start space-x-3">
               <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
               <div className="space-y-1">
                  <p className="text-green-700 font-black text-sm">ব্যালেন্স পর্যাপ্ত আছে</p>
                  <p className="text-green-600/70 text-xs font-bold leading-relaxed">
                    ৳{plan.amount} কেটে নেওয়া হবে।
                  </p>
               </div>
            </div>
          )}
        </div>

        {/* Action Buttons Section */}
        <div className="p-8 pt-0 shrink-0 flex flex-col space-y-3">
          {hasBalance ? (
            <button 
              onClick={onConfirm}
              className="w-full py-5 bg-[#E2136E] text-white rounded-full font-black text-lg shadow-xl shadow-pink-100 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-3"
            >
              <Zap className="w-5 h-5 text-yellow-300" />
              <span>কনফার্ম করুন</span>
            </button>
          ) : (
            <button 
              onClick={onDeposit}
              className="w-full py-5 bg-gray-900 text-white rounded-full font-black text-lg shadow-xl hover:bg-gray-800 active:scale-95 transition-all flex items-center justify-center space-x-3"
            >
              <span>রিচার্জ করুন</span>
            </button>
          )}
          <button 
            onClick={onClose}
            className="w-full py-4 text-gray-400 font-bold text-sm hover:text-gray-600 transition-colors"
          >
            এখন নয়
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivationModal;
