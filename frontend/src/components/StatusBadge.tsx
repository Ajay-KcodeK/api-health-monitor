import React from 'react';

interface Props {
  status: 'UP' | 'DOWN' | 'SLOW' | 'PENDING';
}

const StatusBadge: React.FC<Props> = ({ status }) => {

  // Map each status to its own color scheme
  const styles = {
    UP:      'bg-green-500/20  text-green-400  border-green-500/50',
    DOWN:    'bg-red-500/20    text-red-400    border-red-500/50',
    SLOW:    'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    PENDING: 'bg-gray-500/20  text-gray-400   border-gray-500/50',
  };

  const dots = {
    UP:      'bg-green-400',
    DOWN:    'bg-red-400',
    SLOW:    'bg-yellow-400',
    PENDING: 'bg-gray-400',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                      text-xs font-medium border ${styles[status]}`}>
      {/* Animated dot for UP status — shows it's live */}
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]} 
                        ${status === 'UP' ? 'animate-pulse' : ''}`} />
      {status}
    </span>
  );
};

export default StatusBadge;