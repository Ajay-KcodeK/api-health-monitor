import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { getHealthHistoryApi } from '../api/health';
import { HealthCheckResponse } from '../types';

interface Props {
  endpointId: number;
  endpointName: string;
}

const HistoryChart: React.FC<Props> = ({ endpointId, endpointName }) => {
  const [history, setHistory] = useState<HealthCheckResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch history whenever selected endpoint changes
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await getHealthHistoryApi(endpointId);
        // Reverse so oldest is left, newest is right on chart
        setHistory(data.reverse());
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [endpointId]); // re-runs whenever endpointId changes

  // Format data for Recharts
  const chartData = history.map((h, index) => ({
    index: index + 1,
    responseTime: h.responseTime,
    status: h.status,
    time: new Date(h.checkedAt).toLocaleTimeString(),
  }));

  // Custom tooltip shown on hover
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs">
          <p className="text-gray-400">{d.time}</p>
          <p className="text-white font-medium">{d.responseTime}ms</p>
          <p className={
            d.status === 'UP' ? 'text-green-400' :
            d.status === 'SLOW' ? 'text-yellow-400' : 'text-red-400'
          }>
            {d.status}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mt-4">
        <div className="text-gray-400 text-sm text-center py-8">
          Loading history...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-blue-500/30 rounded-xl p-6 mt-4">
      <h3 className="text-white font-semibold mb-1">
        Response Time History
      </h3>
      <p className="text-gray-500 text-xs mb-6">
        {endpointName} — last {history.length} checks
      </p>

      {history.length === 0 ? (
        <div className="text-gray-500 text-sm text-center py-8">
          No history yet — waiting for first check...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              {/* Gradient fill under the line */}
              <linearGradient id="responseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />

            <XAxis
              dataKey="time"
              tick={{ fill: '#6b7280', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tick={{ fill: '#6b7280', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}ms`}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* SLOW threshold line at 2000ms */}
            <ReferenceLine
              y={2000}
              stroke="#eab308"
              strokeDasharray="4 4"
              label={{ value: 'SLOW', fill: '#eab308', fontSize: 10 }}
            />

            <Area
              type="monotone"
              dataKey="responseTime"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#responseGradient)"
              dot={{ fill: '#3b82f6', r: 3 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default HistoryChart;