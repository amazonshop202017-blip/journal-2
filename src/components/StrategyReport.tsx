import React from 'react';
import { Trade, AppSettings } from '../types/trade';
import { calculateStats, formatCurrency, formatPercentage, getStrategyBreakdown, getPairBreakdown } from '../utils/calculations';
import { BarChart } from './charts/BarChart';
import { PieChart } from './charts/PieChart';
import { useState } from 'react';

interface StrategyReportProps {
  trades: Trade[];
  settings: AppSettings;
}

export const StrategyReport: React.FC<StrategyReportProps> = ({ trades, settings }) => {
  const [selectedStrategy, setSelectedStrategy] = useState(settings.strategies[0] || 'Strategy 1');
  const [selectedAccount, setSelectedAccount] = useState('All');
  
  // Filter trades by selected strategy
  const strategyTrades = trades.filter(t => t.type === 'Trade' && t.strategy === selectedStrategy);
  const filteredTrades = selectedAccount === 'All' ? strategyTrades : strategyTrades.filter(t => t.account === selectedAccount);
  
  const stats = calculateStats(trades.filter(t => t.strategy === selectedStrategy), undefined, selectedAccount);
  
  // Calculate performance data
  const wins = filteredTrades.filter(t => t.status === 'Win').length;
  const losses = filteredTrades.filter(t => t.status === 'Loss').length;
  const breakevens = filteredTrades.filter(t => t.status === 'Breakeven').length;
  const total = wins + losses + breakevens;
  
  const winPercentage = total > 0 ? (wins / total) * 100 : 0;
  const lossPercentage = total > 0 ? (losses / total) * 100 : 0;
  const breakevenPercentage = total > 0 ? (breakevens / total) * 100 : 0;
  
  // Calculate profit/loss data
  const totalProfit = filteredTrades.filter(t => t.gainLoss > 0).reduce((sum, t) => sum + t.gainLoss, 0);
  const totalLoss = Math.abs(filteredTrades.filter(t => t.gainLoss < 0).reduce((sum, t) => sum + t.gainLoss, 0));
  
  // Calculate direction data
  const longTrades = filteredTrades.filter(t => t.direction === 'Long');
  const shortTrades = filteredTrades.filter(t => t.direction === 'Short');
  const longProfit = longTrades.reduce((sum, t) => sum + t.gainLoss, 0);
  const shortProfit = shortTrades.reduce((sum, t) => sum + t.gainLoss, 0);
  
  // Trade Performance Pie Chart Data
  const performanceData = {
    labels: ['Wins', 'Losses', 'Breakevens'],
    datasets: [{
      data: [winPercentage, lossPercentage, breakevenPercentage],
      backgroundColor: ['#FFB6C1', '#DDA0DD', '#F0E68C'],
    }]
  };

  // Trade Performance Bar Chart Data
  const profitLossData = {
    labels: ['Profit', 'Loss'],
    datasets: [{
      data: [totalProfit, -totalLoss],
      backgroundColor: ['#87CEEB', '#FFB6C1'],
    }]
  };

  // Profit vs Direction Chart Data
  const directionData = {
    labels: ['Long', 'Short'],
    datasets: [{
      data: [longProfit, shortProfit],
      backgroundColor: ['#DDA0DD', '#DDA0DD'],
    }]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Strategy Report</h1>
        <p className="text-sm text-gray-600">• FOREX Dashboard •</p>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">STRATEGY:</label>
            <select 
              value={selectedStrategy}
              onChange={(e) => setSelectedStrategy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
            >
              {settings.strategies.map(strategy => (
                <option key={strategy} value={strategy}>{strategy}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ACCOUNT:</label>
            <select 
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
            >
              <option value="All">All</option>
              {settings.accounts.map(account => (
                <option key={account} value={account}>{account}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <h3 className="text-sm font-medium text-gray-700 mb-2">WIN RATE</h3>
          <p className="text-3xl font-bold text-gray-800">{formatPercentage(stats.winRate)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <h3 className="text-sm font-medium text-gray-700 mb-2">TOTAL P/L</h3>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(stats.totalPL)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <h3 className="text-sm font-medium text-gray-700 mb-2">AVERAGE P/L</h3>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(stats.avgPL)}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4 text-center">TRADE PERFORMANCE</h3>
          <PieChart data={performanceData} height={200} />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4 text-center">TRADE PERFORMANCE</h3>
          <BarChart data={profitLossData} height={200} />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4 text-center">PROFIT VS. DIRECTION</h3>
          <BarChart data={directionData} height={200} />
        </div>
      </div>

      {/* Trade Statistics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">TRADE STATISTICS</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Month:</span>
            <p className="font-medium">All</p>
          </div>
          <div>
            <span className="text-gray-600">Year:</span>
            <p className="font-medium">2025</p>
          </div>
          <div>
            <span className="text-gray-600">Account:</span>
            <p className="font-medium">{selectedAccount}</p>
          </div>
          <div>
            <span className="text-gray-600">Avg. Win:</span>
            <p className="font-medium">{formatCurrency(stats.avgWin)}</p>
          </div>
          <div>
            <span className="text-gray-600">Largest Win:</span>
            <p className="font-medium">{formatCurrency(stats.largestWin)}</p>
          </div>
          <div>
            <span className="text-gray-600">Avg. Loss:</span>
            <p className="font-medium">{formatCurrency(stats.avgLoss)}</p>
          </div>
          <div>
            <span className="text-gray-600">Largest Loss:</span>
            <p className="font-medium">{formatCurrency(stats.largestLoss)}</p>
          </div>
        </div>
      </div>

      {/* Detailed Trade Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-3 text-left font-medium text-gray-600 border-r">TRANSACTION DETAILS</th>
                <th className="px-3 py-3 text-left font-medium text-gray-600 border-r">TRADE DETAILS</th>
                <th className="px-3 py-3 text-left font-medium text-gray-600 border-r">OPEN POSITION</th>
                <th className="px-3 py-3 text-left font-medium text-gray-600 border-r">CLOSED POSITION</th>
                <th className="px-3 py-3 text-left font-medium text-gray-600">ACCOUNT DETAILS</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredTrades.slice(0, 10).map((trade, index) => (
                <tr key={trade.id} className="hover:bg-gray-50 border-b text-xs">
                  <td className="px-3 py-3 border-r">
                    <div className="space-y-1">
                      <div>#{index + 1} {trade.account}</div>
                      <div>{trade.type} - {trade.date}</div>
                      <div>{trade.strategy} - {trade.pair}</div>
                    </div>
                  </td>
                  <td className="px-3 py-3 border-r">
                    <div className="space-y-1">
                      <div>{trade.direction} - {trade.lotSize}</div>
                      <div>Leverage: {trade.leverage}</div>
                      <div>Risk: {trade.riskRatio}</div>
                    </div>
                  </td>
                  <td className="px-3 py-3 border-r">
                    <div className="space-y-1">
                      <div>{trade.entryTime}</div>
                      <div>Entry: {trade.entryPoint.toFixed(4)}</div>
                      <div>TP: {trade.takeProfit.toFixed(4)}</div>
                      <div>SL: {trade.stopLoss.toFixed(4)}</div>
                    </div>
                  </td>
                  <td className="px-3 py-3 border-r">
                    <div className="space-y-1">
                      <div>{trade.exitDate}</div>
                      <div>{trade.exitTime}</div>
                      <div>Exit: {trade.exitPoint.toFixed(4)}</div>
                      <div>{trade.duration}</div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          trade.status === 'Win' ? 'bg-green-100 text-green-800' :
                          trade.status === 'Loss' ? 'bg-red-100 text-red-800' :
                          trade.status === 'Breakeven' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {trade.status}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="space-y-1">
                      <div>Fees: {formatCurrency(trade.fees)}</div>
                      <div className={`font-medium ${
                        trade.gainLoss > 0 ? 'text-green-600' : 
                        trade.gainLoss < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {formatCurrency(trade.gainLoss)}
                      </div>
                      <div>{formatCurrency(100000)}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};