'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createTransaction(formData: FormData) {
  const type = formData.get('type') as string; // "OUT" (Kirim) atau "RETURN" (Balik)
  const materialId = formData.get('materialId') as string;
  const projectId = formData.get('projectId') as string;
  const quantity = Number(formData.get('quantity'));
  const notes = formData.get('notes') as string;

  // 1. Cek Data Material Dulu (Validasi Stok)
  const material = await prisma.material.findUnique({
    where: { id: materialId }
  });

  if (!material) throw new Error("Material tidak ditemukan!");

  // Logic: Kalau KIRIM (OUT), stok harus cukup
  if (type === 'OUT' && material.stock < quantity) {
    throw new Error(`Stok tidak cukup! Sisa gudang: ${material.stock} ${material.unit}`);
  }

  // 2. Jalankan Transaksi Database
  // Kita pakai $transaction agar update stok & catat riwayat terjadi bersamaan
  await prisma.$transaction(async (tx) => {
    
    // A. Update Stok Gudang
    if (type === 'OUT') {
      // Kirim ke Proyek = Stok Gudang Berkurang
      await tx.material.update({
        where: { id: materialId },
        data: { stock: { decrement: quantity } }
      });
    } else if (type === 'RETURN') {
      // Retur dari Proyek = Stok Gudang Bertambah
      await tx.material.update({
        where: { id: materialId },
        data: { stock: { increment: quantity } }
      });
    }

    // B. Catat Surat Jalan (Log)
    await tx.transaction.create({
      data: {
        type,
        materialId,
        projectId,
        quantity,
        notes
      }
    });
  });

  revalidatePath('/dashboard/transactions');
  revalidatePath('/dashboard/materials'); // Update stok di halaman gudang juga
}

export async function updateStatus(formData: FormData) {
  const id = formData.get('id') as string;
  const status = formData.get('status') as string;

  await prisma.transaction.update({
    where: { id },
    data: { status } // Update status baru
  });

  revalidatePath('/dashboard/logs');
}