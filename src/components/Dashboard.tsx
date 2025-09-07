import React from 'react';
import { Trade } from '../types/trade';
import { calculateStats, getAccountBalance, getMonthlyPL, formatCurrency, formatPercentage } from '../utils/calculations';
import { LineChart } from './charts/LineChart';
import { BarChart } from './charts/BarChart';
import { PieChart } from './charts/PieChart';

interface DashboardProps {
  trades: Trade[];
}

export const Dashboard: React.FC<DashboardProps> = ({ trades }) => {
  const stats = calculateStats(trades);
  const currentBalance = getAccountBalance(trades);
  const startingBalance = 100000;
  const totalGainLoss = currentBalance - startingBalance;
  const changePercentage = ((totalGainLoss / startingBalance) * 100);
  const monthlyPL = getMonthlyPL(trades);

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
  const monthlyLabels = Object.keys(monthlyPL);
  const monthlyGains = Object.values(monthlyPL).map(data => data.gain);
  const monthlyLosses = Object.values(monthlyPL).map(data => -data.loss);

  const monthlyPLData = {
    labels: ['January 2025', 'February 2025', 'March 2025', 'April 2025', 'May 2025'],
    datasets: [
      {
        label: 'Gain',
        data: [0, 0, 582, 1895, 2342],
        backgroundColor: '#9C27B0',
      },
      {
        label: 'Loss',
        data: [0, 0, 0, -1218, 0],
        backgroundColor: '#E91E63',
      }
    ]
  };

  // Strategy Breakdown Chart Data
  const strategyData = {
    labels: ['Strategy 1'],
    datasets: [{
      label: 'Strategy Performance',
      data: [3954],
      backgroundColor: '#14B8A6',
    }]
  };

  // Pair Breakdown Chart Data
  const pairData = {
    labels: ['XAUUSD'],
    datasets: [{
      data: [100],
      backgroundColor: ['#9C27B0'],
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
              <span className="text-sm font-medium">1 - Jan - 25</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">End Date</span>
              <span className="text-sm font-medium">31 - Dec - 25</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Account</span>
              <span className="text-sm font-medium">All ▼</span>
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
              <p className="text-lg font-medium">Strategy 1</p>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-600">Most Used Pair</span>
              <p className="text-lg font-medium">XAU/USD</p>
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