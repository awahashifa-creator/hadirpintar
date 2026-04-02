import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  FileText, 
  Database, 
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const isAdmin = profile?.role === 'admin';

  const menuItems = [
    { name: 'Dashboard', path: '/app', icon: LayoutDashboard },
    { name: 'Absensi Guru', path: '/app/absensi-guru', icon: UserCheck },
    { name: 'Absensi Siswa', path: '/app/absensi-siswa', icon: Users },
    { 
      name: 'Rekap Absensi', 
      path: '/app/rekap', 
      icon: FileText,
      submenu: [
        ...(isAdmin ? [{ name: 'Absensi Guru', path: '/app/rekap-guru' }] : []),
        { name: 'Absensi Siswa', path: '/app/rekap-siswa' }
      ]
    },
    ...(isAdmin ? [{ name: 'Data Siswa', path: '/app/data-siswa', icon: Database }] : [])
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-gradient-to-b from-blue-900 to-blue-700 text-white flex flex-col sticky top-0 h-screen shadow-xl z-20"
      >
        <div className="p-6 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {isSidebarOpen && (
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xl font-bold tracking-tight text-sky-300"
              >
                HadirPintar
              </motion.h1>
            )}
          </AnimatePresence>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || item.submenu?.some(sub => location.pathname === sub.path);
            
            return (
              <div key={item.name}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                    isActive ? "bg-white/20 text-sky-300" : "hover:bg-white/10 text-blue-100"
                  )}
                >
                  <item.icon size={22} className={cn(isActive ? "text-sky-300" : "text-blue-300 group-hover:text-white")} />
                  {isSidebarOpen && <span className="font-medium">{item.name}</span>}
                </Link>
                
                {isSidebarOpen && item.submenu && isActive && (
                  <div className="ml-9 mt-1 space-y-1">
                    {item.submenu.map(sub => (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        className={cn(
                          "block px-3 py-2 text-sm rounded-lg transition-colors",
                          location.pathname === sub.path ? "text-sky-300 bg-white/5" : "text-blue-200 hover:text-white hover:bg-white/5"
                        )}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          {isSidebarOpen && (
            <div className="px-3 py-2 mb-4 bg-white/5 rounded-xl">
              <p className="text-xs text-blue-300 uppercase tracking-wider font-semibold">Logged in as</p>
              <p className="font-medium truncate">{profile?.full_name}</p>
              <p className="text-xs text-sky-400 capitalize">{profile?.role}</p>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="text-sm font-medium">App</span>
            <ChevronRight size={14} />
            <span className="text-sm font-semibold text-blue-600 capitalize">
              {location.pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
            </span>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </header>

        <main className="p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
