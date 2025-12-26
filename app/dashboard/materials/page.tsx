import { prisma } from '../../../lib/prisma';
import { addMaterial, deleteMaterial } from '../../actions/materialActions';
import { Package, Trash2, PlusCircle } from 'lucide-react';
import { cookies } from 'next/headers';
import { Metadata } from 'next'; 

// Tambahkan ini
export const metadata: Metadata = {
  title: "Gudang Material",
};

export const dynamic = 'force-dynamic';

export default async function MaterialsPage() {
  const materials = await prisma.material.findMany({
    orderBy: { name: 'asc' }
  });

  const cookieStore = await cookies();
  const role = cookieStore.get('user_role')?.value;
  const isAdmin = role === 'ADMIN';

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
        <Package className="text-blue-600" /> Gudang Material & Aset
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- KOLOM KIRI: FORM INPUT --- */}
        <div className="lg:col-span-1 h-fit bg-white p-6 rounded-xl shadow-sm border border-blue-100">
          <h3 className="font-bold mb-4 text-slate-700 border-b pb-2">Input Barang Baru</h3>
          
          <form action={addMaterial} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Material / Alat</label>
              {/* UPDATE: Ditambahkan text-slate-900 agar tulisan hitam jelas */}
              <input 
                name="name" 
                type="text" 
                placeholder="Contoh: Cat Dulux Putih" 
                className="w-full border border-gray-300 p-2 rounded focus:outline-blue-500 text-sm text-slate-900 placeholder:text-gray-400" 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kategori</label>
                {/* UPDATE: Ditambahkan text-slate-900 */}
                <select name="category" className="w-full border border-gray-300 p-2 rounded focus:outline-blue-500 text-sm text-slate-900 bg-white">
                  <option value="Consumable">Bahan Habis (Cat/Lem)</option>
                  <option value="Asset">Aset Alat (Bor/Tangga)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Satuan</label>
                {/* UPDATE: Ditambahkan text-slate-900 */}
                <select name="unit" className="w-full border border-gray-300 p-2 rounded focus:outline-blue-500 text-sm text-slate-900 bg-white">
                  <option value="Pcs">Pcs</option>
                  <option value="Unit">Unit</option>
                  <option value="Pail">Pail (Cat)</option>
                  <option value="Lembar">Lembar (HPL)</option>
                  <option value="Box">Box</option>
                  <option value="Sak">Sak (Semen)</option>
                  <option value="Meter">Meter</option>
                  <option value="Roll">Roll</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stok Awal</label>
              {/* UPDATE: Ditambahkan text-slate-900 */}
              <input 
                name="stock" 
                type="number" 
                placeholder="0" 
                className="w-full border border-gray-300 p-2 rounded focus:outline-blue-500 text-sm text-slate-900 placeholder:text-gray-400" 
                required 
              />
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded flex items-center justify-center gap-2 transition-colors">
              <PlusCircle size={18} /> Simpan Data
            </button>
          </form>
        </div>

        {/* --- KOLOM KANAN: TABEL STOK (Tetap Sama) --- */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Nama Barang</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Kategori</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Stok Gudang</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {materials.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-400 text-sm">
                    Gudang kosong. Silakan input data di sebelah kiri.
                  </td>
                </tr>
              ) : (
                materials.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-800">{m.name}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded font-bold ${
                        m.type === 'Asset' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {m.type === 'Asset' ? 'Aset Alat' : 'Bahan Baku'}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-700">
                      {m.stock} <span className="text-gray-400 font-normal text-xs">{m.unit}</span>
                    </td>
                    <td className="p-4 text-right">
                      {isAdmin && (  // HANYA RENDER JIKA ADMIN
                        <form action={deleteMaterial} className="inline-block">
                          <input type="hidden" name="id" value={m.id} />
                          <button className="text-gray-400 hover:text-red-600 transition-colors p-1" title="Hapus">
                            <Trash2 size={16} />
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}