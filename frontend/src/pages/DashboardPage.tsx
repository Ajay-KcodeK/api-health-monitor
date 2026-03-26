import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { getDashboardSummaryApi, deleteEndpointApi } from "../api/endpoints";
import {
  DashboardSummary,
  EndpointResponse,
  HealthCheckUpdate,
} from "../types";
import SummaryStats from "../components/SummaryStats";
import AddEndpointForm from "../components/AddEndpointForm";
import EndpointCard from "../components/EndpointCard";
import HistoryChart from "../components/HistoryChart";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import useWebSocket from "../hooks/useWebSocket";
import AiInsightPanel from "../components/AiInsightPanel";

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch dashboard summary from API
  const fetchSummary = useCallback(async () => {
    try {
      const data = await getDashboardSummaryApi();
      setSummary(data);
    } catch (err) {
      console.error("Failed to fetch summary", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load on mount
  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    document.title = `Dashboard — API Health Monitor`;
  }, []);

  // WebSocket handler — called every time a health check arrives
  // This is where real-time magic happens
  const handleWebSocketUpdate = useCallback((update: HealthCheckUpdate) => {
    setSummary((prev) => {
      if (!prev) return prev;

      // Update just the one endpoint that changed
      // Don't refetch everything — just patch the state
      const updatedEndpoints = prev.endpoints.map((ep) => {
        if (ep.id === update.endpointId) {
          return {
            ...ep, // keep all existing fields
            lastStatus: update.status, // update status
            lastResponseTime: update.responseTime, // update response time
          };
        }
        return ep; // other endpoints unchanged
      });

      // Recalculate counts from updated endpoints
      const up = updatedEndpoints.filter((e) => e.lastStatus === "UP").length;
      const down = updatedEndpoints.filter(
        (e) => e.lastStatus === "DOWN",
      ).length;
      const slow = updatedEndpoints.filter(
        (e) => e.lastStatus === "SLOW",
      ).length;
      const pending = updatedEndpoints.filter(
        (e) => e.lastStatus === "PENDING",
      ).length;

      return {
        ...prev,
        endpoints: updatedEndpoints,
        up,
        down,
        slow,
        pending,
      };
    });
  }, []);

  // Connect to WebSocket — runs for entire dashboard lifetime
  useWebSocket(handleWebSocketUpdate);

  // Called when user adds a new endpoint
  const handleAdd = (newEndpoint: EndpointResponse) => {
    setSummary((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        endpoints: [newEndpoint, ...prev.endpoints], // add to top
        total: prev.total + 1,
        pending: prev.pending + 1,
      };
    });
  };

  // Called when user clicks delete — shows modal
  const handleDelete = (id: number) => {
    setPendingDeleteId(id);
  };

  // Called when user confirms delete in modal
  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    const id = pendingDeleteId;

    setIsDeleting(true);
    try {
      await deleteEndpointApi(id);

      setSummary((prev) => {
        if (!prev) return prev;
        const removed = prev.endpoints.find((e) => e.id === id);
        const updatedEndpoints = prev.endpoints.filter((e) => e.id !== id);
        return {
          ...prev,
          endpoints: updatedEndpoints,
          total: prev.total - 1,
          up: removed?.lastStatus === "UP" ? prev.up - 1 : prev.up,
          down: removed?.lastStatus === "DOWN" ? prev.down - 1 : prev.down,
          slow: removed?.lastStatus === "SLOW" ? prev.slow - 1 : prev.slow,
          pending:
            removed?.lastStatus === "PENDING" ? prev.pending - 1 : prev.pending,
        };
      });

      if (selectedId === id) setSelectedId(null);
      setPendingDeleteId(null);
    } catch (err) {
      // keep modal open so user can retry
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle selection — click same card to deselect
  const handleSelect = (id: number) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400 text-sm animate-pulse">
          Loading dashboard...
        </div>
      </div>
    );
  }

  const selectedEndpoint = summary?.endpoints.find((e) => e.id === selectedId);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navbar */}
      <nav
        className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm
                      sticky top-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔍</span>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">
                API Health Monitor
              </h1>
              <p className="text-gray-500 text-xs mt-0.5">
                Real-time monitoring dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Live indicator */}
            <div className="flex items-center gap-1.5 text-green-400 text-xs">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              LIVE
            </div>

            <span className="text-gray-500 text-sm hidden md:block">
              {user?.name}
            </span>

            <button
              onClick={logout}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300
                         px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Summary stats */}
        {summary && <SummaryStats summary={summary} />}

        {/* Add endpoint form */}
        <AddEndpointForm onAdd={handleAdd} />

        {/* Endpoints list */}
        {summary?.endpoints.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📡</div>
            <p className="text-gray-400 text-lg font-medium">
              No endpoints yet
            </p>
            <p className="text-gray-600 text-sm mt-1">
              Add your first API endpoint above to start monitoring
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {summary?.endpoints.map((endpoint) => (
              <React.Fragment key={endpoint.id}>
                <EndpointCard
                  endpoint={endpoint}
                  onDelete={handleDelete}
                  onSelect={handleSelect}
                  isSelected={selectedId === endpoint.id}
                />
                {selectedId === endpoint.id && selectedEndpoint && (
                  <>
                    <HistoryChart
                      endpointId={endpoint.id}
                      endpointName={endpoint.name}
                    />
                    <AiInsightPanel
                      endpointId={endpoint.id}
                      endpointName={endpoint.name}
                    />
                  </>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </main>
      {/* Delete confirmation modal */}
      {pendingDeleteId && (
        <ConfirmDeleteModal
          endpointName={
            summary?.endpoints.find((e) => e.id === pendingDeleteId)?.name ?? ""
          }
          isDeleting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => !isDeleting && setPendingDeleteId(null)}
        />
      )}
    </div>
  );
};

export default DashboardPage;
