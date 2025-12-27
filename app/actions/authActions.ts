'use server';

import { prisma } from '../../lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// PERBAIKAN: Tambahkan parameter 'prevState: any' di depan formData
export async function login(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const user = await prisma.user.findUnique({
    where: { username }
  });

  // Jika password salah, return error object agar bisa dibaca di frontend
  if (!user || user.password !== password) {
    return { error: 'Username atau Password salah!' }; 
  }

  const oneDay = 24 * 60 * 60 * 1000; // 24 Jam dalam milidetik
  
  const cookieStore = await cookies();

  cookieStore.set('user_role', user.role, {
    maxAge: oneDay,    // Expire dalam 1 hari (detik)
    httpOnly: true,    // Tidak bisa diakses lewat JavaScript browser (Anti XSS)
    secure: process.env.NODE_ENV === 'production', // Hanya HTTPS di Production
    path: '/',         // Berlaku di seluruh halaman
    sameSite: 'strict' // Mencegah CSRF attack
  });

  // 2. Simpan Username (Untuk ditampilkan di Sidebar)
  cookieStore.set('user_name', user.username, {
    maxAge: oneDay,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'strict'
  });

  redirect('/dashboard');
}

export async function logout() {
  const cookieStore = await cookies();
  
  // Hapus cookie saat logout
  cookieStore.delete('user_role');
  cookieStore.delete('user_name');
  
  redirect('/');
}