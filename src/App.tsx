import React, { useState, useEffect, useCallback } from 'react';
import { 
  History, User, Home, MessageCircle, LayoutDashboard, 
  Zap, Settings, Lock, Send, Youtube, Facebook, Headphones, LogOut, CheckCircle, Volume2, ShieldCheck, CreditCard, Loader2, Play, ArrowUpCircle, ArrowDownCircle, AlertTriangle, Key, ExternalLink, MousePointer2, Info,
  TrendingUp, Calendar, Smartphone
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { supabase, isSupabaseConfiguredCorrectly } from './lib/supabase';
import Header from './components/Header';
import BalanceCard from './components/BalanceCard';
import ActionButtons from './components/ActionButtons';
import InvestmentCard from './components/InvestmentCard';
import AIAssistant from './components/AIAssistant';
import TransactionModal from './components/TransactionModal';
import WalletSetupModal from './components/WalletSetupModal';
import ActivationModal from './components/ActivationModal';
import AdminPanel from './components/AdminPanel';
import AuthScreen from './components/AuthScreen';
import { INVESTMENT_PLANS } from './components/constants';
import { Profile, Investment, Transaction, InvestmentPlan, AdminSettings } from './types';

const App: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [adminSettings, setAdminSettings] = useState<AdminSettings | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'invest' | 'history' | 'profile' | 'admin'>('home');
  
  // Modals
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isActivationOpen, setIsActivationOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);

  const fetchInitialData = useCallback(async (userId?: string) => {
    try {
      const { data: settingsData } = await supabase.from('admin_settings').select('*').eq('id', 1).maybeSingle();
      if (settingsData) setAdminSettings(settingsData);
      
      const targetUserId = userId || profile?.id;
      if (!targetUserId) return;
      
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', targetUserId).maybeSingle();
      if (profileData) setProfile(profileData);

      const { data: investData } = await supabase.from('investments').select('*').eq('user_id', targetUserId).eq('is_active', true);
      if (investData) setInvestments(investData);

      const { data: txData } = await supabase.from('transactions').select('*').eq('user_id', targetUserId).order('created_at', { ascending: false });
      if (txData) setTransactions(txData);

      // Admin Data Sync - গুরুত্বপূর্ণ: শুধু এডমিন হলেই সব ডাটা ফেচ হবে
      if (profileData?.is_admin) {
         const { data: allProfiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
         const { data: allTxs } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
         if (allProfiles) setProfiles(allProfiles);
         if (allTxs) setTransactions(allTxs);
      }
    } catch (err) {
      console.error("Sync Error:", err);
    }
  }, [profile?.id]);

  useEffect(() => {
    const init = async () => {
      if (!isSupabaseConfiguredCorrectly) {
        setInitError("key_error");
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      fetchInitialData();
    };
    init();
  }, [fetchInitialData]);

  const handleClaim = async (investment: Investment) => {
    if (!profile) return;
    try {
      const { error: invError } = await supabase.from('investments').update({
        last_claim_at: new Date().toISOString(),
        days_passed: investment.days_passed + 1,
        is_active: (investment.days_passed + 1) < investment.total_days
      }).eq('id', investment.id);

      if (invError) throw invError;

      const { error: balError } = await supabase.from('profiles').update({
        balance: Number(profile.balance) + Number(investment.daily_return)
      }).eq('id', profile.id);

      if (balError) throw balError;

      await supabase.from('transactions').insert({
        user_id: profile.id,
        account_id: profile.account_id,
        type: 'claim',
        status: 'completed',
        amount: investment.daily_return
      });

      alert('সফলভাবে ৳' + investment.daily_return + ' যুক্ত হয়েছে!');
      fetchInitialData();
      
      if (adminSettings?.ad_link) window.open(adminSettings.ad_link, '_blank');
    } catch (err) {
      alert('ক্লেম করতে সমস্যা হয়েছে।');
    }
  };

  const handleDeposit = async (amount: number, txId?: string, senderNum?: string) => {
    if (!profile) return;
    try {
      const { error } = await supabase.from('transactions').insert({
        user_id: profile.id,
        account_id: profile.account_id,
        type: 'deposit',
        status: 'pending',
        amount: amount,
        transaction_id: txId,
        sender_number: senderNum
      });
      if (error) throw error;
      alert('ডিপোজিট রিকোয়েস্ট সফল হয়েছে। এডমিন চেক করে ব্যালেন্স যোগ করবেন।');
      setIsDepositOpen(false);
      fetchInitialData();
    } catch (err) {
      alert('Error submitting deposit');
    }
  };

  const handleWithdraw = async (amount: number, txId?: string, senderNum?: string) => {
    if (!profile || profile.balance < amount) {
      alert('পর্যাপ্ত ব্যালেন্স নেই!');
      return;
    }
    try {
      const { error } = await supabase.from('transactions').insert({
        user_id: profile.id,
        account_id: profile.account_id,
        type: 'withdraw',
        status: 'pending',
        amount: amount,
        sender_number: senderNum
      });
      if (error) throw error;
      
      // Withdraw হলে সাথে সাথে ব্যালেন্স কেটে রাখা হয়
      await supabase.from('profiles').update({ balance: Number(profile.balance) - amount }).eq('id', profile.id);
      
      alert('উইথড্র রিকোয়েস্ট পাঠানো হয়েছে।');
      setIsWithdrawOpen(false);
      fetchInitialData();
    } catch (err) {
      alert('Error submitting withdrawal');
    }
  };

  const handleActivatePlan = async () => {
    if (!profile || !selectedPlan) return;
    if (profile.balance < selectedPlan.amount) {
      alert('পর্যাপ্ত ব্যালেন্স নেই!');
      return;
    }

    try {
      const { error: invError } = await supabase.from('investments').insert({
        user_id: profile.id,
        plan_amount: selectedPlan.amount,
        daily_return: selectedPlan.dailyReturn,
        total_days: selectedPlan.validity
      });
      if (invError) throw invError;

      await supabase.from('profiles').update({ balance: Number(profile.balance) - selectedPlan.amount }).eq('id', profile.id);

      alert('অফারটি সফলভাবে চালু হয়েছে!');
      setIsActivationOpen(false);
      fetchInitialData();
      
      if (adminSettings?.ad_link) window.open(adminSettings.ad_link, '_blank');
    } catch (err) {
      alert('অ্যাক্টিভেশন ফেইল হয়েছে।');
    }
  };

  // --- Admin Methods ---
  const handleAdminAction = async (txId: string, action: 'approve' | 'reject') => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx) return;

    try {
       if (action === 'approve') {
          if (tx.type === 'deposit') {
             const { data: user } = await supabase.from('profiles').select('balance').eq('id', tx.user_id).single();
             if (user) {
                await supabase.from('profiles').update({ balance: Number(user.balance) + Number(tx.amount) }).eq('id', tx.user_id);
             }
          }
          await supabase.from('transactions').update({ status: 'completed' }).eq('id', txId);
       } else {
          if (tx.type === 'withdraw') {
             const { data: user } = await supabase.from('profiles').select('balance').eq('id', tx.user_id).single();
             if (user) {
                await supabase.from('profiles').update({ balance: Number(user.balance) + Number(tx.amount) }).eq('id', tx.user_id);
             }
          }
          await supabase.from('transactions').update({ status: 'rejected' }).eq('id', txId);
       }
       alert(`Request ${action === 'approve' ? 'Approved' : 'Rejected'}!`);
       fetchInitialData();
    } catch (err) {
       console.error("Admin Action Error:", err);
    }
  };

  const handleAdminBalanceTransfer = async (userId: string, amount: number, type: 'admin_add' | 'admin_deduct') => {
    try {
      const { data: user } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (!user) return;

      const newBalance = type === 'admin_add' ? Number(user.balance) + amount : Number(user.balance) - amount;
      
      await supabase.from('profiles').update({ balance: newBalance }).eq('id', userId);
      await supabase.from('transactions').insert({
        user_id: userId,
        account_id: user.account_id,
        type: type,
        status: 'completed',
        amount: amount
      });
      
      alert(`Success! ৳${amount} ${type === 'admin_add' ? 'Added to' : 'Deducted from'} ${user.account_id}`);
      fetchInitialData();
    } catch (err) {
      alert('Failed to process transfer');
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="w-12 h-12 text-[#E2136E] animate-spin" />
      <p className="mt-4 font-black text-[#E2136E] uppercase tracking-widest text-[10px]">Secure BRAC Portal Loading...</p>
    </div>
  );

  if (!profile) return <AuthScreen onAuthSuccess={(p) => setProfile(p)} adminSettings={adminSettings} />;

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-32">
      <Header appName={adminSettings?.app_name} appLogo={adminSettings?.app_logo_url} />
      
      <main className="max-w-lg mx-auto p-4 space-y-6">
        {activeTab === 'home' && (
          <>
            <BalanceCard balance={profile.balance} accountId={profile.account_id} />
            <ActionButtons 
              onDeposit={() => setIsDepositOpen(true)} 
              onWithdraw={() => setIsWithdrawOpen(true)} 
            />
            
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black text-gray-800 flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span>আপনার সক্রিয় বুথসমূহ</span>
                  </h3>
                  <span className="text-[10px] font-black bg-pink-50 text-[#E2136E] px-2 py-1 rounded-full">{investments.length} Active</span>
               </div>
               
               <div className="space-y-6">
                 {investments.length > 0 ? investments.map(inv => (
                   <InvestmentCard 
                     key={inv.id} 
                     investment={inv} 
                     onClaim={() => handleClaim(inv)} 
                     isActive={true} 
                   />
                 )) : (
                   <div className="text-center py-10 space-y-3">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                        <Play className="w-8 h-8" />
                      </div>
                      <p className="text-sm font-bold text-gray-400">এখনো কোনো ইনভেস্টমেন্ট শুরু করেননি!</p>
                      <button 
                        onClick={() => setActiveTab('invest')}
                        className="text-[#E2136E] text-xs font-black uppercase tracking-widest underline"
                      >
                        নতুন অফার দেখুন
                      </button>
                   </div>
                 )}
               </div>
            </div>
            
            <AIAssistant />
          </>
        )}

        {activeTab === 'invest' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
             <div className="text-center space-y-1 py-4">
                <h2 className="text-2xl font-black text-gray-900">প্রিমিয়াম অফারসমূহ</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">আজই শুরু করুন আপনার উপার্জনের যাত্রা</p>
             </div>
             
             <div className="grid gap-4">
                {INVESTMENT_PLANS.map((plan, idx) => (
                  <div 
                    key={idx}
                    onClick={() => { setSelectedPlan(plan); setIsActivationOpen(true); }}
                    className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex justify-between items-center group active:scale-95 transition-all cursor-pointer hover:border-pink-200"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-pink-50 rounded-xl flex items-center justify-center text-[#E2136E]">
                           <Zap className="w-5 h-5 fill-current" />
                        </div>
                        <h4 className="font-black text-gray-900 text-lg">৳{plan.amount} প্ল্যান</h4>
                      </div>
                      <div className="flex space-x-4 text-[10px] font-black uppercase text-gray-400 tracking-tighter">
                         <span className="flex items-center"><TrendingUp className="w-3 h-3 mr-1 text-green-500" /> দৈনিক ৳{plan.dailyReturn}</span>
                         <span className="flex items-center"><Calendar className="w-3 h-3 mr-1 text-blue-500" /> {plan.validity} দিন</span>
                      </div>
                    </div>
                    <div className="bg-[#E2136E] text-white p-3 rounded-2xl shadow-lg shadow-pink-100 group-hover:scale-110 transition-transform">
                       <ArrowUpCircle className="w-6 h-6" />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'history' && (
           <div className="space-y-4 animate-in fade-in duration-500">
              <h3 className="text-lg font-black text-gray-800 px-2 flex items-center space-x-2">
                 <History className="w-5 h-5 text-gray-400" />
                 <span>লেনদেনের ইতিহাস</span>
              </h3>
              {transactions.length > 0 ? transactions.map(tx => (
                <div key={tx.id} className="bg-white rounded-2xl p-5 border border-gray-50 flex justify-between items-center">
                   <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${tx.type === 'deposit' || tx.type === 'claim' || tx.type === 'admin_add' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                         {tx.type === 'deposit' ? <ArrowUpCircle className="w-5 h-5" /> : 
                          tx.type === 'withdraw' ? <ArrowDownCircle className="w-5 h-5" /> : 
                          <CheckCircle className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-black text-gray-900 capitalize text-sm">{tx.type.replace('_', ' ')}</p>
                        <p className="text-[9px] text-gray-400 font-bold">{new Date(tx.created_at).toLocaleString()}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className={`font-black ${tx.type === 'deposit' || tx.type === 'claim' || tx.type === 'admin_add' ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.type === 'deposit' || tx.type === 'claim' || tx.type === 'admin_add' ? '+' : '-'}৳{tx.amount}
                      </p>
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                        tx.status === 'completed' ? 'bg-green-100 text-green-700' : 
                        tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-red-100 text-red-700'
                      }`}>{tx.status}</span>
                   </div>
                </div>
              )) : (
                <div className="text-center py-20 text-gray-300 font-bold">এখনো কোনো লেনদেন নেই</div>
              )}
           </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
             <div className="bg-[#E2136E] rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl"></div>
                <div className="flex flex-col items-center space-y-4">
                   <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-[#E2136E] shadow-xl text-3xl font-black p-4">
                      <img src={adminSettings?.app_logo_url} className="w-full h-full object-contain" />
                   </div>
                   <div className="text-center">
                      <h2 className="text-2xl font-black tracking-tight flex items-center justify-center space-x-2">
                        <span>{profile.account_id}</span>
                        {profile.is_admin && <ShieldCheck className="w-5 h-5 text-blue-300" />}
                      </h2>
                      <p className="text-sm font-bold opacity-70">{profile.phone_number}</p>
                   </div>
                </div>
             </div>
             
             <div className="grid gap-3">
                <button 
                  onClick={() => adminSettings?.support_url && window.open(adminSettings.support_url, '_blank')}
                  className="bg-white p-5 rounded-2xl flex justify-between items-center group hover:bg-gray-50 transition-all border border-gray-50"
                >
                   <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-50 text-blue-500 rounded-xl"><Smartphone className="w-5 h-5" /></div>
                      <span className="font-black text-gray-800">অফিসিয়াল টেলিগ্রাম</span>
                   </div>
                   <ExternalLink className="w-5 h-5 text-gray-300 group-hover:text-[#E2136E]" />
                </button>
                <button 
                  onClick={() => adminSettings?.whatsapp_url && window.open(adminSettings.whatsapp_url, '_blank')}
                  className="bg-white p-5 rounded-2xl flex justify-between items-center group hover:bg-gray-50 transition-all border border-gray-50"
                >
                   <div className="flex items-center space-x-4">
                      <div className="p-3 bg-green-50 text-green-500 rounded-xl"><Headphones className="w-5 h-5" /></div>
                      <span className="font-black text-gray-800">সরাসরি সাপোর্ট (WhatsApp)</span>
                   </div>
                   <ExternalLink className="w-5 h-5 text-gray-300 group-hover:text-[#E2136E]" />
                </button>
                
                {profile.is_admin && (
                  <button onClick={() => setActiveTab('admin')} className="bg-gray-900 p-5 rounded-2xl flex justify-between items-center group transition-all border border-gray-800 mt-4 shadow-xl active:scale-95">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-pink-500 text-white rounded-xl shadow-lg shadow-pink-500/20"><Settings className="w-5 h-5" /></div>
                        <span className="font-black text-white">এডমিন ড্যাশবোর্ড</span>
                    </div>
                    <ArrowUpCircle className="w-5 h-5 text-pink-400 rotate-90" />
                  </button>
                )}

                <button onClick={() => window.location.reload()} className="bg-white p-5 rounded-2xl flex justify-between items-center group hover:bg-red-50 transition-all border border-red-50 mt-4">
                   <div className="flex items-center space-x-4">
                      <div className="p-3 bg-red-50 text-red-500 rounded-xl"><LogOut className="w-5 h-5" /></div>
                      <span className="font-black text-red-600">লগ আউট করুন</span>
                   </div>
                </button>
             </div>
          </div>
        )}

        {activeTab === 'admin' && profile.is_admin && (
          <AdminPanel 
            profiles={profiles} 
            transactions={transactions} 
            settings={adminSettings!} 
            onAction={handleAdminAction}
            onBulkApproveDeposits={() => {}} 
            onAddBalance={handleAdminBalanceTransfer}
            onUpdateSettings={async (newSettings) => {
               const { error } = await supabase.from('admin_settings').update(newSettings).eq('id', 1);
               if (error) return false;
               fetchInitialData();
               return true;
            }}
          />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t px-8 py-4 flex justify-between items-center max-w-lg mx-auto rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-[100]">
        {[
          { id: 'home', icon: Home, label: 'হোম' },
          { id: 'invest', icon: Zap, label: 'অফার' },
          { id: 'history', icon: History, label: 'হিস্ট্রি' },
          { id: 'profile', icon: User, label: 'প্রোফাইল' }
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`flex flex-col items-center space-y-1 relative transition-all duration-300 ${activeTab === item.id ? 'text-[#E2136E] scale-110' : 'text-gray-400'}`}
          >
            <item.icon className={`w-6 h-6 ${activeTab === item.id ? 'fill-pink-50' : ''}`} />
            <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
            {activeTab === item.id && <div className="absolute -bottom-2 w-1.5 h-1.5 bg-[#E2136E] rounded-full"></div>}
          </button>
        ))}
      </nav>

      <TransactionModal 
        isOpen={isDepositOpen} 
        type="deposit" 
        onClose={() => setIsDepositOpen(false)} 
        onConfirm={handleDeposit} 
        adminSettings={adminSettings}
        userProfile={profile}
      />
      <TransactionModal 
        isOpen={isWithdrawOpen} 
        type="withdraw" 
        onClose={() => setIsWithdrawOpen(false)} 
        onConfirm={handleWithdraw} 
        adminSettings={adminSettings}
        userProfile={profile}
      />
      <ActivationModal 
        isOpen={isActivationOpen} 
        plan={selectedPlan} 
        userBalance={profile.balance} 
        onClose={() => setIsActivationOpen(false)} 
        onConfirm={handleActivatePlan}
        onDeposit={() => { setIsActivationOpen(false); setIsDepositOpen(true); }}
      />
    </div>
  );
};

export default App;
