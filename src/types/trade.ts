export interface Trade {
  id: string;
  account: string;
  type: 'Trade' | 'Deposit' | 'Withdrawal';
  date: string;
  strategy: string;
  pair: string;
  direction: 'Long' | 'Short' | '';
  lotSize: number;
  leverage: number;
  riskRatio: number;
  entryTime: string;
  entryPoint: number;
  takeProfit: number;
  stopLoss: number;
  exitDate: string;
  exitTime: string;
  exitPoint: number;
  duration: string;
  status: 'Win' | 'Loss' | 'Breakeven' | 'Open' | '';
  fees: number;
  gainLoss: number;
  notes: string;
}

export interface TradingStats {
  totalTrades: number;
  totalWins: number;
  totalLosses: number;
  totalBreakevens: number;
  totalOpen: number;
  longTrades: number;
  shortTrades: number;
  winRate: number;
  avgWin: number;
  largestWin: number;
  longestWinStreak: number;
  avgLoss: number;
  largestLoss: number;
  longestLoseStreak: number;
  maxDrawdown: number;
  avgTimeInTrades: string;
  totalPL: number;
  avgPL: number;
}

export interface AppSettings {
  currency: string;
  accounts: string[];
  markets: string[];
  strategies: string[];
}

export interface DateRange {
  startDate: string;
  endDate: string;
}