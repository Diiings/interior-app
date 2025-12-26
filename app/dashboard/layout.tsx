import Link from 'next/link';
import { cookies } from 'next/headers'; 
import { logout } from '../actions/authActions';
import { LayoutDashboard, Warehouse, FolderKanban, History, LogOut, Truck, UserCircle } from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const cookieStore = await cookies(); 
  const role = cookieStore.get('user_role')?.value || 'GUEST';
  const username = cookieStore.get('user_name')?.value || 'User';

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 bg-slate-900 text-white fixed h-full shadow-xl z-50 flex flex-col justify-between">
        <div>
          {/* HEADER LOGO */}
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-yellow-500">
              <Warehouse /> Interior<span className="text-white">ERP</span>
            </h2>
          </div>

          {/* INFO USER (BARU) */}
          <div className="px-6 py-4 bg-slate-800/50 flex items-center gap-3">
            <UserCircle size={32} className="text-slate-400" />
            <div>
              <p className="font-bold text-sm capitalize">{username}</p>
              <p className="text-xs text-yellow-500 font-bold tracking-wider">{role}</p>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition">
              <LayoutDashboard size={20} /> <span>Overview</span>
            </Link>
            <Link href="/dashboard/transactions" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition">
              <Truck size={20} /> 
              <span>Logistik / Surat Jalan</span>
            </Link>
            <Link href="/dashboard/materials" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition">
              <Warehouse size={20} /> <span>Gudang Material</span>
            </Link>
            <Link href="/dashboard/projects" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition">
              <FolderKanban size={20} /> <span>Proyek Aktif</span>
            </Link>
             <Link href="/dashboard/logs" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition">
              <History size={20} /> <span>Riwayat Transaksi</span>
            </Link>
          </nav>
        </div>

        {/* TOMBOL LOGOUT (BARU) */}
        <div className="p-4 border-t border-slate-800">
          <form action={logout}>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg transition">
              <LogOut size={20} />
              <span>Keluar</span>
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}