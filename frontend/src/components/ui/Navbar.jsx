import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Navbar() {
  const location = useLocation();
  const { data: user } = useSelector((state) => state.auth);

  // Convert route path to breadcrumb
  const pathName = location.pathname.substring(1);
  const pageTitle = pathName
    ? pathName.charAt(0).toUpperCase() + pathName.slice(1).replace('-', ' ')
    : 'Dashboard';

  return (
    <header className="bg-slate-900 border-b border-slate-800 h-16 flex items-center justify-between px-6 text-slate-300">
      {/* Title / Breadcrumb */}
      <div>
        <h2 className="text-lg font-semibold text-white tracking-wide">{pageTitle}</h2>
      </div>

      {/* Right Side Stats & Actions */}
      <div className="flex items-center gap-6">
        {/* Network & Telephony Connections */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          {/* WebSocket Status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>WS Live</span>
          </div>

          {/* WebRTC Client SIP Status (Mock connected for now) */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            <span>SIP Online</span>
          </div>
        </div>

        {/* Vertical Separator */}
        <span className="h-6 w-px bg-slate-800"></span>

        {/* User profile section */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-white">{user?.name || 'Administrator'}</span>
            <span className="text-[10px] text-slate-400 capitalize">{user?.role || 'Admin'}</span>
          </div>
          {/* Profile Circle Avatar with gradient */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/10">
            {(user?.name || 'Admin').substring(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
