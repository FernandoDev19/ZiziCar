import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedGeolocations() {
  const continent = await prisma.zIC_ADM_CONTINENTS.upsert({
    where: { name: 'América del Sur' },
    update: {},
    create: {
      name: 'América del Sur',
    },
  });

  const colombia = await prisma.zIC_ADM_COUNTRIES.upsert({
    where: { name: 'Colombia' },
    update: {},
    create: {
      name: 'Colombia',
      prefix: 57,
      ZIC_ADM_CONTINENTS: {
        connect: {
          id: continent.id,
        },
      },
    },
  });

  const departamentos = [
    { name: 'Atlántico', ciudades: ['Barranquilla', 'Soledad', 'Malambo', 'Santa Marta'] },
    { name: 'Cesar', ciudades: ['Valledupar'] },
    { name: 'Santander', ciudades: ['Bucaramanga'] },
    { name: 'Norte de Santander', ciudades: ['Cúcuta'] },
    { name: 'Cundinamarca', ciudades: ['Bogotá', 'Soacha', 'Zipaquirá'] },
    { name: 'Meta', ciudades: ['Villavicencio'] },
    { name: 'Huila', ciudades: ['Neiva'] },
    { name: 'Tolima', ciudades: ['Ibagué'] },
    { name: 'Quindío', ciudades: ['Armenia'] },
    { name: 'Valle del Cauca', ciudades: ['Cali'] },
    { name: 'Risaralda', ciudades: ['Pereira'] },
    { name: 'Caldas', ciudades: ['Manizales'] },
    { name: 'Antioquia', ciudades: ['Medellín', 'Bello', 'Envigado'] },
    { name: 'Córdoba', ciudades: ['Montería'] },
    { name: 'Bolívar', ciudades: ['Cartagena', 'Magangué', 'Turbaco'] },
    { name: 'Nariño', ciudades: ['Pasto'] },
  ];

  for (const dep of departamentos) {
    const state = await prisma.zIC_ADM_STATES.upsert({
      where: { name: dep.name },
      update: {},
      create: { name: dep.name, country_id: colombia.id },
    });

    for (const city of dep.ciudades) {
      await prisma.zIC_ADM_GLOBAL_CITIES.upsert({
        where: { name: city },
        update: {},
        create: { name: city, state_id: state.id },
      });
    }
  }

  console.log('🌍 Geolocations seeded: Colombia');
}
