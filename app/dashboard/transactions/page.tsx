import { prisma } from '../../../lib/prisma';
import { createTransaction } from '../../actions/transactionActions';
import { Truck, ArrowRight, CornerDownLeft, History } from 'lucide-react';
import { Metadata } from 'next'; 

// Tambahkan ini
export const metadata: Metadata = {
  title: "Logistik",
};

export const dynamic = 'force-dynamic';

export default async function TransactionPage() {
  // Ambil Data untuk Dropdown
  const materials = await prisma.material.findMany({ orderBy: { name: 'asc' } });
  const projects = await prisma.project.findMany({ 
    where: { status: 'ONGOING' }, // Hanya tampilkan proyek yang aktif
    orderBy: { createdAt: 'desc' } 
  });

  // Ambil 5 Riwayat Terakhir
  const recentLogs = await prisma.transaction.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { material: true, project: true }
  });

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
        <Truck className="text-blue-600" /> Logistik & Surat Jalan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* --- FORM SURAT JALAN (Kiri) --- */}
        <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-blue-100">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h3 className="font-bold text-lg text-slate-800">Buat Transaksi Baru</h3>
            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">
              FORM KELUAR / MASUK
            </span>
          </div>

          <form action={createTransaction} className="space-y-6">
            
            {/* 1. Pilih Jenis Transaksi */}
            <div className="grid grid-cols-2 gap-4">
              <label className="cursor-pointer">
                <input type="radio" name="type" value="OUT" className="peer sr-only" defaultChecked />
                <div className="p-4 rounded-lg border-2 border-slate-200 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all text-center">
                  <ArrowRight className="mx-auto mb-2 text-blue-600" />
                  <span className="font-bold text-slate-700 block">Kirim ke Proyek</span>
                  <span className="text-xs text-gray-500">Stok Gudang Berkurang</span>
                </div>
              </label>

              <label className="cursor-pointer">
                <input type="radio" name="type" value="RETURN" className="peer sr-only" />
                <div className="p-4 rounded-lg border-2 border-slate-200 peer-checked:border-orange-500 peer-checked:bg-orange-50 transition-all text-center">
                  <CornerDownLeft className="mx-auto mb-2 text-orange-600" />
                  <span className="font-bold text-slate-700 block">Retur Sisa Proyek</span>
                  <span className="text-xs text-gray-500">Stok Gudang Bertambah</span>
                </div>
              </label>
            </div>

            {/* 2. Pilih Proyek & Material */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Pilih Proyek</label>
                <select name="projectId" className="w-full border p-3 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" required>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Pilih Material</label>
                <select name="materialId" className="w-full border p-3 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" required>
                  {materials.map(m => (
                    <option key={m.id} value={m.id} disabled={m.stock <= 0}>
                      {m.name} (Sisa: {m.stock} {m.unit})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Jumlah & Catatan */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-bold text-slate-700 mb-2">Jumlah</label>
                <input name="quantity" type="number" min="1" placeholder="0" className="w-full border p-3 rounded-lg text-slate-900 font-bold" required />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Catatan / Surat Jalan</label>
                <input name="notes" type="text" placeholder="Supir: Pak Asep, Plat B 1234..." className="w-full border p-3 rounded-lg text-slate-900" />
              </div>
            </div>

            <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95">
              PROSES TRANSAKSI
            </button>

          </form>
        </div>

        {/* --- RIWAYAT LOG (Kanan) --- */}
        <div>
          <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <History size={18} /> Aktivitas Terakhir
          </h3>
          <div className="space-y-4">
            {recentLogs.length === 0 && <p className="text-gray-400 text-sm">Belum ada transaksi.</p>}
            
            {recentLogs.map((log) => (
              <div key={log.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    log.type === 'OUT' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {log.type === 'OUT' ? 'KELUAR' : 'RETUR'}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {new Date(log.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <p className="font-bold text-slate-800">
                  {log.quantity} {log.material.unit} {log.material.name}
                </p>
                <p className="text-gray-500 mt-1 flex items-center gap-1">
                  <ArrowRight size={12} /> {log.project?.name || 'Gudang'}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}