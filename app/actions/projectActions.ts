'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

// 1. Tambah Proyek Baru
export async function addProject(formData: FormData) {
  const name = formData.get('name') as string;

  await prisma.project.create({
    data: {
      name,
      status: 'ONGOING' // Default status: Sedang Berjalan
    }
  });

  revalidatePath('/dashboard/projects');
}

// 2. Tandai Proyek Selesai
export async function markAsDone(formData: FormData) {
  const id = formData.get('id') as string;

  await prisma.project.update({
    where: { id },
    data: { status: 'DONE' }
  });

  revalidatePath('/dashboard/projects');
}

// 3. Hapus Proyek (Jika salah input)
export async function deleteProject(formData: FormData) {
  const id = formData.get('id') as string;

  // Hapus proyek beserta transaksinya (Cascade manual biar aman)
  await prisma.transaction.deleteMany({ where: { projectId: id } });
  await prisma.project.delete({ where: { id } });

  revalidatePath('/dashboard/projects');
}