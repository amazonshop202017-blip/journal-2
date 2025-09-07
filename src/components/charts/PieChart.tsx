import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: any;
  options?: any;
  height?: number;
}

export const PieChart: React.FC<PieChartProps> = ({ data, options = {}, height = 200 }) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
    },
    ...options,
  };

  return (
    <div style={{ height }}>
      <Pie data={data} options={defaultOptions} />
    </div>
  );
};