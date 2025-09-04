import { PrismaClient } from "@prisma/client";
import { seedGeolocations } from "./geolocations.seed";
import { seedGammaAndTransmission } from "./gamma-transmissions.seed";

const prisma = new PrismaClient();

async function main(){
    await seedGeolocations();
    await seedGammaAndTransmission();
}

main().then(async () => {
    console.log('✅ Seed completado');
    await prisma.$disconnect();
}).catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});