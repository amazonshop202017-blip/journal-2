import React from 'react';
import { Trade, AppSettings } from '../types/trade';
import { calculateStats, getAccountBalance, getMonthlyPL, formatCurrency, formatPercentage, getStrategyBreakdown, getPairBreakdown, getMostUsedStrategy, getMostUsedPair, getNetDailyPerformance, getTradeTimePerformance, getTradeDurationPerformance } from '../utils/calculations';
import { LineChart } from './charts/LineChart';
import { BarChart } from './charts/BarChart';
import { PieChart } from './charts/PieChart';
import { ScatterChart } from './charts/ScatterChart';
import { useState } from 'react';

interface DashboardProps {
  trades: Trade[];
  settings: AppSettings;
}

export const Dashboard: React.FC<DashboardProps> = ({ trades, settings }) => {
  const [selectedAccount, setSelectedAccount] = useState('All');
  const [dateRange, setDateRange] = useState({
    startDate: '2025-01-01',
    endDate: '2025-12-31'
  });
  
  const stats = calculateStats(trades, dateRange, selectedAccount);
  const currentBalance = getAccountBalance(trades, selectedAccount);
  const startingBalance = 100000;
  const totalGainLoss = currentBalance - startingBalance;
  const changePercentage = ((totalGainLoss / startingBalance) * 100);
  const monthlyPL = getMonthlyPL(trades, selectedAccount);
  const strategyBreakdown = getStrategyBreakdown(trades, selectedAccount);
  const pairBreakdown = getPairBreakdown(trades, selectedAccount);
  const mostUsedStrategy = getMostUsedStrategy(trades, selectedAccount);
  const mostUsedPair = getMostUsedPair(trades, selectedAccount);

  // New performance data
  const netDailyPerformance = getNetDailyPerformance(trades, dateRange, selectedAccount);
  const tradeTimePerformance = getTradeTimePerformance(trades, dateRange, selectedAccount);
  const tradeDurationPerformance = getTradeDurationPerformance(trades, dateRange, selectedAccount);

  // Account Balance Chart Data
  const balanceData = {
    labels: ['Mar-30', 'Apr-13', 'Apr-27', 'May-11', 'May-25'],
    datasets: [{
      label: 'Account Balance',
      data: [100000, 101000, 102000, 101500, currentBalance],
      borderColor: '#14B8A6',
      backgroundColor: 'rgba(20, 184, 166, 0.1)',
      fill: true,
    }]
  };

  // Monthly P&L Chart Data
  const monthlyLabels = Object.keys(monthlyPL).slice(-5);
  const monthlyGains = monthlyLabels.map(month => monthlyPL[month]?.gain || 0);
  const monthlyLosses = monthlyLabels.map(month => -(monthlyPL[month]?.loss || 0));

  const monthlyPLData = {
    labels: monthlyLabels.length > 0 ? monthlyLabels : ['January 2025', 'February 2025', 'March 2025', 'April 2025', 'May 2025'],
    datasets: [
      {
        label: 'Gain',
        data: monthlyGains.length > 0 ? monthlyGains : [0, 0, 582, 1895, 2342],
        backgroundColor: '#9C27B0',
      },
      {
        label: 'Loss',
        data: monthlyLosses.length > 0 ? monthlyLosses : [0, 0, 0, -1218, 0],
        backgroundColor: '#E91E63',
      }
    ]
  };

  // Strategy Breakdown Chart Data
  const strategyLabels = Object.keys(strategyBreakdown);
  const strategyValues = Object.values(strategyBreakdown);
  
  const strategyData = {
    labels: strategyLabels.length > 0 ? strategyLabels : ['Strategy 1'],
    datasets: [{
      label: 'Strategy Performance',
      data: strategyValues.length > 0 ? strategyValues : [3954],
      backgroundColor: '#14B8A6',
    }]
  };

  // Pair Breakdown Chart Data
  const pairLabels = Object.keys(pairBreakdown);
  const pairValues = Object.values(pairBreakdown);
  const pairPercentages = pairValues.length > 0 ? 
    pairValues.map(val => (val / pairValues.reduce((a, b) => a + b, 0)) * 100) : [100];
  
  const pairData = {
    labels: pairLabels.length > 0 ? pairLabels : ['XAUUSD'],
    datasets: [{
      data: pairPercentages,
      backgroundColor: ['#9C27B0'],
    }]
  };

  // Net Daily Performance Chart Data
  const netDailyData = {
    labels: netDailyPerformance.labels,
    datasets: [{
      label: 'Net Daily P&L',
      data: netDailyPerformance.data,
      backgroundColor: netDailyPerformance.data.map(value => value >= 0 ? '#10B981' : '#EF4444'),
      borderWidth: 1,
      borderRadius: 2,
    }]
  };

  // Trade Time Performance Scatter Data
  const tradeTimeData = {
    datasets: [{
      label: 'Trade Time Performance',
      data: tradeTimePerformance,
      pointBackgroundColor: tradeTimePerformance.map(point => point.y >= 0 ? '#10B981' : '#EF4444'),
      pointBorderColor: tradeTimePerformance.map(point => point.y >= 0 ? '#10B981' : '#EF4444'),
      pointRadius: 4,
      pointHoverRadius: 6,
    }]
  };

  // Trade Duration Performance Scatter Data
  const tradeDurationData = {
    datasets: [{
      label: 'Trade Duration Performance',
      data: tradeDurationPerformance,
      pointBackgroundColor: tradeDurationPerformance.map(point => point.y >= 0 ? '#10B981' : '#EF4444'),
      pointBorderColor: tradeDurationPerformance.map(point => point.y >= 0 ? '#10B981' : '#EF4444'),
      pointRadius: 4,
      pointHoverRadius: 6,
    }]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Trade Dashboard</h1>
        <p className="text-gray-600">• FOREX DASHBOARD •</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Date Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Start Date</span>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="text-sm font-medium border border-gray-300 rounded px-2 py-1"
              />
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">End Date</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="text-sm font-medium border border-gray-300 rounded px-2 py-1"
              />
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Account</span>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="text-sm font-medium border border-gray-300 rounded px-2 py-1"
              >
                <option value="All">All</option>
                {settings.accounts.map(account => (
                  <option key={account} value={account}>{account}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Account Balance Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4 text-center">ACCOUNT BALANCE</h3>
          <LineChart data={balanceData} height={150} />
        </div>

        {/* Gain vs Loss Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4 text-center">GAIN VS. LOSS</h3>
          <BarChart data={monthlyPLData} height={150} />
        </div>
      </div>

      {/* New Performance Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Net Daily Performance */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700">Net daily P&L</h3>
            <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-xs text-gray-600">i</span>
            </div>
          </div>
          <BarChart data={netDailyData} height={200} options={{
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: function(context: any) {
                    const value = context.parsed.y;
                    return `P&L: $${value.toFixed(2)}`;
                  }
                }
              }
            },
            scales: {
              x: {
                display: true,
                grid: { 
                  display: true,
                  color: 'rgba(0, 0, 0, 0.1)',
                  drawBorder: false,
                },
                ticks: {
                  color: '#666',
                  font: {
                    size: 11,
                  }
                }
              },
              y: {
                display: true,
                grid: { 
                  color: 'rgba(0, 0, 0, 0.1)',
                  drawBorder: false,
                },
                ticks: {
                  color: '#666',
                  font: {
                    size: 11,
                  },
                  callback: function(value: any) {
                    return `$${value}`;
                  }
                }
              }
            }
          }} />
        </div>

        {/* Trade Time Performance */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700">Trade time performance</h3>
            <div className="flex space-x-2">
              <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-xs text-gray-600">⚙</span>
              </div>
              <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-xs text-gray-600">i</span>
              </div>
            </div>
          </div>
          <ScatterChart 
            data={tradeTimeData} 
            height={200} 
            type="time"
            options={{
              scales: {
                x: {
                  min: 0,
                  max: 24,
                  ticks: {
                    stepSize: 2,
                  }
                }
              }
            }}
          />
        </div>

        {/* Trade Duration Performance */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700">Trade duration performance</h3>
            <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-xs text-gray-600">i</span>
            </div>
          </div>
          <ScatterChart 
            data={tradeDurationData} 
            height={200} 
            type="duration"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4 text-center">SUMMARY</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Starting Balance</span>
              <span className="text-sm font-medium">{formatCurrency(startingBalance)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Current Balance</span>
              <span className="text-sm font-medium">{formatCurrency(currentBalance)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Gain / Loss</span>
              <span className={`text-sm font-medium ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalGainLoss)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">% Change</span>
              <span className={`text-sm font-medium ${changePercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(changePercentage)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Deposit</span>
              <span className="text-sm font-medium">{formatCurrency(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Withdrawal</span>
              <span className="text-sm font-medium">{formatCurrency(1754)}</span>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4 text-center">STATISTICS</h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">No. of Trades</span>
                <span className="font-medium">{stats.totalTrades}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">No. of Wins</span>
                <span className="font-medium">{stats.totalWins}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">No. of Losses</span>
                <span className="font-medium">{stats.totalLosses}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">No. of Breakevens</span>
                <span className="font-medium">{stats.totalBreakevens}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">No. of Open</span>
                <span className="font-medium">{stats.totalOpen}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">No. Long Trades</span>
                <span className="font-medium">{stats.longTrades}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">No. Short Trades</span>
                <span className="font-medium">{stats.shortTrades}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Win</span>
                <span className="font-medium">{formatCurrency(stats.avgWin)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Largest Win</span>
                <span className="font-medium">{formatCurrency(stats.largestWin)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Longest Win Streak</span>
                <span className="font-medium">{stats.longestWinStreak}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Loss</span>
                <span className="font-medium">{formatCurrency(stats.avgLoss)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Largest Loss</span>
                <span className="font-medium">{formatCurrency(stats.largestLoss)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Longest Lose Streak</span>
                <span className="font-medium">{stats.longestLoseStreak}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Max. Drawdown</span>
                <span className="font-medium">{formatPercentage(stats.maxDrawdown)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strategy Breakdown */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4 text-center">STRATEGY BREAKDOWN</h3>
          <BarChart data={strategyData} height={150} />
        </div>

        {/* Pair Breakdown */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4 text-center">PAIR BREAKDOWN</h3>
          <PieChart data={pairData} height={150} />
        </div>

        {/* Additional Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-sm text-gray-600">Most Used Strategy</span>
              <p className="text-lg font-medium">{mostUsedStrategy}</p>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-600">Most Used Pair</span>
              <p className="text-lg font-medium">{mostUsedPair}</p>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-600">Win Rate</span>
              <p className="text-lg font-medium text-green-600">{formatPercentage(stats.winRate)}</p>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-600">Avg. Time in Trades</span>
              <p className="text-lg font-medium">{stats.avgTimeInTrades}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};