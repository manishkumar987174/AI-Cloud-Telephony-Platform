import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function Dashboard() {
  // Mock data for weekly calls
  const chartData = [
    { day: 'Mon', calls: 140 },
    { day: 'Tue', calls: 220 },
    { day: 'Wed', calls: 190 },
    { day: 'Thu', calls: 350 },
    { day: 'Fri', calls: 280 },
    { day: 'Sat', calls: 80 },
    { day: 'Sun', calls: 95 }
  ];

  // Mock list of active agents
  const activeAgents = [
    { name: 'Sarah Connor', role: 'Support Agent', status: 'busy', calls: 24 },
    { name: 'John Doe', role: 'Sales Specialist', status: 'idle', calls: 18 },
    { name: 'Ellen Ripley', role: 'Technical Lead', status: 'busy', calls: 32 },
    { name: 'Marcus Wright', role: 'Billing Agent', status: 'offline', calls: 12 }
  ];

  // Mock recent calls list
  const recentCalls = [
    { number: '+1 (555) 019-2834', name: 'James Carter', duration: '3m 45s', status: 'answered', time: '10 mins ago' },
    { number: '+1 (555) 014-9821', name: 'Jane Foster', duration: '0m 00s', status: 'failed', time: '14 mins ago' },
    { number: '+1 (555) 012-7493', name: 'Bruce Banner', duration: '8m 12s', status: 'answered', time: '22 mins ago' },
    { number: '+1 (555) 017-3849', name: 'Diana Prince', duration: '1m 24s', status: 'busy', time: '35 mins ago' }
  ];

  return (
    <div className="space-y-6 text-slate-300">
      {/* Top Banner with Gradient */}
      <div className="relative p-6 bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-indigo-500/10 to-transparent blur-2xl"></div>
        <h1 className="text-xl font-bold text-white tracking-wide">Good evening, Administrator</h1>
        <p className="text-slate-400 text-xs mt-1">Here is what is happening with your cloud telephony platform today.</p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* KPI 1 */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between hover:border-slate-700/80 transition-all duration-200 shadow-md">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Calls</span>
            <h3 className="text-2xl font-bold text-white tracking-tight">1,482</h3>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
              ▲ +12% <span className="text-slate-500 font-normal">from yesterday</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between hover:border-slate-700/80 transition-all duration-200 shadow-md">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Success Rate</span>
            <h3 className="text-2xl font-bold text-white tracking-tight">78.5%</h3>
            <span className="text-[10px] text-indigo-400 font-semibold">Average Call Duration: 2.5m</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between hover:border-slate-700/80 transition-all duration-200 shadow-md">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Campaigns</span>
            <h3 className="text-2xl font-bold text-white tracking-tight">3 / 5</h3>
            <span className="text-[10px] text-slate-400 font-semibold"><span className="text-cyan-400">2,400</span> Contacts Queue</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between hover:border-slate-700/80 transition-all duration-200 shadow-md">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Wallet Balance</span>
            <h3 className="text-2xl font-bold text-white tracking-tight">100.00 INR</h3>
            <span className="text-[10px] text-cyan-400 font-semibold cursor-pointer hover:underline">Recharge Balance</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content: Chart + Agents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Call Analytics Chart */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl lg:col-span-2 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide">Weekly Call Analytics</h3>
            <span className="text-[10px] text-slate-400">Total calls handled per day over the current week</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#a5b4fc', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="calls" stroke="#6366F1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCalls)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agent Monitor */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide">Live Agent Status</h3>
            <span className="text-[10px] text-slate-400">Real-time status of agent extensions</span>
          </div>
          <div className="space-y-3">
            {activeAgents.map((agent) => (
              <div key={agent.name} className="flex items-center justify-between p-3 bg-slate-950/40 border border-slate-800/60 rounded-xl hover:border-slate-700/55 transition duration-150">
                <div className="flex items-center gap-3">
                  {/* Initial Avatar */}
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 font-semibold text-xs border border-slate-700/60">
                    {agent.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">{agent.name}</h4>
                    <span className="text-[9px] text-slate-500">{agent.role}</span>
                  </div>
                </div>
                {/* Status Badge */}
                <div className="flex flex-col items-end gap-1">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase ${
                    agent.status === 'busy' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    agent.status === 'idle' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                  }`}>
                    {agent.status}
                  </span>
                  <span className="text-[9px] text-slate-400">{agent.calls} calls</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide">Recent Calls</h3>
          <span className="text-[10px] text-slate-400">List of latest incoming and outgoing calls</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentCalls.map((call, idx) => (
                <tr key={idx} className="border-b border-slate-800/40 hover:bg-slate-950/20 transition duration-150">
                  <td className="py-3.5 px-4 font-medium text-white flex flex-col">
                    <span>{call.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5">{call.number}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">{call.duration}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      call.status === 'answered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      call.status === 'busy' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {call.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{call.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
