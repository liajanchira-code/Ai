import React from 'react';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Wallet, 
  Gift, 
  Smartphone,
  CreditCard
} from 'lucide-react';

interface ActionButtonsProps {
  onDeposit: () => void;
  onWithdraw: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onDeposit, onWithdraw }) => {
  const actions = [
    { label: 'Deposit', icon: ArrowUpCircle, color: 'text-blue-500', bg: 'bg-blue-50', onClick: onDeposit },
    { label: 'Withdraw', icon: ArrowDownCircle, color: 'text-orange-500', bg: 'bg-orange-50', onClick: onWithdraw },
    { label: 'Top-up', icon: Smartphone, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Cash Out', icon: Wallet, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Payment', icon: CreditCard, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Coupons', icon: Gift, color: 'text-pink-500', bg: 'bg-pink-50' },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {actions.map((action, idx) => (
        <button 
          key={idx}
          onClick={action.onClick}
          className="flex flex-col items-center space-y-2 group"
        >
          <div className={`p-4 rounded-2xl ${action.bg} ${action.color} group-hover:scale-110 transition-transform shadow-sm`}>
            <action.icon className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold text-gray-700">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;
