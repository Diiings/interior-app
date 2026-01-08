'use client'; // Wajib, karena pakai useState

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Untuk cek link aktif
import { logout } from '../app/actions/authActions'; 
import { LayoutDashboard, Warehouse, FolderKanban, History, LogOut, UserCircle, Truck, Menu, X } from 'lucide-react';

interface SidebarProps {
  role: string;
  username: string;
}

export default function Sidebar({ role, username }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Untuk highlight menu aktif

  // Fungsi tutup menu saat link diklik (khusus mobile)
  const handleLinkClick = () => setIsOpen(false);

  return (
    <>
      {/* 1. TOMBOL HAMBURGER (Hanya muncul di Mobile) */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg md:hidden hover:bg-slate-800"
      >
        <Menu size={24} />
      </button>

      {/* 2. OVERLAY GELAP (Background saat menu buka di HP) */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
        />
      )}

      {/* 3. SIDEBAR UTAMA */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-slate-900 text-white shadow-xl z-50 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 
      `}>
        <div className="flex flex-col h-full justify-between">
          <div>
            {/* Header Sidebar */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Warehouse /> 
                Stoco
              </h2>
              {/* Tombol Close (X) di dalam sidebar khusus HP */}
              <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            {/* Info User */}
            <div className="px-6 py-4 bg-slate-800/50 flex items-center gap-3">
              <UserCircle size={32} className="text-slate-400" />
              <div>
                <p className="font-bold text-sm capitalize">{username}</p>
                <p className="text-xs text-yellow-500 font-bold tracking-wider">{role}</p>
              </div>
            </div>

            {/* Navigasi */}
            <nav className="p-4 space-y-2">
              <NavItem href="/dashboard" icon={<LayoutDashboard size={20}/>} label="Overview" active={pathname === '/dashboard'} onClick={handleLinkClick} />
              <NavItem href="/dashboard/materials" icon={<Warehouse size={20}/>} label="Gudang Material" active={pathname.includes('/materials')} onClick={handleLinkClick} />
              <NavItem href="/dashboard/projects" icon={<FolderKanban size={20}/>} label="Lokasi Proyek" active={pathname.includes('/projects')} onClick={handleLinkClick} />
              <NavItem href="/dashboard/transactions" icon={<Truck size={20}/>} label="Logistik / Surat Jalan" active={pathname.includes('/transactions')} onClick={handleLinkClick} />
              <NavItem href="/dashboard/logs" icon={<History size={20}/>} label="Riwayat" active={pathname.includes('/logs')} onClick={handleLinkClick} />
            </nav>
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-slate-800">
            <form action={logout}>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg transition">
                <LogOut size={20} />
                <span>Keluar</span>
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}

// Komponen Kecil untuk Link agar kodingan rapi
function NavItem({ href, icon, label, active, onClick }: any) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
        active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}