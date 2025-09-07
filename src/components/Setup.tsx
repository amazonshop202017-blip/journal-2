import React, { useState } from 'react';

interface Account {
  id: string;
  name: string;
  isActive: boolean;
}

interface Market {
  id: string;
  name: string;
  isActive: boolean;
}

interface Strategy {
  id: string;
  name: string;
  isActive: boolean;
}

export const Setup: React.FC = () => {
  const [currency, setCurrency] = useState('$');
  const [accounts, setAccounts] = useState<Account[]>([
    { id: '1', name: 'Account 1', isActive: true },
    { id: '2', name: 'Account 2', isActive: false },
    { id: '3', name: 'Account 3', isActive: false },
    { id: '4', name: 'Account 4', isActive: false },
    { id: '5', name: 'Account 5', isActive: false },
  ]);

  const [markets, setMarkets] = useState<Market[]>([
    { id: '1', name: 'FOREX', isActive: true },
    { id: '2', name: 'METAL', isActive: false },
  ]);

  const [strategies, setStrategies] = useState<Strategy[]>([
    { id: '1', name: 'Strategy 1', isActive: true },
    { id: '2', name: 'Strategy 2', isActive: false },
  ]);

  const addAccount = () => {
    const newAccount: Account = {
      id: Date.now().toString(),
      name: `Account ${accounts.length + 1}`,
      isActive: false
    };
    setAccounts([...accounts, newAccount]);
  };

  const addMarket = () => {
    const newMarket: Market = {
      id: Date.now().toString(),
      name: `Market ${markets.length + 1}`,
      isActive: false
    };
    setMarkets([...markets, newMarket]);
  };

  const addStrategy = () => {
    const newStrategy: Strategy = {
      id: Date.now().toString(),
      name: `Strategy ${strategies.length + 1}`,
      isActive: false
    };
    setStrategies([...strategies, newStrategy]);
  };

  const updateAccountName = (id: string, name: string) => {
    setAccounts(accounts.map(acc => 
      acc.id === id ? { ...acc, name } : acc
    ));
  };

  const updateMarketName = (id: string, name: string) => {
    setMarkets(markets.map(market => 
      market.id === id ? { ...market, name } : market
    ));
  };

  const updateStrategyName = (id: string, name: string) => {
    setStrategies(strategies.map(strategy => 
      strategy.id === id ? { ...strategy, name } : strategy
    ));
  };

  const toggleAccountActive = (id: string) => {
    setAccounts(accounts.map(acc => 
      acc.id === id ? { ...acc, isActive: !acc.isActive } : acc
    ));
  };

  const toggleMarketActive = (id: string) => {
    setMarkets(markets.map(market => 
      market.id === id ? { ...market, isActive: !market.isActive } : market
    ));
  };

  const toggleStrategyActive = (id: string) => {
    setStrategies(strategies.map(strategy => 
      strategy.id === id ? { ...strategy, isActive: !strategy.isActive } : strategy
    ));
  };

  const removeAccount = (id: string) => {
    setAccounts(accounts.filter(acc => acc.id !== id));
  };

  const removeMarket = (id: string) => {
    setMarkets(markets.filter(market => market.id !== id));
  };

  const removeStrategy = (id: string) => {
    setStrategies(strategies.filter(strategy => strategy.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'cursive' }}>
          Journal Setup
        </h1>
      </div>

      {/* Currency Setting */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="bg-pink-200 px-4 py-2 rounded">
            <span className="text-sm font-medium text-gray-700">SET YOUR CURRENCY</span>
          </div>
          <select 
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-lg font-medium"
          >
            <option value="$">$ (USD)</option>
            <option value="€">€ (EUR)</option>
            <option value="£">£ (GBP)</option>
            <option value="¥">¥ (JPY)</option>
          </select>
        </div>
      </div>

      {/* Main Setup Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Setup */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-blue-100 px-4 py-3 border-b">
            <h3 className="text-sm font-medium text-gray-700 text-center">ACCOUNT SET-UP</h3>
          </div>
          <div className="p-4">
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <h4 className="text-sm font-medium text-gray-700 text-center mb-3">ACCOUNT</h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {accounts.map((account) => (
                  <div key={account.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={account.isActive}
                      onChange={() => toggleAccountActive(account.id)}
                      className="rounded border-gray-300"
                    />
                    <input
                      type="text"
                      value={account.name}
                      onChange={(e) => updateAccountName(account.id, e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => removeAccount(account.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={addAccount}
                  className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 border border-dashed border-blue-300 rounded hover:border-blue-400"
                >
                  + Add Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trading Categories Setup */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-blue-100 px-4 py-3 border-b">
            <h3 className="text-sm font-medium text-gray-700 text-center">SET UP YOUR TRADING CATEGORIES</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Market Section */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 text-center mb-3">MARKET</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {markets.map((market) => (
                    <div key={market.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={market.isActive}
                        onChange={() => toggleMarketActive(market.id)}
                        className="rounded border-gray-300"
                      />
                      <input
                        type="text"
                        value={market.name}
                        onChange={(e) => updateMarketName(market.id, e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => removeMarket(market.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addMarket}
                    className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 border border-dashed border-blue-300 rounded hover:border-blue-400"
                  >
                    + Add Market
                  </button>
                </div>
              </div>

              {/* Strategy Section */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 text-center mb-3">STRATEGY</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {strategies.map((strategy) => (
                    <div key={strategy.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={strategy.isActive}
                        onChange={() => toggleStrategyActive(strategy.id)}
                        className="rounded border-gray-300"
                      />
                      <input
                        type="text"
                        value={strategy.name}
                        onChange={(e) => updateStrategyName(strategy.id, e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => removeStrategy(strategy.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addStrategy}
                    className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 border border-dashed border-blue-300 rounded hover:border-blue-400"
                  >
                    + Add Strategy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
          Save Configuration
        </button>
      </div>
    </div>
  );
};