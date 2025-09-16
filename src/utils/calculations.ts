import { Trade, TradingStats } from '../types/trade';
import { format, parse, differenceInMinutes } from 'date-fns';

export const calculateStats = (trades: Trade[], dateRange?: { startDate: string; endDate: string }, selectedAccount?: string): TradingStats => {
  let filteredTrades = trades.filter(t => t.type === 'Trade');
  
  // Apply date filter
  if (dateRange && dateRange.startDate && dateRange.endDate) {
    filteredTrades = filteredTrades.filter(t => {
      const tradeDate = new Date(t.date);
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      return tradeDate >= start && tradeDate <= end;
    });
  }
  
  // Apply account filter
  if (selectedAccount && selectedAccount !== 'All') {
    filteredTrades = filteredTrades.filter(t => t.account === selectedAccount);
  }
  
  const wins = filteredTrades.filter(t => t.status === 'Win');
  const losses = filteredTrades.filter(t => t.status === 'Loss');
  const breakevens = filteredTrades.filter(t => t.status === 'Breakeven');
  const open = filteredTrades.filter(t => t.status === 'Open');
  const longTrades = filteredTrades.filter(t => t.direction === 'Long');
  const shortTrades = filteredTrades.filter(t => t.direction === 'Short');

  const winRate = filteredTrades.length > 0 ? (wins.length / filteredTrades.length) * 100 : 0;
  const avgWin = wins.length > 0 ? wins.reduce((sum, t) => sum + t.gainLoss, 0) / wins.length : 0;
  const largestWin = wins.length > 0 ? Math.max(...wins.map(t => t.gainLoss)) : 0;
  const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((sum, t) => sum + t.gainLoss, 0) / losses.length) : 0;
  const largestLoss = losses.length > 0 ? Math.abs(Math.min(...losses.map(t => t.gainLoss))) : 0;
  const totalPL = filteredTrades.reduce((sum, t) => sum + t.gainLoss - t.fees, 0);
  const avgPL = filteredTrades.length > 0 ? totalPL / filteredTrades.length : 0;

  return {
    totalTrades: filteredTrades.length,
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

export const getAccountBalance = (trades: Trade[], selectedAccount?: string): number => {
  const startingBalance = 100000;
  
  let filteredTrades = trades;
  if (selectedAccount && selectedAccount !== 'All') {
    filteredTrades = trades.filter(t => t.account === selectedAccount);
  }
  
  const deposits = filteredTrades.filter(t => t.type === 'Deposit').reduce((sum, t) => sum + t.gainLoss, 0);
  const withdrawals = filteredTrades.filter(t => t.type === 'Withdrawal').reduce((sum, t) => sum + Math.abs(t.gainLoss), 0);
  const tradingPL = filteredTrades.filter(t => t.type === 'Trade').reduce((sum, t) => sum + t.gainLoss - t.fees, 0);
  
  return startingBalance + deposits - withdrawals + tradingPL;
};

export const getMonthlyPL = (trades: Trade[], selectedAccount?: string) => {
  const monthlyData: { [key: string]: { gain: number; loss: number } } = {};
  
  let filteredTrades = trades.filter(t => t.type === 'Trade');
  if (selectedAccount && selectedAccount !== 'All') {
    filteredTrades = filteredTrades.filter(t => t.account === selectedAccount);
  }
  
  filteredTrades.forEach(trade => {
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

export const getStrategyBreakdown = (trades: Trade[], selectedAccount?: string) => {
  let filteredTrades = trades.filter(t => t.type === 'Trade');
  if (selectedAccount && selectedAccount !== 'All') {
    filteredTrades = filteredTrades.filter(t => t.account === selectedAccount);
  }
  
  const strategyData: { [key: string]: number } = {};
  filteredTrades.forEach(trade => {
    if (!strategyData[trade.strategy]) {
      strategyData[trade.strategy] = 0;
    }
    strategyData[trade.strategy] += trade.gainLoss - trade.fees;
  });
  
  return strategyData;
};

export const getPairBreakdown = (trades: Trade[], selectedAccount?: string) => {
  let filteredTrades = trades.filter(t => t.type === 'Trade');
  if (selectedAccount && selectedAccount !== 'All') {
    filteredTrades = filteredTrades.filter(t => t.account === selectedAccount);
  }
  
  const pairData: { [key: string]: number } = {};
  filteredTrades.forEach(trade => {
    if (!pairData[trade.pair]) {
      pairData[trade.pair] = 0;
    }
    pairData[trade.pair] += 1;
  });
  
  return pairData;
};

export const getMostUsedStrategy = (trades: Trade[], selectedAccount?: string): string => {
  let filteredTrades = trades.filter(t => t.type === 'Trade');
  if (selectedAccount && selectedAccount !== 'All') {
    filteredTrades = filteredTrades.filter(t => t.account === selectedAccount);
  }
  
  const strategyCounts: { [key: string]: number } = {};
  filteredTrades.forEach(trade => {
    strategyCounts[trade.strategy] = (strategyCounts[trade.strategy] || 0) + 1;
  });
  
  return Object.keys(strategyCounts).reduce((a, b) => 
    strategyCounts[a] > strategyCounts[b] ? a : b, 'Strategy 1'
  );
};

export const getMostUsedPair = (trades: Trade[], selectedAccount?: string): string => {
  let filteredTrades = trades.filter(t => t.type === 'Trade');
  if (selectedAccount && selectedAccount !== 'All') {
    filteredTrades = filteredTrades.filter(t => t.account === selectedAccount);
  }
  
  const pairCounts: { [key: string]: number } = {};
  filteredTrades.forEach(trade => {
    pairCounts[trade.pair] = (pairCounts[trade.pair] || 0) + 1;
  });
  
  return Object.keys(pairCounts).reduce((a, b) => 
    pairCounts[a] > pairCounts[b] ? a : b, 'XAUUSD'
  );
};

export const getNetDailyPerformance = (trades: Trade[], dateRange?: { startDate: string; endDate: string }, selectedAccount?: string) => {
  let filteredTrades = trades.filter(t => t.type === 'Trade');
  
  if (dateRange && dateRange.startDate && dateRange.endDate) {
    filteredTrades = filteredTrades.filter(t => {
      const tradeDate = new Date(t.date);
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      return tradeDate >= start && tradeDate <= end;
    });
  }
  
  if (selectedAccount && selectedAccount !== 'All') {
    filteredTrades = filteredTrades.filter(t => t.account === selectedAccount);
  }
  
  const dailyPL: { [key: string]: number } = {};
  
  filteredTrades.forEach(trade => {
    const date = trade.date;
    if (!dailyPL[date]) {
      dailyPL[date] = 0;
    }
    dailyPL[date] += trade.gainLoss - trade.fees;
  });
  
  // Sort dates and create labels and data arrays
  const sortedDates = Object.keys(dailyPL).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  const labels = sortedDates.map(date => {
    try {
      return format(new Date(date), 'MM/dd/yy');
    } catch {
      return date;
    }
  });
  const data = sortedDates.map(date => dailyPL[date]);
  
  return { labels, data };
};

export const getTradeTimePerformance = (trades: Trade[], dateRange?: { startDate: string; endDate: string }, selectedAccount?: string) => {
  let filteredTrades = trades.filter(t => t.type === 'Trade' && t.entryTime);
  
  if (dateRange && dateRange.startDate && dateRange.endDate) {
    filteredTrades = filteredTrades.filter(t => {
      const tradeDate = new Date(t.date);
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      return tradeDate >= start && tradeDate <= end;
    });
  }
  
  if (selectedAccount && selectedAccount !== 'All') {
    filteredTrades = filteredTrades.filter(t => t.account === selectedAccount);
  }
  
  const timePerformanceData = filteredTrades.map((trade, index) => {
    // Parse time from format like "3:00:00 PM" or "15:00:00"
    let hour = 0;
    let minute = 0;
    const timeStr = trade.entryTime.toLowerCase();
    
    if (timeStr.includes('pm') || timeStr.includes('am')) {
      const [time, period] = timeStr.split(' ');
      const [hourStr, minuteStr] = time.split(':');
      hour = parseInt(hourStr);
      minute = parseInt(minuteStr) || 0;
      if (period === 'pm' && hour !== 12) hour += 12;
      if (period === 'am' && hour === 12) hour = 0;
    } else {
      const [hourStr, minuteStr] = timeStr.split(':');
      hour = parseInt(hourStr);
      minute = parseInt(minuteStr) || 0;
    }
    
    // Convert to decimal hours (e.g., 14:30 becomes 14.5)
    const decimalHour = hour + (minute / 60);
    
    // Add slight jitter to prevent overlapping points
    const jitter = (Math.random() - 0.5) * 0.3;
    
    return {
      x: decimalHour + jitter,
      y: trade.gainLoss - trade.fees
    };
  }).filter(point => !isNaN(point.x) && !isNaN(point.y));
  
  return timePerformanceData;
};

export const getTradeDurationPerformance = (trades: Trade[], dateRange?: { startDate: string; endDate: string }, selectedAccount?: string) => {
  let filteredTrades = trades.filter(t => t.type === 'Trade' && t.duration);
  
  if (dateRange && dateRange.startDate && dateRange.endDate) {
    filteredTrades = filteredTrades.filter(t => {
      const tradeDate = new Date(t.date);
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      return tradeDate >= start && tradeDate <= end;
    });
  }
  
  if (selectedAccount && selectedAccount !== 'All') {
    filteredTrades = filteredTrades.filter(t => t.account === selectedAccount);
  }
  
  const durationPerformanceData = filteredTrades.map((trade, index) => {
    // Parse duration from format like "0:20:00" (hours:minutes:seconds)
    const durationParts = trade.duration.split(':');
    const hours = parseInt(durationParts[0]) || 0;
    const minutes = parseInt(durationParts[1]) || 0;
    const seconds = parseInt(durationParts[2]) || 0;
    
    // Convert to total minutes for better visualization
    const totalMinutes = hours * 60 + minutes + seconds / 60;
    
    // Add slight jitter to prevent overlapping points
    const jitter = (Math.random() - 0.5) * 5;
    
    return {
      x: Math.max(0, totalMinutes + jitter), // Ensure x is never negative
      y: trade.gainLoss - trade.fees
    };
  }).filter(point => !isNaN(point.x) && !isNaN(point.y) && point.x >= 0);
  
  return durationPerformanceData;
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