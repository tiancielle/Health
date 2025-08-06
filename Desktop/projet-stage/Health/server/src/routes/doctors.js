// server/src/routes/doctors.js
const express = require('express');
console.log(' express chargé');
const prisma = require('../prismaClient');
console.log(' prisma:', prisma ? 'OK' : 'ÉCHEC');
if (!prisma) {
  throw new Error('Prisma non chargé');
}

const router = express.Router();
console.log(' router créé');

console.log(' Type de express :', typeof express);
console.log(' express.Router existe ?', typeof express.Router === 'function');
console.log(' express.version ?', express.version || 'pas de version');

// GET /api/doctors?query=&location=
router.get('/', async (req, res) => {
  const { query, location } = req.query;

  try {
    const where = {
      user: {
        role: 'doctor'
      },
      available: true
    };

    if (query) {
      where.OR = [
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
        { specialty: { name: { contains: query, mode: 'insensitive' } } }
      ];
    }

    if (location) {
      where.city = { contains: location, mode: 'insensitive' };
    }

    const doctors = await prisma.doctor.findMany({
      where,
      include: {
        user: true,
        specialty: true
      }
    });

    const formattedDoctors = doctors.map(d => ({
      id: d.id,
      firstName: d.firstName,
      lastName: d.lastName,
      specialty: d.specialty.name.toLowerCase().replace(' ', '-'),
      rating: 4.5, // À ajouter plus tard
      reviewCount: 0,
      profileImage: d.pictureUrl || null,
      location: `${d.city}, ${d.postalCode}`,
      address: d.address,
      distance: '2.5 km',
      nextAvailableSlot: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      consultationFee: 100,
      languages: ['English'],
      experience: 10,
      verified: true,
      acceptsInsurance: true,
      availableToday: d.available
    }));

    res.json({
      doctors: formattedDoctors,
      total: formattedDoctors.length,
      page: 1,
      limit: 10,
      totalPages: 1
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
module.exports = router;

// 🔥 Ajoute ces lignes POUR DÉBOGUER
console.log('✅ Export du routeur:', router);
console.log('🔧 router est un objet ?', typeof router === 'object');
console.log('🔧 router a une méthode "handle" ?', typeof router.handle === 'function');
console.log('🔧 router.stack existe ?', Array.isArray(router.stack));