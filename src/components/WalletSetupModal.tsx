
import React, { useState } from 'react';
import { X, Smartphone, CheckCircle2, ShieldCheck } from 'lucide-react';

interface WalletSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (provider: 'bKash' | 'Nagad' | 'Rocket', number: string) => void;
}

const WalletSetupModal: React.FC<WalletSetupModalProps> = ({ isOpen, onClose, onSave }) => {
  const [provider, setProvider] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [number, setNumber] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (number.length < 11) {
      alert('Please enter a valid mobile number');
      return;
    }
    onSave(provider, number);
  };

  const providers = [
    { name: 'bKash', color: 'bg-pink-500', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/BKash_Logo.svg' },
    { name: 'Nagad', color: 'bg-orange-500', logo: 'https://seeklogo.com/images/N/nagad-logo-7A70CC668E-seeklogo.com.png' },
    { name: 'Rocket', color: 'bg-purple-600', logo: 'https://seeklogo.com/images/D/dutch-bangla-rocket-logo-B4D1CC458D-seeklogo.com.png' },
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black text-gray-800">Set Wallet</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Select Provider</p>
            <div className="grid grid-cols-3 gap-3">
              {providers.map((p) => (
                <button
                  key={p.name}
                  onClick={() => setProvider(p.name as any)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                    provider === p.name ? 'border-[#E2136E] bg-pink-50' : 'border-gray-50 bg-gray-50'
                  }`}
                >
                  <img src={p.logo} alt={p.name} className="w-8 h-8 mb-2 object-contain" />
                  <span className={`text-[10px] font-bold ${provider === p.name ? 'text-[#E2136E]' : 'text-gray-400'}`}>
                    {p.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Wallet Number</p>
            <div className="relative">
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={number}
                onChange={(e) => setNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                placeholder="01XXXXXXXXX"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl font-bold text-gray-800 outline-none border-2 border-transparent focus:border-[#E2136E]/20 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-2xl flex items-start space-x-3 border border-green-100/50">
            <ShieldCheck className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-green-700 font-medium leading-relaxed">
              আপনার ওয়ালেটটি সুরক্ষিত রাখা হবে। উইথড্র করার সময় এই নম্বরেই টাকা পাঠানো হবে।
            </p>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-5 bg-[#E2136E] text-white rounded-full font-black shadow-lg shadow-pink-100 active:scale-95 transition-all flex items-center justify-center space-x-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Save Wallet Information</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletSetupModal;
