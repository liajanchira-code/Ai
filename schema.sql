
-- ১. ফ্রেশ সেটআপ: পুরনো সব টেবিল ডিলিট করা
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.investments CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.admin_settings CASCADE;

-- ২. এডমিন সেটিংস টেবিল (সবকিছু ডায়নামিক করার জন্য)
CREATE TABLE public.admin_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  app_name TEXT DEFAULT 'brac_trading',
  app_logo_url TEXT DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/BRAC_logo.svg/2560px-BRAC_logo.svg.png',
  bkash_number TEXT DEFAULT '017XXXXXXXX',
  nagad_number TEXT DEFAULT '018XXXXXXXX',
  rocket_number TEXT DEFAULT '019XXXXXXXX',
  telegram_url TEXT DEFAULT 'https://t.me/brac_trading',
  whatsapp_url TEXT DEFAULT 'https://wa.me/8801700000000',
  facebook_url TEXT DEFAULT 'https://facebook.com/brac_trading',
  youtube_url TEXT DEFAULT 'https://youtube.com/brac_trading',
  support_url TEXT DEFAULT 'https://t.me/brac_support',
  ad_link TEXT DEFAULT 'https://www.effectivegatecpm.com/xj6a9820rg?key=9bdf36a5c7b56f1adfda193802389022'
);

-- ৩. প্রোফাইল টেবিল
CREATE TABLE public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id TEXT UNIQUE NOT NULL,
  phone_number TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT,
  balance NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  wallet_provider TEXT CHECK (wallet_provider IN ('bKash', 'Nagad', 'Rocket')),
  wallet_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ৪. ইনভেস্টমেন্ট টেবিল
CREATE TABLE public.investments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan_amount NUMERIC(15, 2) NOT NULL,
  daily_return NUMERIC(15, 2) NOT NULL,
  total_days INTEGER DEFAULT 45 NOT NULL,
  days_passed INTEGER DEFAULT 0 NOT NULL,
  last_claim_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

-- ৫. ট্রানজেকশন টেবিল
CREATE TABLE public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  account_id TEXT NOT NULL,
  type TEXT CHECK (type IN ('deposit', 'withdraw', 'claim', 'admin_add', 'admin_deduct')) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'completed', 'rejected')) DEFAULT 'pending' NOT NULL,
  amount NUMERIC(15, 2) NOT NULL,
  transaction_id TEXT,
  sender_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ৬. RLS ডিজেবল করা (সহজ ডেভেলপমেন্টের জন্য)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- ৭. আপনার দেওয়া নির্দিষ্ট এডমিন ইউজার তৈরি
-- ফোন নম্বর: 01923284765, পাসওয়ার্ড: 1311UX
INSERT INTO public.profiles (account_id, phone_number, password, balance, is_admin) 
VALUES ('BT100001', '01923284765', '1311UX', 50000.00, TRUE);

-- ডিফল্ট সেটিংস ইনসার্ট করা
INSERT INTO public.admin_settings (id, app_name) 
VALUES (1, 'brac_trading') 
ON CONFLICT (id) DO NOTHING;
