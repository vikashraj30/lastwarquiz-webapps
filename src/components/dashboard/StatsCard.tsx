/**
 * Stats Card Component
 * Display statistics in a card format
 */

import React from 'react';
import Card from '../common/Card';

interface StatsCardProps {
  icon: string;
  value: string | number;
  label: string;
  color?: 'indigo' | 'purple' | 'green' | 'yellow' | 'blue' | 'pink' | 'red';
}

/**
 * Stats card component
 * @param props - Stats card props
 */
const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  value,
  label,
  color = 'indigo',
}) => {
  const colorClasses = {
    indigo: 'bg-indigo-50 text-indigo-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    blue: 'bg-blue-50 text-blue-600',
    pink: 'bg-pink-50 text-pink-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <Card className={`p-6 ${colorClasses[color]}`}>
      <div className="text-center">
        <div className="text-4xl mb-2">{icon}</div>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-sm font-medium opacity-75">{label}</div>
      </div>
    </Card>
  );
};

export default StatsCard;

