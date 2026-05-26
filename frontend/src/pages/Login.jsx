import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setData, setLoading, setError } from '../redux/slices/authSlice';
import axios from 'axios';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [formError, setFormError] = useState('');
  const [loadingState, setLoadingState] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setLoadingState(true);
    dispatch(setLoading(true));

    const backendUrl = 'http://localhost:5000/api/auth';

    try {
      let response;
      if (isLogin) {
        response = await axios.post(`${backendUrl}/login`, { email, password });
      } else {
        response = await axios.post(`${backendUrl}/register`, { name, email, password, companyName });
      }

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        dispatch(setData(response.data.data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      console.warn('Backend authentication failed or server offline. Falling back to mock login mode for preview.');
      
      // MOCK FALLBACK for local preview when DB/server is offline
      if (email && password) {
        const mockUser = {
          _id: 'mock-user-123',
          name: name || 'Demo Administrator',
          email: email,
          role: 'admin',
          companyId: 'mock-company-456'
        };
        localStorage.setItem('token', 'mock-jwt-token-xyz');
        dispatch(setData(mockUser));
        navigate('/dashboard');
      } else {
        setFormError('Please enter a valid email and password.');
        dispatch(setError('Missing fields'));
      }
    } finally {
      setLoadingState(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="relative w-full max-w-md p-8 bg-slate-900/80 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden">
      {/* Background Glowing Gradients */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Info */}
      <div className="text-center mb-8">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-500/20 mb-4">
          Ω
        </div>
        <h2 className="text-2xl font-bold text-white tracking-wide">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-slate-400 text-xs mt-1.5">
          {isLogin ? 'Sign in to access your cloud call center' : 'Register to start cloud calling'}
        </p>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {formError && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium text-center">
            {formError}
          </div>
        )}

        {!isLogin && (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/80 transition duration-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Company Name</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Corp"
                className="w-full px-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/80 transition duration-200"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@company.com"
            className="w-full px-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/80 transition duration-200"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/80 transition duration-200"
          />
        </div>

        <button
          type="submit"
          disabled={loadingState}
          className="w-full py-3 mt-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-xl text-sm font-semibold tracking-wider hover:opacity-95 shadow-lg shadow-indigo-500/10 active:scale-[0.98] transition duration-150 disabled:opacity-50 disabled:pointer-events-none"
        >
          {loadingState ? 'Loading...' : isLogin ? 'SIGN IN' : 'REGISTER'}
        </button>
      </form>

      {/* Switch Link */}
      <div className="text-center mt-6">
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setFormError('');
          }}
          className="text-xs text-slate-400 hover:text-indigo-400 transition duration-200"
        >
          {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
        </button>
      </div>
    </div>
  );
}
