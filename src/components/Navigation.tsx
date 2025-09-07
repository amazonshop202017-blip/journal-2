import React from 'react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'trade-log', label: 'Trade Log' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'strategy-report', label: 'Strategy Report' },
    { id: 'calendar', label: 'Calendar' }
  ];

  return (
    <nav className="bg-white rounded-lg shadow-sm mb-6 p-1">
      <div className="flex space-x-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-teal-100 text-teal-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
};