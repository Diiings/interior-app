import { prisma } from '../../../lib/prisma';
import { History, ArrowRight, CornerDownLeft, PlusCircle } from 'lucide-react';
import { Metadata } from 'next'; 

// Tambahkan ini
export const metadata: Metadata = {
  title: "Riwayat",
};
export const dynamic = 'force-dynamic';

export default async function LogsPage() {
  // Ambil semua transaksi, urutkan dari yang terbaru
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      material: true,
      project: true
    }
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
        <History className="text-gray-600" /> Riwayat Keluar Masuk Barang
      </h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Waktu</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Tipe</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Material</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Jumlah</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Keterangan / Lokasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400">
                  Belum ada data transaksi apapun.
                </td>
              </tr>
            ) : (
              transactions.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(log.createdAt).toLocaleString('id-ID', { 
                      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                    })}
                  </td>
                  <td className="p-4">
                    {/* LOGIC BADGE WARNA-WARNI */}
                    {log.type === 'OUT' && (
                      <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">
                        <ArrowRight size={12} /> KELUAR
                      </span>
                    )}
                    {log.type === 'RETURN' && (
                      <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded">
                        <CornerDownLeft size={12} /> RETUR
                      </span>
                    )}
                    {log.type === 'IN' && (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                        <PlusCircle size={12} /> MASUK
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-medium text-slate-800">
                    {log.material.name}
                  </td>
                  <td className="p-4 font-bold text-slate-700">
                    {log.quantity} <span className="text-xs font-normal text-gray-400">{log.material.unit}</span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {log.project ? (
                      <span className="font-bold text-blue-600">Proyek: {log.project.name}</span>
                    ) : (
                      <span className="italic text-gray-400">Gudang / Stok Awal</span>
                    )}
                    {log.notes && (
                      <div className="text-xs text-gray-400 mt-1">
                        Catatan: {log.notes}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}