import { prisma } from '../../../lib/prisma';
import StatusBadge from './StatusBadge';
import { History, ArrowRight, CornerDownLeft, PlusCircle, MapPin, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LogsPage() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    include: { material: true, project: true }
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
        <History className="text-gray-600" /> Riwayat & Status
      </h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Hapus 'min-w-[800px]' agar tabel menyesuaikan lebar HP */}
        <table className="w-full text-left">
          
          {/* HEADER: Sembunyikan header kolom yang tidak perlu di HP */}
          <thead className="bg-slate-50 border-b border-gray-200">
            <tr>
              <th className="hidden md:table-cell p-4 text-xs font-bold text-gray-500 uppercase">Waktu</th>
              <th className="hidden md:table-cell p-4 text-xs font-bold text-gray-500 uppercase">Tipe</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Detail Transaksi</th>
              <th className="hidden md:table-cell p-4 text-xs font-bold text-gray-500 uppercase">Lokasi</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right md:text-left">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {transactions.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400">Belum ada data.</td></tr>
            ) : (
              transactions.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  
                  {/* 1. WAKTU (Hidden di HP) */}
                  <td className="hidden md:table-cell p-4 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString('id-ID', { 
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                    })}
                  </td>

                  {/* 2. TIPE (Hidden di HP) */}
                  <td className="hidden md:table-cell p-4">
                    <BadgeType type={log.type} />
                  </td>

                  {/* 3. MATERIAL (GABUNGAN INFO DI HP) */}
                  <td className="p-4 align-top">
                    {/* Tampilan Khusus Mobile (Muncul di HP saja) */}
                    <div className="md:hidden flex flex-wrap gap-2 mb-1 text-xs text-gray-400 items-center">
                      <span className="flex items-center gap-1"><Calendar size={10}/> {new Date(log.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}</span>
                      <span>•</span>
                      <BadgeType type={log.type} mobile={true} />
                    </div>

                    {/* Nama Material (Selalu Muncul) */}
                    <p className="font-bold text-slate-800 text-sm">{log.material.name}</p>
                    <p className="text-xs text-slate-500">{log.quantity} {log.material.unit}</p>

                    {/* Lokasi Mobile (Muncul di HP saja) */}
                    <div className="md:hidden mt-2 text-xs text-blue-600 flex items-start gap-1">
                      {log.project && <MapPin size={12} className="mt-0.5 shrink-0" />}
                      <span>{log.project ? log.project.name : 'Gudang Utama'}</span>
                    </div>
                  </td>

                  {/* 4. LOKASI (Hidden di HP) */}
                  <td className="hidden md:table-cell p-4 text-sm min-w-[150px]">
                    {log.project ? (
                      <span className="font-bold text-blue-600 block">{log.project.name}</span>
                    ) : (
                      <span className="italic text-gray-400 block">Gudang Utama</span>
                    )}
                    {log.notes && <span className="text-xs text-gray-400 block mt-1">Note: {log.notes}</span>}
                  </td>

                  {/* 5. STATUS (Selalu Muncul) */}
                  <td className="p-4 text-right md:text-left align-top">
                    {log.type === 'OUT' ? (
                      <StatusBadge id={log.id} status={log.status} />
                    ) : (
                      <span className="text-xs text-gray-400 hidden md:inline">-</span>
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

// Komponen Kecil untuk Badge Tipe agar kodingan rapi
function BadgeType({ type, mobile = false }: { type: string, mobile?: boolean }) {
  const size = mobile ? 10 : 12;
  const padding = mobile ? "px-1.5 py-0.5" : "px-2 py-1";
  
  if (type === 'OUT') return <span className={`flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-bold ${padding} rounded w-fit`}><ArrowRight size={size}/> {mobile ? 'KELUAR' : 'KELUAR'}</span>;
  if (type === 'RETURN') return <span className={`flex items-center gap-1 bg-orange-100 text-orange-700 text-xs font-bold ${padding} rounded w-fit`}><CornerDownLeft size={size}/> {mobile ? 'RETUR' : 'RETUR'}</span>;
  return <span className={`flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold ${padding} rounded w-fit`}><PlusCircle size={size}/> {mobile ? 'MASUK' : 'MASUK'}</span>;
}