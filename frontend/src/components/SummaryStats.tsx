import React from 'react';
import { DashboardSummary } from '../types';

interface Props {
  summary: DashboardSummary;
}

const SummaryStats: React.FC<Props> = ({ summary }) => {

  const stats = [
    {
      label: 'Total',
      value: summary.total,
      color: 'text-white',
      bg: 'bg-gray-800 border-gray-700',
      icon: '📡',
    },
    {
      label: 'UP',
      value: summary.up,
      color: 'text-green-400',
      bg: 'bg-green-500/10 border-green-500/30',
      icon: '✅',
    },
    {
      label: 'DOWN',
      value: summary.down,
      color: 'text-red-400',
      bg: 'bg-red-500/10 border-red-500/30',
      icon: '❌',
    },
    {
      label: 'SLOW',
      value: summary.slow,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10 border-yellow-500/30',
      icon: '🐢',
    },
    {
      label: 'PENDING',
      value: summary.pending,
      color: 'text-gray-400',
      bg: 'bg-gray-500/10 border-gray-500/30',
      icon: '⏳',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      {stats.map((stat) => (
        <div key={stat.label}
             className={`border rounded-xl p-4 ${stat.bg}`}>
          <div className="text-2xl mb-1">{stat.icon}</div>
          <div className={`text-2xl font-bold ${stat.color}`}>
            {stat.value}
          </div>
          <div className="text-gray-400 text-xs font-medium mt-0.5">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryStats;