'use server';

import { prisma } from '../../lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Pastikan prevState ada, karena kita memanggilnya dengan login(null, formData) di frontend
export async function login(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const user = await prisma.user.findUnique({
    where: { username }
  });

  // Jika user tidak ada atau password salah
  if (!user || user.password !== password) {
    return { error: 'Username atau Password salah!' }; 
  }

  // KOREKSI KECIL: Next.js cookies maxAge dihitung dalam DETIK, bukan milidetik.
  // 24 jam * 60 menit * 60 detik = 86.400 detik
  const oneDay = 24 * 60 * 60; 
  
  // Await cookies() wajib untuk Next.js 15 ke atas
  const cookieStore = await cookies();

  // 1. Simpan Role
  cookieStore.set('user_role', user.role, {
    maxAge: oneDay,    
    httpOnly: true,    
    secure: process.env.NODE_ENV === 'production', 
    path: '/',         
    sameSite: 'strict' 
  });

  // 2. Simpan Username
  cookieStore.set('user_name', user.username, {
    maxAge: oneDay,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'strict'
  });

  // Redirect akan melempar error khusus yang akan ditangani Next.js
  // Frontend akan otomatis pindah halaman, loading screen akan tetap muncul sampai pindah.
  redirect('/dashboard');
}

export async function logout() {
  const cookieStore = await cookies();
  
  cookieStore.delete('user_role');
  cookieStore.delete('user_name');
  
  redirect('/');
}