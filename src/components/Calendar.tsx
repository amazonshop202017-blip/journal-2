import React, { useState } from 'react';
import { Trade } from '../types/trade';
import { formatCurrency } from '../utils/calculations';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  trades: Trade[];
}

interface DayData {
  date: number;
  trades: Trade[];
  totalPL: number;
  winRate: number;
  tradeCount: number;
}

export const Calendar: React.FC<CalendarProps> = ({ trades }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  // Get calendar data for the selected month
  const getCalendarData = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Convert to Monday = 0

    const calendarDays: (DayData | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayTrades = trades.filter(trade => trade.date === dateStr && trade.type === 'Trade');
      const totalPL = dayTrades.reduce((sum, trade) => sum + trade.gainLoss - trade.fees, 0);
      const wins = dayTrades.filter(trade => trade.status === 'Win').length;
      const winRate = dayTrades.length > 0 ? (wins / dayTrades.length) * 100 : 0;

      calendarDays.push({
        date: day,
        trades: dayTrades,
        totalPL,
        winRate,
        tradeCount: dayTrades.length
      });
    }

    return calendarDays;
  };

  // Get weekly summary data
  const getWeeklySummary = () => {
    const calendarDays = getCalendarData();
    const weeks: { weekNumber: number; totalPL: number; days: number }[] = [];
    
    let currentWeek = { weekNumber: 1, totalPL: 0, days: 0 };
    let dayCount = 0;

    calendarDays.forEach((day, index) => {
      if (day) {
        currentWeek.totalPL += day.totalPL;
        currentWeek.days++;
      }
      dayCount++;

      if (dayCount % 7 === 0 || index === calendarDays.length - 1) {
        weeks.push({ ...currentWeek });
        currentWeek = { weekNumber: currentWeek.weekNumber + 1, totalPL: 0, days: 0 };
      }
    });

    return weeks;
  };

  // Get monthly statistics
  const getMonthlyStats = () => {
    const monthTrades = trades.filter(trade => {
      const tradeDate = new Date(trade.date);
      return tradeDate.getMonth() === selectedMonth && 
             tradeDate.getFullYear() === selectedYear && 
             trade.type === 'Trade';
    });

    const totalPL = monthTrades.reduce((sum, trade) => sum + trade.gainLoss - trade.fees, 0);
    const tradingDays = new Set(monthTrades.map(trade => trade.date)).size;

    return { totalPL, tradingDays };
  };

  const calendarDays = getCalendarData();
  const weeklySummary = getWeeklySummary();
  const monthlyStats = getMonthlyStats();

  const getCellColor = (dayData: DayData | null) => {
    if (!dayData || dayData.tradeCount === 0) return 'bg-blue-100';
    
    if (dayData.totalPL > 0) {
      return dayData.totalPL > 1000 ? 'bg-green-200' : 'bg-green-100';
    } else if (dayData.totalPL < 0) {
      return dayData.totalPL < -1000 ? 'bg-red-200' : 'bg-red-100';
    }
    return 'bg-yellow-100';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'cursive' }}>Smart Calendar</h1>
        <div className="flex justify-between items-center mt-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-700 uppercase">
              {months[selectedMonth]} {selectedYear}
            </h2>
            <p className="text-sm text-gray-500 uppercase tracking-wider">PROFIT CALENDAR</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="space-y-4">
          {/* Calendar Controls */}
          <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CALENDAR START</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-pink-50">
                <option>Monday</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">MONTH</label>
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-pink-50"
              >
                {months.map((month, index) => (
                  <option key={month} value={index}>{month}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">YEAR</label>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-pink-50"
              >
                {[2023, 2024, 2025, 2026].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ACCOUNT</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-pink-50">
                <option>All</option>
              </select>
            </div>
          </div>

          {/* Monthly Stats */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-center bg-pink-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">MONTHLY STATS</h3>
              <div className="text-2xl font-bold text-green-600 mb-1">
                {formatCurrency(monthlyStats.totalPL)}
              </div>
              <div className="text-sm text-gray-600">{monthlyStats.tradingDays} Days</div>
            </div>
          </div>

          {/* Today */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-center bg-pink-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">TODAY</h3>
              <div className="text-sm font-medium">{new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Calendar Header */}
            <div className="grid grid-cols-7 bg-pink-400">
              {daysOfWeek.map(day => (
                <div key={day} className="p-3 text-center text-white text-sm font-medium">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Body */}
            <div className="grid grid-cols-7">
              {calendarDays.map((dayData, index) => (
                <div
                  key={index}
                  className={`h-24 border border-gray-200 p-1 ${getCellColor(dayData)}`}
                >
                  {dayData && (
                    <div className="h-full flex flex-col justify-between text-xs">
                      <div className="font-medium text-gray-800">{dayData.date}</div>
                      {dayData.tradeCount > 0 && (
                        <div className="space-y-1">
                          <div className={`font-bold ${dayData.totalPL > 0 ? 'text-green-700' : dayData.totalPL < 0 ? 'text-red-700' : 'text-gray-700'}`}>
                            {dayData.totalPL > 0 ? '▲' : dayData.totalPL < 0 ? '▼' : '='}{formatCurrency(Math.abs(dayData.totalPL))}
                          </div>
                          <div className="text-gray-600">
                            {dayData.tradeCount} Trade{dayData.tradeCount !== 1 ? 's' : ''}
                          </div>
                          <div className="text-gray-600">
                            {dayData.winRate.toFixed(0)}%
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Summary */}
        <div className="space-y-4">
          {weeklySummary.map((week, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-center bg-pink-100 rounded-lg p-3">
                <h3 className="text-sm font-medium text-gray-700 mb-2">WEEK {week.weekNumber}</h3>
                <div className={`text-lg font-bold mb-1 ${week.totalPL > 0 ? 'text-green-600' : week.totalPL < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  {week.totalPL > 0 ? '+' : ''}{formatCurrency(week.totalPL)}
                </div>
                <div className="text-sm text-gray-600">{week.days} Day{week.days !== 1 ? 's' : ''}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};