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

  // Jika sukses, set cookies
  (await cookies()).set('user_role', user.role);
  (await cookies()).set('user_name', user.username);

  redirect('/dashboard');
}

export async function logout() {
  (await cookies()).delete('user_role');
  (await cookies()).delete('user_name');
  redirect('/');
}