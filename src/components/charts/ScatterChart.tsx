import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface ScatterChartProps {
  data: any;
  options?: any;
  height?: number;
  type?: 'time' | 'duration';
}

export const ScatterChart: React.FC<ScatterChartProps> = ({ data, options = {}, height = 200, type = 'time' }) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.parsed.y;
            const xValue = context.parsed.x;
            let xLabel = '';
            
            if (type === 'time') {
              const hour = Math.floor(xValue);
              const minute = Math.floor((xValue - hour) * 60);
              xLabel = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            } else {
              const totalMinutes = Math.floor(xValue);
              const hours = Math.floor(totalMinutes / 60);
              const minutes = totalMinutes % 60;
              if (hours > 0) {
                xLabel = `${hours}h${minutes > 0 ? minutes + 'm' : ''}`;
              } else {
                xLabel = `${minutes}m`;
              }
            }
            
            return `${xLabel}: $${value.toFixed(2)}`;
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        type: 'linear' as const,
        display: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#666',
          font: {
            size: 11,
          },
          callback: function(value: any) {
            if (type === 'time') {
              const hour = Math.floor(value);
              return `${hour.toString().padStart(2, '0')}:00`;
            } else {
              const totalMinutes = Math.floor(value);
              const hours = Math.floor(totalMinutes / 60);
              const minutes = totalMinutes % 60;
              if (totalMinutes < 60) {
                return `${totalMinutes}m`;
              } else if (totalMinutes < 1440) { // Less than 24 hours
                return `${hours}h${minutes > 0 ? minutes + 'm' : ''}`;
              } else {
                const days = Math.floor(hours / 24);
                const remainingHours = hours % 24;
                return `${days}d${remainingHours > 0 ? remainingHours + 'h' : ''}`;
              }
            }
          },
          maxTicksLimit: type === 'time' ? 12 : 8,
        },
        title: {
          display: false,
        }
      },
      y: {
        display: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#666',
          font: {
            size: 11,
          },
          callback: function(value: any) {
            return `$${value}`;
          }
        },
        title: {
          display: false,
        }
      },
    },
    elements: {
      point: {
        radius: 4,
        borderWidth: 0,
        backgroundColor: function(context: any) {
          return context.parsed.y >= 0 ? '#10B981' : '#EF4444';
        },
        hoverRadius: 6,
        hoverBorderWidth: 2,
        hoverBorderColor: function(context: any) {
          return context.parsed.y >= 0 ? '#059669' : '#DC2626';
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'point' as const,
    },
    ...options,
  };

  return (
    <div style={{ height }}>
      <Scatter data={data} options={defaultOptions} />
    </div>
  );
};