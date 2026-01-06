'use client'; // WAJIB: Karena kita pakai hook useActionState

import { useActionState } from 'react'; // Hook baru di Next.js 15 / React 19
import { login } from './actions/authActions';
import { Warehouse, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  // Setup hook untuk menangani form login
  // state: berisi return value dari server (misal error message)
  // formAction: fungsi yang ditempel ke <form>
  // isPending: true jika sedang loading
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-md bg-white text-slate-900 p-8 rounded-2xl shadow-2xl">
        
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-yellow-500 p-3 rounded-full text-slate-900">
              <Warehouse className='text-yellow-500' size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-wide">
              Sto<span className="text-yellow-500">co</span>.
            </h1>

            <p className="text-slate-400 text-sm mt-2">Smart Stock Control System</p>
          </div>
        </div>

        {/* MENAMPILKAN ERROR JIKA ADA */}
        {state?.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center gap-2 text-sm">
            <AlertCircle size={16} />
            <span>{state.error}</span>
          </div>
        )}

        {/* PERBAIKAN: Gunakan formAction dari hook */}
        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username</label>
            <input name="username" type="text" placeholder="Masukkan username" className="w-full border p-3 rounded-lg bg-slate-50 outline-none focus:ring-2 focus:ring-yellow-500" required />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
            <input name="password" type="password" placeholder="Masukkan password" className="w-full border p-3 rounded-lg bg-slate-50 outline-none focus:ring-2 focus:ring-yellow-500" required />
          </div>

          <button 
            disabled={isPending}
            className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 flex justify-center items-center gap-2 mt-4 disabled:opacity-50 transition-all"
          >
            {isPending ? 'Memproses...' : (
              <>
                <Lock size={18} /> Masuk Sistem
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}