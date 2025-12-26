import { cookies } from 'next/headers'; 
import Sidebar from '../../components/Sidebar'; // Import Sidebar Client Component

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Ambil data session di Server
  const cookieStore = await cookies();
  const role = cookieStore.get('user_role')?.value || 'GUEST';
  const username = cookieStore.get('user_name')?.value || 'User';

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* Panggil Sidebar dan oper datanya */}
      <Sidebar role={role} username={username} />

      {/* MAIN CONTENT */}
      {/* md:ml-64 artinya: Margin kiri hanya ada di Desktop. Di HP margin 0 (full width) */}
      <main className="flex-1 p-8 md:ml-64 pt-20 md:pt-8 transition-all duration-300">
        {children}
      </main>
      
    </div>
  );
}