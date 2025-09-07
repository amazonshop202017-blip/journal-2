import React, { useState } from 'react';
import { AppSettings } from '../types/trade';

interface SetupProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
}

export const Setup: React.FC<SetupProps> = ({ settings, onUpdateSettings }) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [hasChanges, setHasChanges] = useState(false);

  const updateLocalSettings = (newSettings: Partial<AppSettings>) => {
    setLocalSettings(prev => ({ ...prev, ...newSettings }));
    setHasChanges(true);
  };

  const addAccount = () => {
    const newAccounts = [...localSettings.accounts, `Account ${localSettings.accounts.length + 1}`];
    updateLocalSettings({ accounts: newAccounts });
  };

  const addStrategy = () => {
    const newStrategies = [...localSettings.strategies, `Strategy ${localSettings.strategies.length + 1}`];
    updateLocalSettings({ strategies: newStrategies });
  };

  const addMarket = () => {
    const newMarkets = [...localSettings.markets, `Market ${localSettings.markets.length + 1}`];
    updateLocalSettings({ markets: newMarkets });
  };

  const updateAccountName = (index: number, name: string) => {
    const newAccounts = [...localSettings.accounts];
    newAccounts[index] = name;
    updateLocalSettings({ accounts: newAccounts });
  };

  const updateMarketName = (index: number, name: string) => {
    const newMarkets = [...localSettings.markets];
    newMarkets[index] = name;
    updateLocalSettings({ markets: newMarkets });
  };

  const updateStrategyName = (index: number, name: string) => {
    const newStrategies = [...localSettings.strategies];
    newStrategies[index] = name;
    updateLocalSettings({ strategies: newStrategies });
  };

  const removeAccount = (index: number) => {
    const newAccounts = localSettings.accounts.filter((_, i) => i !== index);
    updateLocalSettings({ accounts: newAccounts });
  };

  const removeMarket = (index: number) => {
    const newMarkets = localSettings.markets.filter((_, i) => i !== index);
    updateLocalSettings({ markets: newMarkets });
  };

  const removeStrategy = (index: number) => {
    const newStrategies = localSettings.strategies.filter((_, i) => i !== index);
    updateLocalSettings({ strategies: newStrategies });
  };

  const handleSave = () => {
    onUpdateSettings(localSettings);
    setHasChanges(false);
    alert('Configuration saved successfully!');
  };

  const handleReset = () => {
    setLocalSettings(settings);
    setHasChanges(false);
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
            value={localSettings.currency}
            onChange={(e) => updateLocalSettings({ currency: e.target.value })}
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
                {localSettings.accounts.map((account, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={account}
                      onChange={(e) => updateAccountName(index, e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => removeAccount(index)}
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
                  {localSettings.markets.map((market, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={market}
                        onChange={(e) => updateMarketName(index, e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => removeMarket(index)}
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
                  {localSettings.strategies.map((strategy, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={strategy}
                        onChange={(e) => updateStrategyName(index, e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => removeStrategy(index)}
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
      <div className="flex justify-center space-x-4">
        <button 
          onClick={handleReset}
          disabled={!hasChanges}
          className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-8 py-3 rounded-lg font-medium transition-colors"
        >
          Reset Changes
        </button>
        <button 
          onClick={handleSave}
          disabled={!hasChanges}
          className="bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white px-8 py-3 rounded-lg font-medium transition-colors"
        >
          Save Configuration
        </button>
      </div>
      
      {hasChanges && (
        <div className="text-center text-sm text-orange-600">
          You have unsaved changes. Click "Save Configuration" to apply them.
        </div>
      )}
    </div>
  );
};