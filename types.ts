
export interface Profile {
  id: string;
  account_id: string;
  phone_number: string;
  email: string;
  balance: number;
  is_admin: boolean;
  wallet_provider?: 'bKash' | 'Nagad' | 'Rocket';
  wallet_number?: string;
  created_at: string;
}

export interface Investment {
  id: string;
  user_id: string;
  plan_amount: number;
  daily_return: number;
  total_days: number;
  days_passed: number;
  last_claim_at: string | null;
  created_at: string;
  is_active: boolean;
}

export interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  type: 'deposit' | 'withdraw' | 'claim' | 'admin_add' | 'admin_deduct';
  status: 'pending' | 'completed' | 'rejected';
  amount: number;
  created_at: string;
  transaction_id?: string;
  sender_number?: string;
}

export interface InvestmentPlan {
  amount: number;
  dailyReturn: number;
  totalReturn: number;
  validity: number;
}

export interface AdminSettings {
  app_name: string;
  app_logo_url: string;
  bkash_number: string;
  nagad_number: string;
  rocket_number: string;
  telegram_url: string;
  whatsapp_url: string;
  facebook_url: string;
  youtube_url: string;
  support_url: string;
  ad_link: string;
}
