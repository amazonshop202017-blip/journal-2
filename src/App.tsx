import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Navigation } from './components/Navigation';
import { TradeLog } from './components/TradeLog';
import { Dashboard } from './components/Dashboard';
import { StrategyReport } from './components/StrategyReport';
import { Calendar } from './components/Calendar';
import { AccountRegistry } from './components/AccountRegistry';
import { Setup } from './components/Setup';
import { Trade, AppSettings } from './types/trade';
import { sampleTrades } from './data/sampleTrades';
import { Plus } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('trade-log');
  const [trades, setTrades] = useState<Trade[]>(sampleTrades);
  const [settings, setSettings] = useState<AppSettings>({
    currency: '$',
    accounts: ['fxmo funded', 'Account 1', 'Account 2'],
    markets: ['FOREX', 'METAL'],
    strategies: ['Strategy 1', 'Strategy 2']
  });

  const handleEditTrade = (updatedTrade: Trade) => {
    setTrades(prevTrades =>
      prevTrades.map(t => t.id === updatedTrade.id ? updatedTrade : t)
    );
  };

  const handleDeleteTrade = (tradeId: string) => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      setTrades(prevTrades => prevTrades.filter(t => t.id !== tradeId));
    }
  };

  const handleAddTrade = () => {
    const newTrade: Trade = {
      id: Date.now().toString(),
      account: settings.accounts[0] || 'Account 1',
      type: 'Trade',
      date: new Date().toISOString().split('T')[0],
      strategy: settings.strategies[0] || 'Strategy 1',
      pair: 'XAUUSD',
      direction: 'Long',
      lotSize: 200,
      leverage: 2,
      riskRatio: 2,
      entryTime: '12:00:00 PM',
      entryPoint: 0,
      takeProfit: 0,
      stopLoss: 0,
      exitDate: '',
      exitTime: '',
      exitPoint: 0,
      duration: '0:00:00',
      status: 'Open',
      fees: 0,
      gainLoss: 0,
      notes: ''
    };
    setTrades(prevTrades => [newTrade, ...prevTrades]);
  };

  const handleAddAccountActivity = (activity: { type: 'Deposit' | 'Withdrawal'; amount: number; account: string }) => {
    const newTrade: Trade = {
      id: Date.now().toString(),
      account: activity.account,
      type: activity.type,
      date: new Date().toISOString().split('T')[0],
      strategy: '',
      pair: '',
      direction: '',
      lotSize: 0,
      leverage: 0,
      riskRatio: 0,
      entryTime: '',
      entryPoint: 0,
      takeProfit: 0,
      stopLoss: 0,
      exitDate: '',
      exitTime: '',
      exitPoint: 0,
      duration: '',
      status: '',
      fees: 0,
      gainLoss: activity.type === 'Withdrawal' ? -activity.amount : activity.amount,
      notes: ''
    };
    setTrades(prevTrades => [newTrade, ...prevTrades]);
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };
  const renderContent = () => {
    switch (activeTab) {
      case 'trade-log':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div></div>
              <button
                onClick={handleAddTrade}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus size={20} />
                <span>Add Trade</span>
              </button>
            </div>
            <TradeLog 
              trades={trades} 
              onEditTrade={handleEditTrade}
              onDeleteTrade={handleDeleteTrade}
              settings={settings}
            />
          </div>
        );
      case 'dashboard':
        return <Dashboard trades={trades} settings={settings} />;
      case 'strategy-report':
        return <StrategyReport trades={trades} settings={settings} />;
      case 'calendar':
        return <Calendar trades={trades} settings={settings} />;
      case 'account-registry':
        return <AccountRegistry trades={trades} settings={settings} onAddActivity={handleAddAccountActivity} />;
      case 'setup':
        return <Setup settings={settings} onUpdateSettings={handleUpdateSettings} />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
    </Layout>
  );
}

export default App;