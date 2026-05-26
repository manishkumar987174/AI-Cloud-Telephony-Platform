import { Outlet } from 'react-router-dom'
import Sidebar from '../components/ui/Sidebar'
import Navbar from '../components/ui/Navbar'

export default function MainLayout() {
  return (
    <div className='flex h-screen bg-slate-900'>
      <Sidebar />
      <div className='flex flex-col flex-1 overflow-hidden'>
        <Navbar />
        <main className='flex-1 overflow-y-auto p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
