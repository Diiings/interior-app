import { prisma } from '../../../lib/prisma';
import { addProject, markAsDone, deleteProject } from '../../actions/projectActions';
import { FolderKanban, Plus, Calendar, CheckCircle, Trash2 } from 'lucide-react';
import { Metadata } from 'next'; 

// Tambahkan ini
export const metadata: Metadata = {
  title: "Proyek",
};

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  // Ambil data proyek, urutkan yang ONGOING di atas
  const projects = await prisma.project.findMany({
    orderBy: [
      { status: 'desc' }, // ONGOING (Z) dulu, baru DONE (A) -> trik sorting string simpel
      { createdAt: 'desc' }
    ]
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
        <FolderKanban className="text-purple-600" /> Manajemen Proyek
      </h2>

      {/* --- FORM INPUT PROYEK BARU --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100 mb-8">
        <h3 className="font-bold mb-4 text-slate-700">Mulai Proyek Baru</h3>
        <form action={addProject} className="flex gap-4">
          <input 
            name="name" 
            type="text" 
            placeholder="Nama Proyek (Misal: Renovasi Rumah Bpk. Budi - PIK)" 
            className="flex-1 border border-gray-300 text-slate-900 p-3 rounded-lg focus:outline-purple-500" 
            required 
          />
          <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
            <Plus size={20} /> Buat Proyek
          </button>
        </form>
      </div>

      {/* --- DAFTAR PROYEK (GRID) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400 bg-slate-50 rounded-xl border border-dashed border-gray-300">
            Belum ada proyek aktif. Silakan buat di atas.
          </div>
        ) : (
          projects.map((project) => (
            <div 
              key={project.id} 
              className={`relative p-6 rounded-xl border-2 transition-all ${
                project.status === 'ONGOING' 
                  ? 'bg-white border-purple-100 shadow-sm hover:border-purple-300' 
                  : 'bg-slate-50 border-slate-200 opacity-75'
              }`}
            >
              {/* STATUS BADGE */}
              <div className="absolute top-4 right-4">
                {project.status === 'ONGOING' ? (
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                    SEDANG BERJALAN
                  </span>
                ) : (
                  <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">
                    SELESAI
                  </span>
                )}
              </div>

              <h3 className="font-bold text-lg text-slate-800 pr-20 mb-2 line-clamp-2">
                {project.name}
              </h3>

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Calendar size={14} />
                <span>Mulai: {new Date(project.createdAt).toLocaleDateString('id-ID')}</span>
              </div>

              {/* TOMBOL AKSI */}
              <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-auto">
                {project.status === 'ONGOING' ? (
                  <form action={markAsDone}>
                    <input type="hidden" name="id" value={project.id} />
                    <button className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      <CheckCircle size={16} /> Tandai Selesai
                    </button>
                  </form>
                ) : (
                  <span className="text-sm text-green-600 font-bold flex items-center gap-1">
                    <CheckCircle size={16} /> Completed
                  </span>
                )}

                <form action={deleteProject}>
                  <input type="hidden" name="id" value={project.id} />
                  <button className="text-gray-400 hover:text-red-500 transition-colors" title="Hapus Proyek">
                    <Trash2 size={18} />
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}