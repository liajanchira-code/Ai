import { InvestmentPlan } from '../types';

export const INVESTMENT_PLANS: InvestmentPlan[] = [
  { amount: 300, dailyReturn: 60, totalReturn: 2700, validity: 45 },
  { amount: 500, dailyReturn: 100, totalReturn: 4500, validity: 45 },
  { amount: 700, dailyReturn: 140, totalReturn: 6300, validity: 45 },
  { amount: 1000, dailyReturn: 200, totalReturn: 9000, validity: 45 },
  { amount: 1200, dailyReturn: 240, totalReturn: 10800, validity: 45 },
  { amount: 1500, dailyReturn: 300, totalReturn: 13500, validity: 45 },
  { amount: 2000, dailyReturn: 400, totalReturn: 18000, validity: 45 },
];

export const COLORS = {
  PINK: '#E2136E',
  LIGHT_PINK: '#fdf2f8',
  DARK_PINK: '#B00E56',
  GRADIENT: 'linear-gradient(135deg, #E2136E 0%, #B00E56 100%)',
};
