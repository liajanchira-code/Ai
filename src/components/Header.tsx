import React from 'react';
import { Bell, Search } from 'lucide-react';

interface HeaderProps {
  appName?: string;
  appLogo?: string;
}

const Header: React.FC<HeaderProps> = ({ appName = 'brac_trading', appLogo }) => {
  return (
    <header className="bg-[#E2136E] text-white px-4 py-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-lg mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-inner overflow-hidden p-1">
             <img 
               src={appLogo || "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/BRAC_logo.svg/2560px-BRAC_logo.svg.png"} 
               alt="BRAC Logo" 
               className="w-full h-full object-contain"
             />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-black text-lg leading-tight tracking-tight uppercase">{appName}</h1>
              <div className="flex items-center space-x-1 bg-white/20 px-1.5 py-0.5 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-[8px] font-black uppercase tracking-tighter">Live Sync</span>
              </div>
            </div>
            <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Premium Earning Portal</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-[#E2136E]"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
