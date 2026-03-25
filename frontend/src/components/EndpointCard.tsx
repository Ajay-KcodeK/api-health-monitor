import React from 'react';
import { EndpointResponse } from '../types';
import StatusBadge from './StatusBadge';

interface Props {
  endpoint: EndpointResponse;
  onDelete: (id: number) => void;
  onSelect: (id: number) => void;
  isSelected: boolean;
}

const EndpointCard: React.FC<Props> = ({
  endpoint,
  onDelete,
  onSelect,
  isSelected
}) => {

  // Format response time nicely
  const formatTime = (ms: number | null) => {
    if (ms === null) return '—';
    if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
    return `${ms}ms`;
  };

  // Format date to readable string
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div
      onClick={() => onSelect(endpoint.id)}
      className={`bg-gray-900 border rounded-xl p-5 cursor-pointer
                  transition-all duration-200 hover:border-gray-600
                  ${isSelected
                    ? 'border-blue-500 ring-1 ring-blue-500/50'
                    : 'border-gray-800'
                  }`}
    >
      <div className="flex items-start justify-between gap-4">

        {/* Left side — name + url + status */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-white font-semibold truncate">
              {endpoint.name}
            </h3>
            <StatusBadge status={endpoint.lastStatus} />
          </div>

          <p className="text-gray-500 text-sm truncate mb-3">
            {endpoint.url}
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>
              Response:{' '}
              <span className="text-gray-300 font-medium">
                {formatTime(endpoint.lastResponseTime)}
              </span>
            </span>
            <span>
              Added:{' '}
              <span className="text-gray-300">
                {formatDate(endpoint.createdAt)}
              </span>
            </span>
          </div>
        </div>

        {/* Right side — delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent card click when deleting
            onDelete(endpoint.id);
          }}
          className="text-gray-600 hover:text-red-400 hover:bg-red-500/10
                     p-2 rounded-lg transition-colors flex-shrink-0"
          title="Delete endpoint"
        >
          🗑
        </button>

      </div>

      {/* Click to view history hint */}
      {isSelected && (
        <p className="text-blue-400 text-xs mt-3 font-medium">
          ↓ Viewing response history below
        </p>
      )}
    </div>
  );
};

export default EndpointCard;