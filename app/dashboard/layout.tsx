import Sidebar from '../../components/Sidebar';
import { cookies } from 'next/headers'; // PERBAIKAN: Gunakan cookies bawaan Next.js
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Ambil Cookie Store
  const cookieStore = await cookies();
  
  // 2. Ambil data user dari cookie yang diset saat login (authActions.ts)
  const role = cookieStore.get('user_role')?.value;
  const username = cookieStore.get('user_name')?.value;

  // 3. Cek Keamanan: Jika tidak ada role atau username, tendang ke login
  if (!role || !username) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* 4. Kirim data role & username ke Sidebar agar profilnya sesuai */}
      <Sidebar role={role} username={username} />

      <main className="flex-1 p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
    </div>
  );
}