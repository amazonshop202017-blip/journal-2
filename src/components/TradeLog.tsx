import React, { useState } from 'react';
import { Trade } from '../types/trade';
import { formatCurrency } from '../utils/calculations';
import { Edit, Trash2, Check, X } from 'lucide-react';

interface TradeLogProps {
  trades: Trade[];
  onEditTrade: (trade: Trade) => void;
  onDeleteTrade: (tradeId: string) => void;
}

export const TradeLog: React.FC<TradeLogProps> = ({ trades, onEditTrade, onDeleteTrade }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);

  const handleEditClick = (trade: Trade) => {
    setEditingId(trade.id);
    setEditingTrade({ ...trade });
  };

  const handleSaveEdit = () => {
    if (editingTrade) {
      onEditTrade(editingTrade);
      setEditingId(null);
      setEditingTrade(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTrade(null);
  };

  const handleFieldChange = (field: keyof Trade, value: any) => {
    if (editingTrade) {
      setEditingTrade({
        ...editingTrade,
        [field]: value
      });
    }
  };

  const renderEditableCell = (trade: Trade, field: keyof Trade, type: 'text' | 'number' | 'date' | 'select' = 'text', options?: string[]) => {
    const isEditing = editingId === trade.id;
    const value = isEditing ? editingTrade?.[field] : trade[field];

    if (!isEditing) {
      if (field === 'gainLoss' || field === 'fees') {
        return (
          <span className={`${
            field === 'gainLoss' && typeof value === 'number' 
              ? value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-600'
              : ''
          }`}>
            {typeof value === 'number' ? formatCurrency(value) : String(value)}
          </span>
        );
      }
      if (field === 'status') {
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === 'Win' ? 'bg-green-100 text-green-800' :
            value === 'Loss' ? 'bg-red-100 text-red-800' :
            value === 'Breakeven' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {String(value)}
          </span>
        );
      }
      if (typeof value === 'number' && (field.includes('Point') || field.includes('Profit') || field.includes('Loss'))) {
        return String(value.toFixed(4));
      }
      return String(value);
    }

    if (type === 'select' && options) {
      return (
        <select
          value={String(value)}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-teal-500"
        >
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={type}
        value={String(value)}
        onChange={(e) => handleFieldChange(field, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
        className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-teal-500"
        step={type === 'number' ? '0.0001' : undefined}
      />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-teal-50 px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Trade Log</h2>
        <p className="text-sm text-gray-600 mt-1">• FOREX DASHBOARD •</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 py-3 text-left font-medium text-gray-600 border-r">#</th>
              <th className="px-2 py-3 text-center font-medium text-gray-600 border-r" colSpan={8}>
                TRANSACTION DETAILS
              </th>
              <th className="px-2 py-3 text-center font-medium text-gray-600 border-r" colSpan={8}>
                TRADE DETAILS
              </th>
              <th className="px-2 py-3 text-center font-medium text-gray-600 border-r" colSpan={8}>
                OPEN POSITION
              </th>
              <th className="px-2 py-3 text-center font-medium text-gray-600 border-r" colSpan={8}>
                CLOSED POSITION
              </th>
              <th className="px-2 py-3 text-center font-medium text-gray-600 border-r" colSpan={3}>
                ACCOUNT DETAILS
              </th>
              <th className="px-2 py-3 text-center font-medium text-gray-600" colSpan={2}>
                JOURNAL
              </th>
              <th className="px-2 py-3 text-center font-medium text-gray-600">Actions</th>
            </tr>
            <tr className="bg-gray-50 text-xs">
              <th className="px-2 py-2 text-left text-gray-500 border-r"></th>
              <th className="px-2 py-2 text-left text-gray-500 border-r">Account</th>
              <th className="px-2 py-2 text-left text-gray-500 border-r">Type</th>
              <th className="px-2 py-2 text-left text-gray-500 border-r">Date</th>
              <th className="px-2 py-2 text-left text-gray-500 border-r">Strategy</th>
              <th className="px-2 py-2 text-left text-gray-500 border-r">Pair</th>
              <th className="px-2 py-2 text-left text-gray-500 border-r">Direction</th>
              <th className="px-2 py-2 text-left text-gray-500 border-r">Lot Size</th>
              <th className="px-2 py-2 text-left text-gray-500 border-r">Leverage</th>
              <th className="px-2 py-2 text-left text-gray-500 border-r">Risk Ratio</th>
              <th className="px-2 py-2 text-left text-gray-500 border-r">Entry Time</th>
              <th className="px-2 py-2 text-left text-gray-500 border-r">Entry Point</th>
              <th className="px-2 py-2 text-left text-gray-500 border-r">Take Profit</th>
              <th className="px-2 py-2 text-left text-gray-500 border-r">Stop Loss</th>
              <th className="px-2 py-2 text-left text-gray-500 border-r">Exit Date</th>
              <th className="px-2 py-2 text-left text-gray-500 border-r">Exit Time</th>
              <th className="px-2 py-2 text-left text-gray-500 border-r">Exit Point</th>
              <th className="px-2 py-2 text-left text-gray-500 border-r">Duration</th>
              <th className="px-2 py-2 text-left text-gray-500 border-r">Status</th>
              <th className="px-2 py-2 text-left text-gray-500 border-r">Fees</th>
              <th className="px-2 py-2 text-left text-gray-500 border-r">Gain / Loss</th>
              <th className="px-2 py-2 text-left text-gray-500 border-r">Total Balance</th>
              <th className="px-2 py-2 text-left text-gray-500 border-r">Notes</th>
              <th className="px-2 py-2 text-center text-gray-500"></th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {trades.map((trade, index) => (
              <tr key={trade.id} className={`hover:bg-gray-50 border-b ${editingId === trade.id ? 'bg-blue-50' : ''}`}>
                <td className="px-2 py-3 text-sm border-r">{index + 1}</td>
                <td className="px-2 py-3 text-xs border-r">{renderEditableCell(trade, 'account')}</td>
                <td className="px-2 py-3 text-xs border-r">{renderEditableCell(trade, 'type', 'select', ['Trade', 'Deposit', 'Withdrawal'])}</td>
                <td className="px-2 py-3 text-xs border-r">{renderEditableCell(trade, 'date', 'date')}</td>
                <td className="px-2 py-3 text-xs border-r">{renderEditableCell(trade, 'strategy')}</td>
                <td className="px-2 py-3 text-xs border-r">{renderEditableCell(trade, 'pair')}</td>
                <td className="px-2 py-3 text-xs border-r">{renderEditableCell(trade, 'direction', 'select', ['Long', 'Short'])}</td>
                <td className="px-2 py-3 text-xs border-r">{renderEditableCell(trade, 'lotSize', 'number')}</td>
                <td className="px-2 py-3 text-xs border-r">{renderEditableCell(trade, 'leverage', 'number')}</td>
                <td className="px-2 py-3 text-xs border-r">{renderEditableCell(trade, 'riskRatio', 'number')}</td>
                <td className="px-2 py-3 text-xs border-r">{renderEditableCell(trade, 'entryTime')}</td>
                <td className="px-2 py-3 text-xs border-r">{renderEditableCell(trade, 'entryPoint', 'number')}</td>
                <td className="px-2 py-3 text-xs border-r">{renderEditableCell(trade, 'takeProfit', 'number')}</td>
                <td className="px-2 py-3 text-xs border-r">{renderEditableCell(trade, 'stopLoss', 'number')}</td>
                <td className="px-2 py-3 text-xs border-r">{renderEditableCell(trade, 'exitDate', 'date')}</td>
                <td className="px-2 py-3 text-xs border-r">{renderEditableCell(trade, 'exitTime')}</td>
                <td className="px-2 py-3 text-xs border-r">{renderEditableCell(trade, 'exitPoint', 'number')}</td>
                <td className="px-2 py-3 text-xs border-r">{renderEditableCell(trade, 'duration')}</td>
                <td className="px-2 py-3 text-xs border-r">{renderEditableCell(trade, 'status', 'select', ['Open', 'Win', 'Loss', 'Breakeven'])}</td>
                <td className="px-2 py-3 text-xs border-r">{renderEditableCell(trade, 'fees', 'number')}</td>
                <td className="px-2 py-3 text-xs border-r">{renderEditableCell(trade, 'gainLoss', 'number')}</td>
                <td className="px-2 py-3 text-xs border-r">{formatCurrency(100000)}</td>
                <td className="px-2 py-3 text-xs border-r">
                  {editingId === trade.id ? (
                    <textarea
                      value={editingTrade?.notes || ''}
                      onChange={(e) => handleFieldChange('notes', e.target.value)}
                      className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-teal-500"
                      rows={2}
                    />
                  ) : (
                    <span className="truncate max-w-32 block">{trade.notes}</span>
                  )}
                </td>
                <td className="px-2 py-3 text-center">
                  <div className="flex justify-center space-x-2">
                    {editingId === trade.id ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="text-green-600 hover:text-green-800 p-1"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-600 hover:text-gray-800 p-1"
                        >
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(trade)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => onDeleteTrade(trade.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};