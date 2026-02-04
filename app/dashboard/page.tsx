import { prisma } from '../../lib/prisma';
import { Package, MapPin, AlertTriangle, ArrowRight, Truck, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Ambil data real dari database
  const totalMaterials = await prisma.material.count();
  const totalProjects = await prisma.project.count();
  const lowStockItems = await prisma.material.count({
    where: { stock: { lte: 5 } } // Stok kurang dari atau sama dengan 5 dianggap kritis
  });

  return (
    <div className="space-y-8">
      
      {/* 1. HEADER SECTION */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
        <p className="text-slate-500 text-sm">Pantau aktivitas gudang dan proyek secara real-time.</p>
      </div>

      {/* 2. STATISTIC CARDS (Desain Baru) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Jenis Material" 
          value={totalMaterials} 
          icon={Package} 
          color="blue"
          desc="Tercatat di sistem"
        />
        <StatCard 
          title="Proyek Aktif" 
          value={totalProjects} 
          icon={MapPin} 
          color="purple"
          desc="Lokasi pengiriman"
        />
        <StatCard 
          title="Stok Menipis" 
          value={lowStockItems} 
          icon={AlertTriangle} 
          color="red"
          desc="Butuh restock segera"
        />
      </div>

      {/* 3. HERO BANNER & QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Banner Selamat Datang (Lebar 2 Kolom) */}
        <div className="lg:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">👋 Selamat Datang kembali, Admin!</h3>
            <p className="text-blue-100 mb-6 max-w-md">
              Sistem Stoco siap membantu Anda mengelola logistik. Pastikan semua Surat Jalan hari ini sudah terinput dengan benar.
            </p>
            <Link href="/dashboard/transactions" className="inline-flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors">
              <Truck size={16} /> Buat Surat Jalan Baru
            </Link>
          </div>
          {/* Hiasan Background */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Akses Cepat (Lebar 1 Kolom) */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            🚀 Akses Cepat
          </h4>
          <div className="space-y-3">
            <QuickLink href="/dashboard/materials" label="Input Barang Baru" icon={PlusCircle} />
            <QuickLink href="/dashboard/logs" label="Cek Riwayat Masuk/Keluar" icon={ArrowRight} />
          </div>
        </div>

      </div>
    </div>
  );
}

// --- KOMPONEN KECIL (Helper Components) ---

function StatCard({ title, value, icon: Icon, color, desc }: any) {
  const colorClasses: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    red: "bg-red-50 text-red-600 border-red-100",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
      <p className="text-xs text-slate-400">{desc}</p>
    </div>
  );
}

function QuickLink({ href, label, icon: Icon }: any) {
  return (
    <Link href={href} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group">
      <span className="text-sm font-medium text-slate-600 group-hover:text-blue-700">{label}</span>
      <Icon size={16} className="text-gray-300 group-hover:text-blue-600" />
    </Link>
  );
}