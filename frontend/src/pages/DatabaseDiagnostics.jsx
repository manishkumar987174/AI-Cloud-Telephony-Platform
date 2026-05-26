import { useState, useEffect } from 'react';
import axios from 'axios';

export default function DatabaseDiagnostics() {
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState(null);
  const [diagnostics, setDiagnostics] = useState(null);
  const [error, setError] = useState(null);

  // Fetch database diagnostics on load
  const fetchDiagnostics = async () => {
    setLoading(true);
    try {
      // Use direct local url for backend API
      const response = await axios.get('http://localhost:5000/api/database/diagnostics');
      if (response.data.success) {
        setDiagnostics(response.data.data);
        setError(null);
      } else {
        setError('Failed to fetch diagnostic data');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Cannot connect to backend diagnostics API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  // Handle re-seeding mock database
  const triggerSeeding = async () => {
    setSeeding(true);
    setSeedResult(null);
    try {
      const response = await axios.post('http://localhost:5000/api/database/seed');
      if (response.data.success) {
        setSeedResult({ status: 'success', message: response.data.message });
        // Refresh diagnostics
        await fetchDiagnostics();
      } else {
        setSeedResult({ status: 'error', message: 'Seeding reported failure' });
      }
    } catch (err) {
      setSeedResult({ status: 'error', message: err.response?.data?.error?.message || err.message });
    } finally {
      setSeeding(false);
    }
  };

  if (loading && !diagnostics) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 text-sm font-medium">Running database diagnostics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-300">
      {/* Header Banner */}
      <div className="relative p-6 bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-indigo-500/10 to-transparent blur-2xl"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">Database Schema Diagnostics</h1>
            <p className="text-slate-400 text-xs mt-1">Verify Phase 2 tables, relationships, indexes, and SaaS isolation parameters.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchDiagnostics}
              disabled={loading}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/80 text-white rounded-xl text-xs font-semibold tracking-wide transition duration-150 flex items-center gap-1.5"
            >
              <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
              </svg>
              Refresh
            </button>
            <button
              onClick={triggerSeeding}
              disabled={seeding}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold tracking-wide transition duration-150 flex items-center gap-1.5 shadow-md shadow-indigo-500/10"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {seeding ? 'Seeding...' : 'Seed Database'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            {error}
          </div>
        )}

        {seedResult && (
          <div className={`mt-4 p-3 border rounded-xl text-xs flex items-center gap-2 ${
            seedResult.status === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${seedResult.status === 'success' ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
            {seedResult.message}
          </div>
        )}
      </div>

      {diagnostics && (
        <>
          {/* Health & Latency Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between hover:border-slate-700/80 transition-all duration-200 shadow-md">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">MySQL Health</span>
                <h3 className="text-2xl font-bold text-white tracking-tight capitalize">{diagnostics.connection.status}</h3>
                <span className="text-[10px] text-cyan-400 font-semibold">Active Port: 3306</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between hover:border-slate-700/80 transition-all duration-200 shadow-md">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">DB Latency</span>
                <h3 className="text-2xl font-bold text-white tracking-tight">{diagnostics.connection.latencyMs} ms</h3>
                <span className="text-[10px] text-indigo-400 font-semibold">Prisma Engine connection</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between hover:border-slate-700/80 transition-all duration-200 shadow-md">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">SaaS Isolation</span>
                <h3 className="text-2xl font-bold text-white tracking-tight">Active</h3>
                <span className="text-[10px] text-cyan-400 font-semibold">`company_id` rule enforced</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between hover:border-slate-700/80 transition-all duration-200 shadow-md">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Companies</span>
                <h3 className="text-2xl font-bold text-white tracking-tight">{diagnostics.counts.companies} Tenants</h3>
                <span className="text-[10px] text-emerald-400 font-semibold">{diagnostics.counts.users} Active Users</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          {/* Table Counts Detail Panel */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide">Phase 2 Table Counts & Storage</h3>
              <span className="text-[10px] text-slate-400">Verify that all 8 database models are successfully mapped in MySQL</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-950/50 p-4 border border-slate-800/80 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">companies</span>
                <h4 className="text-lg font-bold text-white">{diagnostics.counts.companies} rows</h4>
                <p className="text-[9px] text-slate-500">Auto-incrementing PK</p>
              </div>
              <div className="bg-slate-950/50 p-4 border border-slate-800/80 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">users</span>
                <h4 className="text-lg font-bold text-white">{diagnostics.counts.users} rows</h4>
                <p className="text-[9px] text-slate-500">Linked to company_id</p>
              </div>
              <div className="bg-slate-950/50 p-4 border border-slate-800/80 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">campaigns</span>
                <h4 className="text-lg font-bold text-white">{diagnostics.counts.campaigns} rows</h4>
                <p className="text-[9px] text-slate-500">AutoDialer campaigns</p>
              </div>
              <div className="bg-slate-950/50 p-4 border border-slate-800/80 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">contacts</span>
                <h4 className="text-lg font-bold text-white">{diagnostics.counts.contacts} rows</h4>
                <p className="text-[9px] text-slate-500">idx_campaign mapped</p>
              </div>
              <div className="bg-slate-950/50 p-4 border border-slate-800/80 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">call_logs</span>
                <h4 className="text-lg font-bold text-white">{diagnostics.counts.callLogs} rows</h4>
                <p className="text-[9px] text-slate-500">Indexed call histories</p>
              </div>
              <div className="bg-slate-950/50 p-4 border border-slate-800/80 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">recordings</span>
                <h4 className="text-lg font-bold text-white">{diagnostics.counts.recordings} rows</h4>
                <p className="text-[9px] text-slate-500">Cascade relation to call</p>
              </div>
              <div className="bg-slate-950/50 p-4 border border-slate-800/80 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">wallets</span>
                <h4 className="text-lg font-bold text-white">{diagnostics.counts.wallets} rows</h4>
                <p className="text-[9px] text-slate-500">One-to-one company link</p>
              </div>
              <div className="bg-slate-950/50 p-4 border border-slate-800/80 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">transactions</span>
                <h4 className="text-lg font-bold text-white">{diagnostics.counts.transactions} rows</h4>
                <p className="text-[9px] text-slate-500">Ledger accounting trail</p>
              </div>
            </div>
          </div>

          {/* Relations Preview Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Call Logs Relation Check */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wide">Call Log Relations Mappings</h3>
                <span className="text-[10px] text-slate-400">Verifying CallLog ➔ Company, User, & Campaign relations</span>
              </div>
              <div className="space-y-3">
                {diagnostics.preview.latestCalls.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3">No call logs found. Seed the database to verify relations!</p>
                ) : (
                  diagnostics.preview.latestCalls.map((call) => (
                    <div key={call.id} className="p-3 bg-slate-950/30 border border-slate-800/60 rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-indigo-400">{call.company?.name || 'Unknown Company'}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                          call.status === 'answered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>{call.status}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                        <div>📞 Phone: <span className="text-slate-200 font-mono">{call.phoneNumber}</span></div>
                        <div>⏱️ Duration: <span className="text-slate-200">{call.duration} seconds</span></div>
                        <div>👤 Agent: <span className="text-slate-200">{call.agent?.name || 'System AutoDialer'}</span></div>
                        <div>📢 Campaign: <span className="text-slate-200">{call.campaign?.name || 'Direct Dialer'}</span></div>
                      </div>
                      {call.recordingUrl && (
                        <div className="text-[9px] bg-slate-900/60 border border-slate-800/40 p-2 rounded text-slate-500 truncate">
                          📁 Rec Path: <span className="text-cyan-400/80">{call.recordingUrl}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Ledger Transactions Relation Check */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wide">Billing Ledger & SaaS Isolation</h3>
                <span className="text-[10px] text-slate-400">Verifying Company ➔ Wallet ➔ Transaction linkages</span>
              </div>
              <div className="space-y-3">
                {diagnostics.preview.latestTransactions.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3">No billing ledger items found. Seed the database to verify ledger!</p>
                ) : (
                  diagnostics.preview.latestTransactions.map((tx) => (
                    <div key={tx.id} className="p-3 bg-slate-950/30 border border-slate-800/60 rounded-xl flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">{tx.company?.name || 'Unknown Company'}</span>
                        </div>
                        <p className="text-[10px] text-slate-400">{tx.description}</p>
                        <p className="text-[9px] text-slate-500">{new Date(tx.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                          tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>{tx.type}</span>
                        <h4 className="text-xs font-bold text-white mt-1">{tx.type === 'credit' ? '+' : '-'}{Number(tx.amount).toFixed(2)} INR</h4>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
