// server/src/testPrisma.js
const prisma = require('./prismaClient');

async function test() {
  try {
    const count = await prisma.user.count();
    console.log('Connexion OK, nombre d’utilisateurs :', count);
  } catch (error) {
    console.error(' Erreur de connexion :', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();