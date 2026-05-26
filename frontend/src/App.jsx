import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Campaigns from './pages/Campaigns'
import Dialer from './pages/Dialer'
import CallLogs from './pages/CallLogs'
import Recordings from './pages/Recordings'
import Reports from './pages/Reports'
import Billing from './pages/Billing'
import Settings from './pages/Settings'
import IVR from './pages/IVR'
import Contacts from './pages/Contacts'
import Agents from './pages/Agents'
import PrivateRoute from './components/ui/PrivateRoute'

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path='/login' element={<Login />} />
      </Route>
      <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route path='/' element={<Navigate to='/dashboard' replace />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/campaigns' element={<Campaigns />} />
        <Route path='/dialer' element={<Dialer />} />
        <Route path='/contacts' element={<Contacts />} />
        <Route path='/call-logs' element={<CallLogs />} />
        <Route path='/recordings' element={<Recordings />} />
        <Route path='/ivr' element={<IVR />} />
        <Route path='/agents' element={<Agents />} />
        <Route path='/reports' element={<Reports />} />
        <Route path='/billing' element={<Billing />} />
        <Route path='/settings' element={<Settings />} />
      </Route>
    </Routes>
  )
}
