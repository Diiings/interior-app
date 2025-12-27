import { prisma } from '../../../lib/prisma';
import { updateStatus } from '../../actions/transactionActions'; // Import action baru
import { History, ArrowRight, CornerDownLeft, PlusCircle, Truck, CheckCircle, Save } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LogsPage() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    include: { material: true, project: true }
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
        <History className="text-gray-600" /> Riwayat & Status Pengiriman
      </h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Waktu</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Tipe</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Material</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Lokasi</th>
              {/* KOLOM BARU */}
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status Pengiriman</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400">Belum ada data.</td></tr>
            ) : (
              transactions.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  
                  {/* 1. WAKTU */}
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(log.createdAt).toLocaleString('id-ID', { 
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                    })}
                  </td>

                  {/* 2. TIPE TRANSAKSI */}
                  <td className="p-4">
                    {log.type === 'OUT' && <span className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded w-fit"><ArrowRight size={12}/> KELUAR</span>}
                    {log.type === 'RETURN' && <span className="flex items-center gap-1 bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded w-fit"><CornerDownLeft size={12}/> RETUR</span>}
                    {log.type === 'IN' && <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded w-fit"><PlusCircle size={12}/> MASUK</span>}
                  </td>

                  {/* 3. INFO MATERIAL */}
                  <td className="p-4">
                    <p className="font-bold text-slate-800 text-sm">{log.material.name}</p>
                    <p className="text-xs text-slate-500">{log.quantity} {log.material.unit}</p>
                  </td>

                  {/* 4. LOKASI / PROJECT */}
                  <td className="p-4 text-sm">
                    {log.project ? (
                      <span className="font-bold text-blue-600 block">{log.project.name}</span>
                    ) : (
                      <span className="italic text-gray-400 block">Gudang Utama</span>
                    )}
                    {log.notes && <span className="text-xs text-gray-400 block mt-1">Note: {log.notes}</span>}
                  </td>

                  {/* 5. STATUS & AKSI (FITUR BARU) */}
                  <td className="p-4">
                    {/* Hanya tampilkan Edit Status jika barang KELUAR (OUT) ke Proyek */}
                    {log.type === 'OUT' ? (
                      <form action={updateStatus} className="flex items-center gap-2">
                        <input type="hidden" name="id" value={log.id} />
                        
                        {/* Dropdown Status */}
                        <select 
                          name="status" 
                          defaultValue={log.status}
                          className={`text-xs font-bold border-none rounded py-1 pl-2 pr-6 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 ${
                            log.status === 'DONE' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          <option value="PENDING">⏳ Sedang Dikirim</option>
                          <option value="DONE">✅ Sudah Diterima</option>
                        </select>

                        {/* Tombol Simpan Kecil */}
                        <button type="submit" className="p-1 text-gray-400 hover:text-blue-600 transition" title="Update Status">
                          <Save size={16} />
                        </button>
                      </form>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
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