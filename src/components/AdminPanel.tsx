import React, { useState, useEffect } from 'react';
import { 
  Users, Clock, Settings, CheckCircle, XCircle, Plus, Smartphone, 
  Send, Youtube, Facebook, MessageCircle, Share2, Search, Fingerprint, Copy, Hash, Palette, Image as ImageIcon, Save, CheckCheck, Link as LinkIcon, Loader2, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, RefreshCcw, Shield
} from 'lucide-react';
import { Profile, Transaction, AdminSettings } from '../types';

interface AdminPanelProps {
  profiles: Profile[];
  transactions: Transaction[];
  settings: AdminSettings;
  onAction: (txId: string, action: 'approve' | 'reject') => void;
  onBulkApproveDeposits: () => void;
  onAddBalance: (userId: string, amount: number, type: 'admin_add' | 'admin_deduct') => void;
  onUpdateSettings: (settings: AdminSettings) => Promise<boolean>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  profiles, transactions, settings, onAction, onBulkApproveDeposits, onAddBalance, onUpdateSettings 
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'stats' | 'requests' | 'users' | 'config'>('stats');
  const [searchQuery, setSearchQuery] = useState('');
  const [addAmount, setAddAmount] = useState<{[key: string]: string}>({});
  const [localSettings, setLocalSettings] = useState<AdminSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Statistics
  const totalUsers = profiles.length;
  const totalBalance = profiles.reduce((sum, p) => sum + Number(p.balance), 0);
  const pendingRequests = transactions.filter(t => t.status === 'pending');
  const depositRequests = pendingRequests.filter(t => t.type === 'deposit');
  const withdrawRequests = pendingRequests.filter(t => t.type === 'withdraw');

  const filteredProfiles = profiles.filter(p => 
    p.account_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone_number?.includes(searchQuery)
  );

  const handleSettingsChange = (key: keyof AdminSettings, value: string) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    const success = await onUpdateSettings(localSettings);
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 pb-20 max-w-lg mx-auto">
      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gray-900 rounded-3xl p-5 text-white shadow-xl border border-gray-800">
           <div className="flex justify-between items-start mb-2">
              <Users className="w-5 h-5 text-blue-400" />
              <TrendingUp className="w-4 h-4 text-green-400" />
           </div>
           <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Total Users</p>
           <h4 className="text-2xl font-black">{totalUsers}</h4>
        </div>
        <div className="bg-gray-900 rounded-3xl p-5 text-white shadow-xl border border-gray-800">
           <div className="flex justify-between items-start mb-2">
              <DollarSign className="w-5 h-5 text-yellow-400" />
              <ArrowUpRight className="w-4 h-4 text-green-400" />
           </div>
           <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Total Assets</p>
           <h4 className="text-2xl font-black">৳{Math.floor(totalBalance/1000)}k</h4>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex bg-white rounded-2xl p-2 shadow-sm border border-gray-100 mb-6 overflow-x-auto custom-scrollbar whitespace-nowrap">
        {[
          { id: 'stats', icon: TrendingUp, label: 'Stats' },
          { id: 'requests', icon: Clock, label: `Requests (${pendingRequests.length})` },
          { id: 'users', icon: Users, label: 'Management' },
          { id: 'config', icon: Settings, label: 'Config' }
        ].map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveSubTab(tab.id as any)} 
            className={`flex-1 min-w-[100px] py-3 rounded-xl font-bold flex items-center justify-center space-x-2 capitalize transition-all ${activeSubTab === tab.id ? 'bg-[#E2136E] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </div>

      {activeSubTab === 'stats' && (
        <div className="space-y-4 animate-in fade-in duration-500">
           <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
              <h3 className="font-black text-gray-800 mb-4 flex items-center space-x-2">
                <Shield className="w-5 h-5 text-[#E2136E]" />
                <span>Quick Actions</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => setActiveSubTab('requests')} className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-left group active:scale-95 transition-all">
                    <p className="text-blue-600 font-black text-xs uppercase mb-1">Pending Deposits</p>
                    <div className="flex justify-between items-end">
                       <span className="text-2xl font-black text-blue-900">{depositRequests.length}</span>
                       <ArrowUpRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                 </button>
                 <button onClick={() => setActiveSubTab('requests')} className="bg-orange-50 p-4 rounded-2xl border border-orange-100 text-left group active:scale-95 transition-all">
                    <p className="text-orange-600 font-black text-xs uppercase mb-1">Pending Withdraw</p>
                    <div className="flex justify-between items-end">
                       <span className="text-2xl font-black text-orange-900">{withdrawRequests.length}</span>
                       <ArrowDownRight className="w-5 h-5 text-orange-400 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
                    </div>
                 </button>
              </div>
           </div>

           <div className="bg-gray-900 rounded-[2rem] p-6 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <h3 className="font-black text-lg mb-6 flex items-center space-x-2">
                <RefreshCcw className="w-5 h-5 text-pink-400" />
                <span>Admin Quick Transfer</span>
              </h3>
              <div className="space-y-4">
                 <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                      type="text" 
                      placeholder="Account ID (e.g. BT100002)" 
                      className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-bold outline-none focus:border-pink-500 transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                 </div>
                 {searchQuery.length > 3 && filteredProfiles.slice(0, 1).map(user => (
                   <div key={user.id} className="bg-white/5 p-4 rounded-2xl border border-white/10 animate-in slide-in-from-top-2">
                      <div className="flex justify-between items-center mb-4">
                         <div>
                            <p className="font-black text-white">{user.account_id}</p>
                            <p className="text-xs text-gray-500">{user.phone_number}</p>
                         </div>
                         <p className="text-pink-400 font-black">৳{user.balance}</p>
                      </div>
                      <div className="flex space-x-2">
                         <input 
                            type="number" 
                            placeholder="Amount" 
                            className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-white font-black"
                            id="quick_amount"
                         />
                         <button 
                            onClick={() => {
                               const el = document.getElementById('quick_amount') as HTMLInputElement;
                               const val = parseFloat(el.value);
                               if (val > 0) onAddBalance(user.id, val, 'admin_add');
                               el.value = '';
                            }}
                            className="bg-pink-600 text-white px-6 py-2 rounded-xl font-black text-sm active:scale-95 transition-all"
                         >Transfer</button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {activeSubTab === 'requests' && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-lg font-black text-gray-800 flex items-center space-x-2">
               <Clock className="w-5 h-5 text-orange-500" />
               <span>Requests Log</span>
            </h3>
            {depositRequests.length > 1 && (
              <button 
                onClick={() => { if (confirm(`${depositRequests.length} deposits to approve?`)) onBulkApproveDeposits(); }} 
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-blue-100"
              >
                <CheckCheck className="w-4 h-4" /><span>Bulk Approve</span>
              </button>
            )}
          </div>
          {pendingRequests.length > 0 ? pendingRequests.map(tx => (
            <div key={tx.id} className="bg-white rounded-[1.8rem] p-6 shadow-sm border border-gray-100 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                   <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider ${tx.type === 'deposit' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                     {tx.type} Request
                   </span>
                   <div className="flex items-center space-x-2">
                      <Fingerprint className="w-4 h-4 text-gray-400" />
                      <h4 className="font-black text-gray-900 text-lg">{tx.account_id}</h4>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-2xl font-black text-gray-900 leading-none">৳{tx.amount}</p>
                   <p className="text-[10px] text-gray-400 font-bold mt-1">{new Date(tx.created_at).toLocaleTimeString()}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2 border border-gray-100 text-[11px]">
                <div className="flex justify-between">
                   <span className="text-gray-400 font-bold uppercase tracking-tighter">Sender Number:</span>
                   <span className="font-black text-gray-800">{tx.sender_number || 'N/A'}</span>
                </div>
                {tx.type === 'deposit' && (
                  <div className="flex justify-between">
                     <span className="text-gray-400 font-bold uppercase tracking-tighter">Transaction ID:</span>
                     <span className="font-black text-blue-600 uppercase">{tx.transaction_id || 'N/A'}</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 pt-2">
                <button 
                  onClick={() => onAction(tx.id, 'approve')} 
                  className="flex-1 bg-green-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-green-50 active:scale-95 transition-all flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="w-5 h-5" /><span>Approve</span>
                </button>
                <button 
                  onClick={() => onAction(tx.id, 'reject')} 
                  className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-red-50 active:scale-95 transition-all flex items-center justify-center space-x-2"
                >
                  <XCircle className="w-5 h-5" /><span>Reject</span>
                </button>
              </div>
            </div>
          )) : (
            <div className="p-20 text-center space-y-4 bg-white rounded-[2rem]">
               <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                  <CheckCheck className="w-8 h-8" />
               </div>
               <p className="text-gray-400 font-bold">All caught up! No requests.</p>
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'users' && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
          <div className="relative px-2">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Find User by ID or Phone..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-[1.5rem] outline-none focus:ring-4 ring-[#E2136E]/5 text-sm font-bold shadow-sm" 
            />
          </div>

          <div className="space-y-3">
             {filteredProfiles.map(user => (
               <div key={user.id} className="bg-white rounded-[1.8rem] p-6 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                     <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-[#E2136E]">
                           <Fingerprint className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="font-black text-gray-900 flex items-center space-x-2">
                             <span>{user.account_id}</span>
                             {user.is_admin && <Shield className="w-3 h-3 text-blue-500" />}
                           </p>
                           <p className="text-xs text-gray-400 font-bold">{user.phone_number}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-lg font-black text-[#E2136E]">৳{Number(user.balance).toLocaleString()}</p>
                        <p className="text-[8px] text-gray-400 uppercase tracking-widest font-black">Current Balance</p>
                     </div>
                  </div>

                  <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                    <input 
                      type="number" 
                      placeholder="Amt" 
                      value={addAmount[user.id] || ''} 
                      onChange={(e) => setAddAmount({...addAmount, [user.id]: e.target.value})} 
                      className="flex-1 px-4 py-2.5 bg-white rounded-xl text-sm font-black outline-none border border-transparent focus:border-pink-200" 
                    />
                    <div className="flex space-x-1">
                       <button 
                         onClick={() => { 
                           const amt = parseFloat(addAmount[user.id]); 
                           if (amt > 0) { onAddBalance(user.id, amt, 'admin_add'); setAddAmount({...addAmount, [user.id]: ''}); } 
                         }} 
                         className="bg-gray-900 text-white px-3 py-2.5 rounded-xl font-black text-[10px] uppercase active:scale-95"
                       >Add</button>
                       <button 
                         onClick={() => { 
                           const amt = parseFloat(addAmount[user.id]); 
                           if (amt > 0) { onAddBalance(user.id, amt, 'admin_deduct'); setAddAmount({...addAmount, [user.id]: ''}); } 
                         }} 
                         className="bg-red-500 text-white px-3 py-2.5 rounded-xl font-black text-[10px] uppercase active:scale-95"
                       >Deduct</button>
                    </div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      )}

      {activeSubTab === 'config' && (
        <div className="space-y-6 pb-20 animate-in slide-in-from-bottom-4 duration-500">
          <div className="sticky top-[80px] z-20 px-2 mb-2">
            <button 
              onClick={handleSaveSettings} 
              disabled={isSaving}
              className={`w-full py-4 ${isSaving ? 'bg-gray-400' : 'bg-[#E2136E]'} text-white rounded-2xl font-black shadow-xl shadow-pink-200 flex items-center justify-center space-x-2 hover:brightness-110 active:scale-95 transition-all`}
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              <span>{isSaving ? 'Saving Changes...' : 'Save All Changes'}</span>
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-black text-gray-800 px-2 flex items-center space-x-2"><Palette className="w-5 h-5 text-pink-600" /><span>General Appearance</span></h3>
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Portal Name</label>
                <input type="text" value={localSettings.app_name} onChange={(e) => handleSettingsChange('app_name', e.target.value)} className="w-full px-5 py-4 bg-gray-50 rounded-2xl font-black outline-none border border-transparent focus:border-pink-200" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Logo URL</label>
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border p-2">
                    <img src={localSettings.app_logo_url} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <input type="text" value={localSettings.app_logo_url} onChange={(e) => handleSettingsChange('app_logo_url', e.target.value)} className="flex-1 px-5 py-4 bg-gray-50 rounded-2xl font-black outline-none border border-transparent focus:border-pink-200 text-[10px]" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-black text-gray-800 px-2 flex items-center space-x-2"><Smartphone className="w-5 h-5 text-pink-600" /><span>Deposit Channels</span></h3>
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 space-y-6">
              {[
                { key: 'bkash_number', label: 'bKash Merchant' }, 
                { key: 'nagad_number', label: 'Nagad Business' }, 
                { key: 'rocket_number', label: 'Rocket Account' }
              ].map(item => (
                <div key={item.key} className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.label}</label>
                  <input type="text" value={localSettings[item.key as keyof AdminSettings]} onChange={(e) => handleSettingsChange(item.key as keyof AdminSettings, e.target.value)} className="w-full px-5 py-4 bg-gray-50 rounded-2xl font-black outline-none border border-transparent focus:border-pink-200" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-black text-gray-800 px-2 flex items-center space-x-2"><MessageCircle className="w-5 h-5 text-[#E2136E]" /><span>Support & Links</span></h3>
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 space-y-6">
              {['telegram_url', 'whatsapp_url', 'facebook_url', 'youtube_url', 'support_url', 'ad_link'].map(key => (
                <div key={key} className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 capitalize">{key.replace('_', ' ')}</label>
                  <input type="text" value={localSettings[key as keyof AdminSettings]} onChange={(e) => handleSettingsChange(key as keyof AdminSettings, e.target.value)} className="w-full px-5 py-4 bg-gray-50 rounded-2xl font-bold outline-none border border-transparent focus:border-pink-200 text-[10px]" />
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gray-900 rounded-[2rem] text-white flex items-start space-x-4">
             <Shield className="w-6 h-6 text-pink-400 shrink-0 mt-1" />
             <div className="space-y-1">
                <p className="text-xs font-black uppercase">Critical Security</p>
                <p className="text-[10px] text-gray-500 font-bold leading-relaxed">সেটিংস পরিবর্তন করার পর অবশ্যই 'Save All Changes' বাটনে ক্লিক করবেন। অন্যথায় ইউজাররা নতুন তথ্য দেখতে পাবে না।</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
