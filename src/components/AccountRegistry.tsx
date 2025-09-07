import React, { useState } from 'react';
import { Trade, AppSettings } from '../types/trade';
import { formatCurrency, formatPercentage } from '../utils/calculations';
import { BarChart } from './charts/BarChart';
import { LineChart } from './charts/LineChart';
import { Plus } from 'lucide-react';

interface AccountRegistryProps {
  trades: Trade[];
  settings: AppSettings;
  onAddActivity: (activity: { type: 'Deposit' | 'Withdrawal'; amount: number; account: string }) => void;
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

export const AccountRegistry: React.FC<AccountRegistryProps> = ({ trades, settings, onAddActivity }) => {
  const [selectedAccount, setSelectedAccount] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newActivity, setNewActivity] = useState({
    type: 'Deposit' as 'Deposit' | 'Withdrawal',
    amount: 0,
    account: settings.accounts[0] || 'Account 1'
  });

  // Calculate account statistics
  const calculateAccountStats = () => {
    let filteredTrades = trades;
    
    if (selectedAccount !== 'All') {
      filteredTrades = trades.filter(t => t.account === selectedAccount);
    }
    
    if (startDate && endDate) {
      filteredTrades = filteredTrades.filter(t => {
        const tradeDate = new Date(t.date);
        return tradeDate >= new Date(startDate) && tradeDate <= new Date(endDate);
      });
    }
    
    const totalDeposits = filteredTrades.filter(t => t.type === 'Deposit').reduce((sum, t) => sum + t.gainLoss, 0);
    const totalWithdrawals = Math.abs(filteredTrades.filter(t => t.type === 'Withdrawal').reduce((sum, t) => sum + t.gainLoss, 0));
    const tradingPL = filteredTrades.filter(t => t.type === 'Trade').reduce((sum, t) => sum + t.gainLoss - t.fees, 0);
    const currentBalance = 100000 + totalDeposits - totalWithdrawals + tradingPL;
    const equityGrowth = totalDeposits > 0 ? ((currentBalance - 100000) / totalDeposits) * 100 : 0;
    const netPL = tradingPL;
    const maxDrawdown = -1604.00; // Simplified
    const maxDrawdownPercent = -11.49; // Simplified

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
    const activities: AccountActivity[] = [];

    // Add deposit/withdrawal activities
    trades.forEach((trade) => {
      if (trade.type === 'Deposit' || trade.type === 'Withdrawal') {
        activities.push({
          id: trade.id,
          account: trade.account,
          date: trade.date,
          activity: trade.type === 'Withdrawal' ? 'Withdraw' : 'Deposit',
          amount: trade.gainLoss,
        });
      }
    });

    // Filter by selected account and date range
    let filteredActivities = activities;
    if (selectedAccount !== 'All') {
      filteredActivities = activities.filter(a => a.account === selectedAccount);
    }
    if (startDate && endDate) {
      filteredActivities = filteredActivities.filter(a => {
        const activityDate = new Date(a.date);
        return activityDate >= new Date(startDate) && activityDate <= new Date(endDate);
      });
    }

    return filteredActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const handleAddActivity = () => {
    onAddActivity({
      type: newActivity.type,
      amount: newActivity.amount,
      account: newActivity.account
    });
    setNewActivity({
      type: 'Deposit',
      amount: 0,
      account: settings.accounts[0] || 'Account 1'
    });
    setShowAddForm(false);
  };

  const stats = calculateAccountStats();
  const accountActivity = generateAccountActivity();

  // Deposits & Withdrawals Chart Data
  const depositData = accountActivity.filter(a => a.activity === 'Deposit');
  const withdrawalData = accountActivity.filter(a => a.activity === 'Withdraw');
  
  const depositsWithdrawalsData = {
    labels: [...new Set([...depositData.map(d => d.date), ...withdrawalData.map(w => w.date)])].slice(-5),
    datasets: [
      {
        label: 'Deposit',
        data: depositData.slice(-5).map(d => d.amount),
        backgroundColor: '#FFB6C1',
      },
      {
        label: 'Withdraw',
        data: withdrawalData.slice(-5).map(w => Math.abs(w.amount)),
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
              {settings.accounts.map(account => (
                <option key={account} value={account}>{account}</option>
              ))}
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
          
          <div>
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <Plus size={16} />
              <span>Add Activity</span>
            </button>
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

      {/* Add Activity Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Add New Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={newActivity.type}
                onChange={(e) => setNewActivity(prev => ({ ...prev, type: e.target.value as 'Deposit' | 'Withdrawal' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Deposit">Deposit</option>
                <option value="Withdrawal">Withdrawal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                value={newActivity.amount}
                onChange={(e) => setNewActivity(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account</label>
              <select
                value={newActivity.account}
                onChange={(e) => setNewActivity(prev => ({ ...prev, account: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {settings.accounts.map(account => (
                  <option key={account} value={account}>{account}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddActivity}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md"
            >
              Add Activity
            </button>
          </div>
        </div>
      )}
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
                {trades.filter(t => t.type === 'Trade').slice(0, 15).map((trade, index) => (
                  <tr key={trade.id} className="border-b hover:bg-gray-50">
                    <td className="px-2 py-2">Account 1</td>
                    <td className="px-2 py-2">{trade.date}</td>
                    <td className="px-2 py-2">
                      <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                        Trade
                      </span>
                    </td>
                    <td className="px-2 py-2">{trade.direction}</td>
                    <td className="px-2 py-2">{trade.pair}</td>
                    <td className={`px-2 py-2 font-medium ${
                      trade.gainLoss > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(trade.gainLoss)}
                    </td>
                    <td className="px-2 py-2">{formatCurrency(trade.gainLoss)}</td>
                    <td className="px-2 py-2">{formatCurrency(100000 + (index * 100))}</td>
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