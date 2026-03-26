import React, { useState } from 'react';
import { getInsightsApi } from '../api/insights';
import { InsightResponse } from '../types';

interface Props {
  endpointId: number;
  endpointName: string;
}

const AiInsightPanel: React.FC<Props> = ({ endpointId, endpointName }) => {
  const [insight, setInsight] = useState<InsightResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchInsight = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getInsightsApi(endpointId);
      setInsight(data);
    } catch (err) {
      setError('Failed to get AI insights. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-purple-500/30
                    rounded-xl p-6 mt-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <h3 className="text-white font-semibold">AI Insights</h3>
          <span className="bg-purple-500/20 text-purple-400 border
                           border-purple-500/30 text-xs px-2 py-0.5
                           rounded-full">
            Powered by OpenAI
          </span>
        </div>

        <button
          onClick={fetchInsight}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800
                     disabled:cursor-not-allowed text-white px-4 py-2
                     rounded-lg text-sm font-medium transition-colors
                     flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin">⟳</span>
              Analyzing...
            </>
          ) : (
            <>✨ Get Insights</>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30
                        text-red-400 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Insight result */}
      {insight && !loading && (
        <div className="space-y-3">
          <div className="bg-purple-500/10 border border-purple-500/20
                          rounded-lg p-4">
            <p className="text-gray-200 text-sm leading-relaxed">
              {insight.insight}
            </p>
          </div>
          <p className="text-gray-600 text-xs">
            Generated at {insight.generatedAt}
          </p>
        </div>
      )}

      {/* Empty state */}
      {!insight && !loading && !error && (
        <p className="text-gray-500 text-sm">
          Click "Get Insights" to analyze this endpoint's
          health patterns using AI.
        </p>
      )}
    </div>
  );
};

export default AiInsightPanel;