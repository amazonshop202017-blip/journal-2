import { Trade, TradingStats } from '../types/trade';
import { format, parse, differenceInMinutes } from 'date-fns';

export const calculateStats = (trades: Trade[]): TradingStats => {
  const tradeTrades = trades.filter(t => t.type === 'Trade');
  
  const wins = tradeTrades.filter(t => t.status === 'Win');
  const losses = tradeTrades.filter(t => t.status === 'Loss');
  const breakevens = tradeTrades.filter(t => t.status === 'Breakeven');
  const open = tradeTrades.filter(t => t.status === 'Open');
  const longTrades = tradeTrades.filter(t => t.direction === 'Long');
  const shortTrades = tradeTrades.filter(t => t.direction === 'Short');

  const winRate = tradeTrades.length > 0 ? (wins.length / tradeTrades.length) * 100 : 0;
  const avgWin = wins.length > 0 ? wins.reduce((sum, t) => sum + t.gainLoss, 0) / wins.length : 0;
  const largestWin = wins.length > 0 ? Math.max(...wins.map(t => t.gainLoss)) : 0;
  const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((sum, t) => sum + t.gainLoss, 0) / losses.length) : 0;
  const largestLoss = losses.length > 0 ? Math.abs(Math.min(...losses.map(t => t.gainLoss))) : 0;
  const totalPL = tradeTrades.reduce((sum, t) => sum + t.gainLoss - t.fees, 0);
  const avgPL = tradeTrades.length > 0 ? totalPL / tradeTrades.length : 0;

  return {
    totalTrades: tradeTrades.length,
    totalWins: wins.length,
    totalLosses: losses.length,
    totalBreakevens: breakevens.length,
    totalOpen: open.length,
    longTrades: longTrades.length,
    shortTrades: shortTrades.length,
    winRate,
    avgWin,
    largestWin,
    longestWinStreak: 1, // Simplified for now
    avgLoss,
    largestLoss,
    longestLoseStreak: 1, // Simplified for now
    maxDrawdown: -0.01, // Simplified for now
    avgTimeInTrades: '0:18:00', // Simplified for now
    totalPL,
    avgPL
  };
};

export const getAccountBalance = (trades: Trade[]): number => {
  const startingBalance = 100000;
  const deposits = trades.filter(t => t.type === 'Deposit').reduce((sum, t) => sum + t.gainLoss, 0);
  const withdrawals = trades.filter(t => t.type === 'Withdrawal').reduce((sum, t) => sum + Math.abs(t.gainLoss), 0);
  const tradingPL = trades.filter(t => t.type === 'Trade').reduce((sum, t) => sum + t.gainLoss - t.fees, 0);
  
  return startingBalance + deposits - withdrawals + tradingPL;
};

export const getMonthlyPL = (trades: Trade[]) => {
  const monthlyData: { [key: string]: { gain: number; loss: number } } = {};
  
  trades.filter(t => t.type === 'Trade').forEach(trade => {
    const month = format(new Date(trade.date), 'MMM yyyy');
    if (!monthlyData[month]) {
      monthlyData[month] = { gain: 0, loss: 0 };
    }
    
    if (trade.gainLoss > 0) {
      monthlyData[month].gain += trade.gainLoss;
    } else {
      monthlyData[month].loss += Math.abs(trade.gainLoss);
    }
  });
  
  return monthlyData;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};