'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addMaterial(formData: FormData) {
  const name = formData.get('name') as string;
  const category = formData.get('category') as string; // 'Consumable' atau 'Asset'
  const unit = formData.get('unit') as string;
  const stock = Number(formData.get('stock'));

  await prisma.material.create({
    data: {
      name,
      type: category, // Di schema kita namakan 'type'
      unit,
      stock
    }
  });

  revalidatePath('/dashboard/materials');
}

export async function deleteMaterial(formData: FormData) {
  const id = formData.get('id') as string;
  
  await prisma.material.delete({
    where: { id }
  });

  revalidatePath('/dashboard/materials');
}