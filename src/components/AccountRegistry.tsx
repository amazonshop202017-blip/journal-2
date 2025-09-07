import React, { useState } from 'react';
import { Trade } from '../types/trade';
import { formatCurrency, formatPercentage } from '../utils/calculations';
import { BarChart } from './charts/BarChart';
import { LineChart } from './charts/LineChart';

interface AccountRegistryProps {
  trades: Trade[];
}

interface AccountActivity {
  id: string;
  account: string;
  date: string;
  activity: 'Deposit' | 'Withdraw' | 'Trade';
  amount: number;
  position?: 'Long' | 'Short';
  symbol?: string;
  netPL?: number;
  balance?: number;
  totalBalance?: number;
}

export const AccountRegistry: React.FC<AccountRegistryProps> = ({ trades }) => {
  const [selectedAccount, setSelectedAccount] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Calculate account statistics
  const calculateAccountStats = () => {
    const totalDeposits = 18000.00;
    const totalWithdrawals = 2000.00;
    const currentBalance = 13701.32;
    const equityGrowth = 71.27;
    const netPL = 1701;
    const maxDrawdown = -1604.00;
    const maxDrawdownPercent = -11.49;

    return {
      totalDeposits,
      totalWithdrawals,
      currentBalance,
      equityGrowth,
      netPL,
      maxDrawdown,
      maxDrawdownPercent
    };
  };

  // Generate account activity data
  const generateAccountActivity = (): AccountActivity[] => {
    const activities: AccountActivity[] = [
      {
        id: '1',
        account: 'Account 1',
        date: '2/1/2025',
        activity: 'Deposit',
        amount: 5000.00
      },
      {
        id: '2',
        account: 'Account 1',
        date: '2/1/2025',
        activity: 'Deposit',
        amount: 5000.00
      },
      {
        id: '3',
        account: 'Account 1',
        date: '4/1/2025',
        activity: 'Withdraw',
        amount: 2000.00
      }
    ];

    // Add trade activities from existing trades
    trades.forEach((trade, index) => {
      if (trade.type === 'Trade') {
        activities.push({
          id: `trade-${trade.id}`,
          account: 'Account 1',
          date: trade.date,
          activity: 'Trade',
          amount: trade.gainLoss,
          position: trade.direction,
          symbol: trade.pair,
          netPL: trade.gainLoss,
          balance: trade.gainLoss,
          totalBalance: 10000 + (index * 100)
        });
      }
    });

    return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const stats = calculateAccountStats();
  const accountActivity = generateAccountActivity();

  // Deposits & Withdrawals Chart Data
  const depositsWithdrawalsData = {
    labels: ['2/1/2025', '2/1/2025', '4/1/2025'],
    datasets: [
      {
        label: 'Deposit',
        data: [5000, 5000, 0],
        backgroundColor: '#FFB6C1',
      },
      {
        label: 'Withdraw',
        data: [0, 0, 2000],
        backgroundColor: '#4A5568',
      }
    ]
  };

  // Equity Curve Data
  const equityCurveData = {
    labels: ['2/1/2025', '2/16/2025', '3/2/2025', '3/16/2025', '3/30/2025', '4/13/2025'],
    datasets: [{
      label: 'Equity',
      data: [0, 5000, 8000, 10000, 12000, 13701],
      borderColor: '#9CA3AF',
      backgroundColor: 'rgba(156, 163, 175, 0.1)',
      fill: true,
    }]
  };

  // Drawdown Data
  const drawdownData = {
    labels: ['2/1/2025', '2/16/2025', '3/2/2025', '3/16/2025', '3/30/2025', '4/13/2025'],
    datasets: [{
      label: 'Drawdown %',
      data: [0, -2, -5, -3, -8, -11.49],
      backgroundColor: '#FFB6C1',
    }]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'cursive' }}>
          Account Registry
        </h1>
      </div>

      {/* Filters and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">FILTER BY ACCOUNT</label>
            <select 
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-yellow-50"
            >
              <option>All</option>
              <option>Account 1</option>
              <option>Account 2</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">FILTER BY DATE</label>
            <div className="space-y-2">
              <input
                type="date"
                placeholder="Start"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-yellow-50"
              />
              <input
                type="date"
                placeholder="End"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-yellow-50"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="lg:col-span-2 bg-pink-100 rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4 text-center">STATS</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">TOTAL DEPOSITS</span>
                <span className="font-medium text-green-600">${stats.totalDeposits.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">TOTAL WITHDRAWALS</span>
                <span className="font-medium text-red-600">${stats.totalWithdrawals.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">CURRENT BALANCE</span>
                <span className="font-medium">${stats.currentBalance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">EQUITY GROWTH</span>
                <span className="font-medium text-green-600">{stats.equityGrowth}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">NET P&L</span>
                <span className="font-medium text-green-600">${stats.netPL}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">MAX DRAWDOWN</span>
                <span className="font-medium text-red-600">${Math.abs(stats.maxDrawdown).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">MAX DRAWDOWN %</span>
                <span className="font-medium text-red-600">{stats.maxDrawdownPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deposits & Withdrawals */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4 text-center">Deposits & Withdrawals</h3>
          <BarChart data={depositsWithdrawalsData} height={200} />
        </div>

        {/* Equity Curve */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4 text-center">Equity Curve</h3>
          <LineChart data={equityCurveData} height={200} />
        </div>

        {/* Drawdown % */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4 text-center">Drawdown %</h3>
          <BarChart data={drawdownData} height={200} />
        </div>
      </div>

      {/* Account Activity and Registry Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Activity Log */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-teal-100 px-4 py-3">
            <h3 className="text-sm font-medium text-gray-700 text-center">ACCOUNT ACTIVITY LOG</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">ACCOUNT</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">DATE</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">ACTIVITY</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {accountActivity.slice(0, 10).map((activity) => (
                  <tr key={activity.id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2">{activity.account}</td>
                    <td className="px-3 py-2">{activity.date}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        activity.activity === 'Deposit' ? 'bg-green-100 text-green-800' :
                        activity.activity === 'Withdraw' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {activity.activity}
                      </span>
                    </td>
                    <td className={`px-3 py-2 font-medium ${
                      activity.activity === 'Deposit' ? 'text-green-600' :
                      activity.activity === 'Withdraw' ? 'text-red-600' :
                      activity.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(Math.abs(activity.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Account Registry */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-pink-200 px-4 py-3">
            <h3 className="text-sm font-medium text-gray-700 text-center">ACCOUNT REGISTRY</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-2 text-left font-medium text-gray-600">ACCOUNT</th>
                  <th className="px-2 py-2 text-left font-medium text-gray-600">DATE</th>
                  <th className="px-2 py-2 text-left font-medium text-gray-600">ACTIVITY</th>
                  <th className="px-2 py-2 text-left font-medium text-gray-600">POSITION</th>
                  <th className="px-2 py-2 text-left font-medium text-gray-600">SYMBOL</th>
                  <th className="px-2 py-2 text-left font-medium text-gray-600">AMOUNT/NET P&L</th>
                  <th className="px-2 py-2 text-left font-medium text-gray-600">BALANCE</th>
                  <th className="px-2 py-2 text-left font-medium text-gray-600">TOTAL BALANCE</th>
                </tr>
              </thead>
              <tbody>
                {accountActivity.filter(a => a.activity === 'Trade').slice(0, 15).map((activity) => (
                  <tr key={activity.id} className="border-b hover:bg-gray-50">
                    <td className="px-2 py-2">Account 1</td>
                    <td className="px-2 py-2">{activity.date}</td>
                    <td className="px-2 py-2">
                      <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                        Trade
                      </span>
                    </td>
                    <td className="px-2 py-2">{activity.position}</td>
                    <td className="px-2 py-2">{activity.symbol}</td>
                    <td className={`px-2 py-2 font-medium ${
                      activity.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(activity.amount)}
                    </td>
                    <td className="px-2 py-2">{formatCurrency(activity.balance || 0)}</td>
                    <td className="px-2 py-2">{formatCurrency(activity.totalBalance || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};