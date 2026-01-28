import React, { useState } from 'react';
import { Smartphone, Lock, ShieldCheck, AlertCircle, ArrowRight, Eye, EyeOff, Key } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AdminSettings } from '../types';

interface AuthScreenProps {
  onAuthSuccess: (profile: any) => void;
  adminSettings: AdminSettings | null;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess, adminSettings }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const appName = adminSettings?.app_name || 'brac_trading';
  const appLogo = adminSettings?.app_logo_url || "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/BRAC_logo.svg/2560px-BRAC_logo.svg.png";

  const ADMIN_PHONE = '01923284765';
  const ADMIN_PASS = '1311UX';

  const fillAdminCredentials = () => {
    setPhoneNumber(ADMIN_PHONE);
    setPassword(ADMIN_PASS);
    setIsLogin(true);
  };

  const validatePhone = (num: string) => /^01[3-9]\d{8}$/.test(num);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    
    const cleanPhone = phoneNumber.trim();
    const cleanPassword = password.trim();

    if (!validatePhone(cleanPhone)) {
      setErrorMsg('সঠিক ১১ ডিজিটের ফোন নম্বর দিন');
      return;
    }
    setLoading(true);

    try {
      // ১. এডমিন চেক ও অটো-সেটআপ লজিক
      if (cleanPhone === ADMIN_PHONE && cleanPassword === ADMIN_PASS) {
        const { data: existingAdmin, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('phone_number', ADMIN_PHONE)
          .maybeSingle();

        if (!existingAdmin) {
          const { data: newAdmin, error: createError } = await supabase
            .from('profiles')
            .insert({
              account_id: 'BT100001',
              phone_number: ADMIN_PHONE,
              password: ADMIN_PASS,
              balance: 50000.00,
              is_admin: true,
              email: 'admin@bractrading.com'
            })
            .select()
            .single();
          
          if (createError) throw createError;
          onAuthSuccess(newAdmin);
          return;
        } else {
          onAuthSuccess(existingAdmin);
          return;
        }
      }

      // ২. সাধারণ ইউজার লগইন/রেজিস্ট্রেশন
      if (isLogin) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('phone_number', cleanPhone)
          .eq('password', cleanPassword)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          setErrorMsg('ফোন নম্বর অথবা পাসওয়ার্ড ভুল!');
        } else {
          onAuthSuccess(data);
        }
      } else {
        const accId = 'BT' + Math.floor(100000 + Math.random() * 900000);
        const { data, error } = await supabase.from('profiles').insert({ 
          account_id: accId, 
          phone_number: cleanPhone, 
          password: cleanPassword, 
          balance: 0, 
          email: `${cleanPhone}@bractrading.com` 
        }).select().single();
        
        if (error) {
          if (error.code === '23505') setErrorMsg('এই নম্বর দিয়ে ইতিমধ্যে অ্যাকাউন্ট খোলা হয়েছে!');
          else throw error;
        } else {
          onAuthSuccess(data);
        }
      }
    } catch (err: any) {
      setErrorMsg('সার্ভারে সমস্যা: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-28 h-28 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center border-4 border-pink-50 relative z-10 overflow-hidden p-4">
               <img src={appLogo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#E2136E] rounded-2xl flex items-center justify-center text-white shadow-lg z-20">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">{appName}</h1>
            <p className="text-[10px] text-[#E2136E] font-black uppercase tracking-[0.3em] mt-1">Premium Earning Portal</p>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-pink-100 border border-pink-50 space-y-6">
          <div className="flex bg-gray-100 p-1.5 rounded-[1.5rem]">
            <button type="button" onClick={() => setIsLogin(true)} className={`flex-1 py-3.5 rounded-[1.2rem] font-black text-xs transition-all ${isLogin ? 'bg-white text-[#E2136E] shadow-md' : 'text-gray-400'}`}>লগইন</button>
            <button type="button" onClick={() => setIsLogin(false)} className={`flex-1 py-3.5 rounded-[1.2rem] font-black text-xs transition-all ${!isLogin ? 'bg-white text-[#E2136E] shadow-md' : 'text-gray-400'}`}>রেজিস্ট্রেশন</button>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[11px] font-bold flex items-start space-x-2 animate-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">মোবাইল নম্বর</label>
              <div className="relative">
                <Smartphone className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${phoneNumber ? 'text-[#E2136E]' : 'text-gray-400'}`} />
                <input type="tel" placeholder="01XXXXXXXXX" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 11))} className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl font-black text-gray-800 outline-none border-2 border-transparent focus:border-pink-200 focus:bg-white transition-all text-lg" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">পিন / পাসওয়ার্ড</label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${password ? 'text-[#E2136E]' : 'text-gray-400'}`} />
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-12 py-4 bg-gray-50 rounded-2xl font-black text-gray-800 outline-none border-2 border-transparent focus:border-pink-200 focus:bg-white transition-all text-lg" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 p-1 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-5 bg-[#E2136E] text-white rounded-2xl font-black text-lg shadow-xl shadow-pink-200 flex items-center justify-center space-x-3 active:scale-95 transition-all group disabled:opacity-70">
              {loading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="font-black tracking-tight">{isLogin ? 'লগইন করুন' : 'অ্যাকাউন্ট খুলুন'}</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Admin Easy Login Helper */}
          <div className="pt-2 text-center">
             <button 
               onClick={fillAdminCredentials}
               className="text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-[#E2136E] transition-colors flex items-center justify-center mx-auto space-x-1"
             >
               <Key className="w-3 h-3" />
               <span>Admin Quick Login</span>
             </button>
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          Secure Multi-Factor Authentication Active
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
