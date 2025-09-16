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
}

export const ScatterChart: React.FC<ScatterChartProps> = ({ data, options = {}, height = 200 }) => {
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
            return `P&L: $${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: '#f3f4f6',
        },
        title: {
          display: true,
          text: options.xAxisTitle || 'Time'
        }
      },
      y: {
        display: true,
        grid: {
          color: '#f3f4f6',
        },
        title: {
          display: true,
          text: 'P&L ($)'
        }
      },
    },
    elements: {
      point: {
        radius: 6,
        borderWidth: 2,
        backgroundColor: function(context: any) {
          return context.parsed.y >= 0 ? '#10B981' : '#EF4444';
        },
        borderColor: function(context: any) {
          return context.parsed.y >= 0 ? '#059669' : '#DC2626';
        }
      }
    },
    ...options,
  };

  return (
    <div style={{ height }}>
      <Scatter data={data} options={defaultOptions} />
    </div>
  );
};