import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando el seeding de la base de datos...');

  // Crear propietario por defecto
  const propietario = await prisma.propietario.upsert({
    where: { codigo: 1 },
    update: {},
    create: {
      codigo: 1,
      nombre: 'Propietario Por Defecto',
    },
  });

  console.log('✅ Propietario creado:', propietario);

  // Limpiar vehículos existentes para evitar conflictos
  await prisma.vehiculo.deleteMany({});
  console.log('🗑️ Vehículos existentes eliminados');

  // Limpiar activos existentes para evitar conflictos
  await prisma.activoFijo.deleteMany({});
  console.log('🗑️ Activos existentes eliminados');

  // Reiniciar las secuencias de autoincrement para consistencia
  await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name IN ('vehiculos', 'activos_fijos')`;
  console.log('🔄 Secuencias de autoincrement reiniciadas');

  console.log('✅ Seeding completado exitosamente!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error durante el seeding:', e);
    await prisma.$disconnect();
  });