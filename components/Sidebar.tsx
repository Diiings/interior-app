'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  MapPin, 
  Truck, 
  History, 
  LogOut, 
  Warehouse,
  UserCircle,
  X // Tambahkan icon X untuk mobile close button
} from 'lucide-react';

// 1. TAMBAHKAN DEFINISI TIPE PROPS DI SINI
interface SidebarProps {
  role?: string;
  username?: string;
}

// 2. TERIMA PROPS DI SINI (Default value jika kosong)
export default function Sidebar({ role = "Admin", username = "User" }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Gudang Material', href: '/dashboard/materials', icon: Package },
    { name: 'Lokasi Proyek', href: '/dashboard/projects', icon: MapPin },
    { name: 'Surat Jalan', href: '/dashboard/transactions', icon: Truck },
    { name: 'Riwayat', href: '/dashboard/logs', icon: History },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0 border-r border-slate-800 shadow-xl z-20">
      
      {/* HEADER BRANDING */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="bg-slate-800 p-2 rounded-lg">
            <Warehouse className="text-yellow-500" size={24} />
            </div>
            <div>
            <h1 className="text-xl font-bold tracking-wide">
                Sto<span className="text-yellow-500">co</span>.
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Inventory System</p>
            </div>
        </div>
      </div>

      {/* MENU NAVIGASI */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <p className="text-xs font-bold text-slate-500 px-3 mb-2 uppercase">Menu Utama</p>

        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 translate-x-1'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-yellow-500 transition-colors'} />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* 3. PROFILE & LOGOUT (Gunakan Props Username & Role di sini) */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 mb-4 px-2">
          <UserCircle size={32} className="text-slate-400" />
          <div>
            {/* Tampilkan Nama & Role dari Database */}
            <p className="text-sm font-bold text-white capitalize">{username}</p>
            <p className="text-xs text-yellow-500 uppercase">{role}</p>
          </div>
        </div>
        
        <form action="/auth/logout">
          <button className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-600/10 hover:text-red-500 text-slate-400 py-2.5 rounded-lg transition-all text-sm font-bold border border-slate-700 hover:border-red-500/50">
            <LogOut size={16} /> Keluar Sistem
          </button>
        </form>
      </div>
    </aside>
  );
}