'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateStatus } from '../../actions/transactionActions';
import { Save, Loader2 } from 'lucide-react';

export default function StatusBadge({ id, status }: { id: string, status: string }) {
  const router = useRouter();
  
  // 1. Buat state lokal agar perubahan terlihat INSTAN
  const [localStatus, setLocalStatus] = useState(status);
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsUpdating(true);
    
    // 2. Ambil nilai baru yang dipilih user dari form
    const newStatus = formData.get('status') as string;
    
    // 3. OPTIMISTIC UPDATE: Ubah tampilan SEKARANG JUGA (Visual Trick)
    setLocalStatus(newStatus); 

    // 4. Kirim ke server di belakang layar
    await updateStatus(formData);
    
    // 5. Sinkronisasi akhir (jaga-jaga)
    router.refresh(); 
    setIsUpdating(false);
  }

  // Helper untuk menentukan warna teks berdasarkan state LOKAL
  const getTextColor = (s: string) => {
    return s === 'DONE' ? 'text-green-600' : 'text-yellow-600';
  };

  return (
    <form action={handleSubmit} className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      
      <select 
        name="status" 
        // Gunakan value dari state lokal, bukan props database lagi
        value={localStatus} 
        // Update state saat dropdown diganti (agar warna langsung berubah juga saat pilih-pilih)
        onChange={(e) => setLocalStatus(e.target.value)}
        disabled={isUpdating}
        className={`text-sm font-bold border-none p-0 pr-6 cursor-pointer outline-none focus:ring-0 appearance-none bg-transparent ${getTextColor(localStatus)}`}
      >
        <option value="PENDING">⏳ Sedang Dikirim</option>
        <option value="DONE">✅ Sudah Diterima</option>
      </select>

      <button 
        type="submit" 
        disabled={isUpdating}
        className="text-gray-300 hover:text-blue-600 transition disabled:opacity-50" 
        title="Simpan"
      >
        {isUpdating ? <Loader2 size={14} className="animate-spin text-blue-600" /> : <Save size={14} />}
      </button>
    </form>
  );
}