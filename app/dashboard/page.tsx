import { prisma } from '../../lib/prisma';
import { Warehouse, FolderKanban, AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // 1. Ambil Ringkasan Data
  const totalMaterials = await prisma.material.count();
  const totalProjects = await prisma.project.count();
  
  // Cek barang yang stoknya 0 (Habis)
  const emptyStock = await prisma.material.count({
    where: { stock: 0 }
  });

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800 mb-8">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KARTU 1: Total Material */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Jenis Material</p>
            <h3 className="text-3xl font-bold text-slate-800">{totalMaterials}</h3>
          </div>
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <Warehouse size={24} />
          </div>
        </div>

        {/* KARTU 2: Proyek Aktif */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Proyek Terdaftar</p>
            <h3 className="text-3xl font-bold text-slate-800">{totalProjects}</h3>
          </div>
          <div className="bg-purple-100 p-3 rounded-full text-purple-600">
            <FolderKanban size={24} />
          </div>
        </div>

        {/* KARTU 3: Peringatan Stok */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Stok Habis (Nol)</p>
            <h3 className="text-3xl font-bold text-red-600">{emptyStock}</h3>
          </div>
          <div className="bg-red-100 p-3 rounded-full text-red-600">
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
        <h3 className="text-blue-800 font-bold text-lg mb-2">👋 Selamat Datang di Stoco.</h3>
        <p className="text-blue-600">
          Mulai dengan menambahkan data material bangunan di menu <strong>Gudang Material</strong>.
        </p>
      </div>
    </div>
  );
}