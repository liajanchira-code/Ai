
import React, { useState, useEffect } from 'react';
import { X, ArrowUpCircle, ArrowDownCircle, CheckCircle2, Smartphone, Hash, AlertCircle, Copy, Check } from 'lucide-react';
import { AdminSettings, Profile } from '../types';

interface TransactionModalProps {
  isOpen: boolean;
  type: 'deposit' | 'withdraw';
  onClose: () => void;
  onConfirm: (amount: number, txId?: string, senderNum?: string) => void;
  adminSettings: AdminSettings | null;
  userProfile?: Profile | null;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, type, onClose, onConfirm, adminSettings, userProfile }) => {
  const [amount, setAmount] = useState<string>('');
  const [txId, setTxId] = useState('');
  const [senderNum, setSenderNum] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  const withdrawAmounts = [80, 200, 300, 500, 1000];
  const depositQuickAmounts = [100, 500, 1000, 2000, 5000];

  // Auto-fill wallet number for withdrawal if available
  useEffect(() => {
    if (isOpen && type === 'withdraw' && userProfile?.wallet_number) {
      setSenderNum(userProfile.wallet_number);
    } else if (isOpen && type === 'deposit') {
      setSenderNum('');
    }
    setAmount('');
    setTxId('');
  }, [isOpen, type, userProfile]);

  if (!isOpen) return null;

  const handleCopy = (num: string, key: string) => {
    navigator.clipboard.writeText(num);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('সঠিক অ্যামাউন্ট সিলেক্ট করুন');
      return;
    }

    if (type === 'deposit') {
      if (!senderNum || senderNum.length < 11) {
        alert('আপনার সঠিক পেমেন্ট নম্বরটি দিন');
        return;
      }
      if (!txId || txId.length < 6) {
        alert('সঠিক ট্রানজেকশন আইডি দিন');
        return;
      }
    } else if (type === 'withdraw') {
      if (!senderNum || senderNum.length < 11) {
        alert('উইথড্র করার জন্য আপনার সঠিক মোবাইল নম্বরটি দিন');
        return;
      }
    }

    onConfirm(numAmount, txId, senderNum);
  };

  const currentQuickAmounts = type === 'withdraw' ? withdrawAmounts : depositQuickAmounts;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity p-4 sm:p-6">
      <div className="bg-white w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl transition-all animate-in zoom-in-95 duration-300 max-h-[95vh] flex flex-col border border-white/20">
        
        {/* Header - Sticky Top */}
        <div className={`p-5 text-white flex justify-between items-center shrink-0 ${type === 'deposit' ? 'bg-blue-600' : 'bg-orange-500'}`}>
          <div className="flex items-center space-x-3">
             {type === 'deposit' ? <ArrowUpCircle className="w-6 h-6" /> : <ArrowDownCircle className="w-6 h-6" />}
             <h3 className="text-lg font-black tracking-tight">
               {type === 'withdraw' ? 'উইথড্র রিকোয়েস্ট' : 'ডিপোজিট ফরম'}
             </h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content - flex-1 and overflow-y-auto ensures footer stays fixed */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 space-y-8 bg-gray-50/30">
          
          {/* Admin Payment Numbers Section for Deposit */}
          {type === 'deposit' && adminSettings && (
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">আমাদের পেমেন্ট নম্বরসমূহ (নিচে দেখুন)</label>
              <div className="grid gap-3">
                {[
                  { name: 'bKash', num: adminSettings.bkash_number, color: 'text-pink-600', bg: 'bg-pink-50' },
                  { name: 'Nagad', num: adminSettings.nagad_number, color: 'text-orange-600', bg: 'bg-orange-50' },
                  { name: 'Rocket', num: adminSettings.rocket_number, color: 'text-purple-600', bg: 'bg-purple-50' }
                ].map((item) => (
                  <div key={item.name} className={`${item.bg} p-4 rounded-2xl border border-white flex justify-between items-center group shadow-sm`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black ${item.color} shadow-sm`}>
                        {item.name[0]}
                      </div>
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest opacity-60`}>{item.name}</p>
                        <p className="font-black text-gray-800 tracking-wider text-sm">{item.num}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleCopy(item.num, item.name)}
                      className={`p-2.5 rounded-xl transition-all ${copiedKey === item.name ? 'bg-green-500 text-white' : 'bg-white text-gray-400 hover:text-gray-900 shadow-sm'}`}
                    >
                      {copiedKey === item.name ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Amount Selection Section */}
          <div className="space-y-4 text-center">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
              {type === 'withdraw' ? 'উইথড্র অ্যামাউন্ট' : 'ডিপোজিট অ্যামাউন্ট'}
            </label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-gray-300">৳</span>
              <input 
                type="number" 
                readOnly={type === 'withdraw'}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className={`w-full pl-14 pr-6 py-5 text-4xl font-black text-gray-800 bg-white border-2 border-gray-100 focus:border-${type === 'deposit' ? 'blue' : 'orange'}-500 focus:ring-4 focus:ring-${type === 'deposit' ? 'blue' : 'orange'}-50 outline-none rounded-3xl transition-all text-center placeholder:text-gray-200 shadow-inner ${type === 'withdraw' ? 'cursor-default' : ''}`}
                autoFocus={type === 'deposit'}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {currentQuickAmounts.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val.toString())}
                  className={`py-3.5 px-2 rounded-2xl font-black transition-all text-xs border ${
                    amount === val.toString() 
                      ? (type === 'deposit' ? 'bg-blue-600 text-white border-blue-600 shadow-blue-100' : 'bg-orange-500 text-white border-orange-500 shadow-orange-100') + ' shadow-lg scale-[1.03]'
                      : 'bg-white text-gray-700 border-gray-100 hover:border-gray-200 shadow-sm'
                  }`}
                >
                  ৳{val}
                </button>
              ))}
            </div>
          </div>

          {/* Verification Fields */}
          <div className="space-y-5">
             <div className={`${type === 'deposit' ? 'bg-blue-50/50' : 'bg-orange-50/50'} p-4 rounded-2xl flex items-start space-x-3 border ${type === 'deposit' ? 'border-blue-100' : 'border-orange-100'}`}>
                <AlertCircle className={`w-5 h-5 ${type === 'deposit' ? 'text-blue-500' : 'text-orange-500'} shrink-0 mt-0.5`} />
                <p className={`text-[11px] ${type === 'deposit' ? 'text-blue-800' : 'text-orange-800'} font-bold leading-relaxed`}>
                  {type === 'deposit' 
                    ? 'উপরে দেওয়া নাম্বারে পেমেন্ট করার পর আপনার ব্যবহৃত নম্বর এবং ট্রানজেকশন আইডি দিন।'
                    : 'আপনার পেমেন্ট রিসিভ করার নম্বরটি নিচে দিন। রিকোয়েস্ট ১-১২ ঘণ্টায় প্রসেস হবে।'}
                </p>
             </div>

             <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    {type === 'deposit' ? 'আপনার পেমেন্ট নম্বর' : 'আপনার উইথড্রাল নম্বর'}
                  </label>
                  <div className="relative">
                     <Smartphone className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${senderNum ? (type === 'deposit' ? 'text-blue-500' : 'text-orange-500') : 'text-gray-400'}`} />
                     <input 
                       type="tel" 
                       placeholder="01XXXXXXXXX"
                       value={senderNum}
                       onChange={(e) => setSenderNum(e.target.value.replace(/\D/g, '').slice(0, 11))}
                       className={`w-full pl-12 pr-4 py-4 bg-white rounded-2xl font-black text-gray-800 border-2 border-gray-100 focus:border-${type === 'deposit' ? 'blue' : 'orange'}-200 focus:ring-4 focus:ring-${type === 'deposit' ? 'blue' : 'orange'}-50 outline-none transition-all shadow-sm`}
                     />
                  </div>
                </div>

                {type === 'deposit' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">ট্রানজেকশন আইডি (TrxID)</label>
                    <div className="relative">
                       <Hash className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${txId ? 'text-blue-500' : 'text-gray-400'}`} />
                       <input 
                         type="text" 
                         placeholder="AB12CD34"
                         value={txId}
                         onChange={(e) => setTxId(e.target.value.toUpperCase())}
                         className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl font-black text-gray-800 border-2 border-gray-100 focus:border-blue-200 focus:ring-4 focus:ring-blue-50 shadow-sm outline-none transition-all uppercase"
                       />
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Footer - Sticky Bottom */}
        <div className="p-6 sm:p-8 bg-white border-t border-gray-50 shrink-0">
           <button 
             onClick={() => handleSubmit()}
             className={`w-full py-5 rounded-[1.5rem] font-black text-white text-lg shadow-xl transition-all transform active:scale-95 flex items-center justify-center space-x-2 ${
               type === 'deposit' ? 'bg-blue-600 shadow-blue-200' : 'bg-orange-500 shadow-orange-200'
             }`}
           >
             <CheckCircle2 className="w-6 h-6" />
             <span className="tracking-tight">{type === 'withdraw' ? 'রিকোয়েস্ট পাঠান' : 'ডিপোজিট সাবমিট করুন'}</span>
           </button>
           <p className="text-center text-[10px] text-gray-400 font-black mt-4 uppercase tracking-tighter">
            {type === 'withdraw' 
              ? 'নিরাপদ গেটওয়ের মাধ্যমে পেমেন্ট প্রসেস করা হবে'
              : 'ভুল তথ্য দিলে রিকোয়েস্ট রিজেক্ট করা হবে'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
