import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedGammaAndTransmission() {
  // 1. Gammas
  const gammas = [
    { name: 'Económico', image_url: 'https://imagenes-publicas-zzcr-s3.s3.us-east-1.amazonaws.com/gamas/economico.webp', precio_promedio: 150000 },
    { name: 'Hatchback', image_url: 'https://imagenes-publicas-zzcr-s3.s3.us-east-1.amazonaws.com/gamas/hatchback.webp', precio_promedio: 200000 },
    { name: 'Sedán', image_url: 'https://imagenes-publicas-zzcr-s3.s3.us-east-1.amazonaws.com/gamas/sedan.webp', precio_promedio: 280000 },
    { name: 'Automóvil lujo', image_url: 'https://imagenes-publicas-zzcr-s3.s3.us-east-1.amazonaws.com/gamas/lujo.webp', precio_promedio: 350000 },
    { name: 'Camioneta SUV (5 puestos)', image_url: 'https://imagenes-publicas-zzcr-s3.s3.us-east-1.amazonaws.com/gamas/SUV5.webp', precio_promedio: 250000 },
    { name: 'Camioneta (7 puestos)', image_url: 'https://imagenes-publicas-zzcr-s3.s3.us-east-1.amazonaws.com/gamas/SUV+7.webp', precio_promedio: 290000 },
    { name: 'Van (7 y 8 puestos)', image_url: 'https://imagenes-publicas-zzcr-s3.s3.us-east-1.amazonaws.com/gamas/vans.webp', precio_promedio: 390000 },
  ];

  for (let i = 0; i < gammas.length; i++) {
    await prisma.gamma.upsert({
      where: { name: gammas[i].name },
      update: {
        image_url: gammas[i].image_url,
        precio_promedio: gammas[i].precio_promedio,
      },
      create: gammas[i],
    });
  }

  // 2. Transmissions
  const transmissions = [
    { name: 'Automática', image_url: 'https://imagenes-publicas-zzcr-s3.s3.us-east-1.amazonaws.com/automatica.svg' },
    { name: 'Mecánica', image_url: 'https://imagenes-publicas-zzcr-s3.s3.us-east-1.amazonaws.com/manual.svg' },
    { name: 'Cualquiera', image_url: 'https://imagenes-publicas-zzcr-s3.s3.us-east-1.amazonaws.com/azar.svg' },
  ];

  for (const t of transmissions) {
    await prisma.zIC_ADM_TRANSMISSION.upsert({
      where: { name: t.name },
      update: { image_url: t.image_url },
      create: t,
    });
  }

  console.log('🚗 Gammas y transmisiones seeded correctamente');
}
