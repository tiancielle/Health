
// module.exports = router;
// server/src/routes/doctors.js
const express = require('express');
const prisma = require('../prismaClient');
const router = express.Router();

// GET /api/doctors?query=&location=
router.get('/', async (req, res) => {
  const { query, location } = req.query;

  try {
    // Filtre Prisma
    const where = {
      user: { role: 'doctor' },
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

    // Formate pour le frontend
    const formatted = doctors.map(d => ({
      id: d.id,
      firstName: d.firstName,
      lastName: d.lastName,
      specialty: d.specialty.name.toLowerCase().replace(/\s+/g, '-'),
      rating: d.rating || 4.5,
      reviewCount: d.reviewCount || 0,
      profileImage: d.pictureUrl || null,
      location: `${d.city}, ${d.postalCode}`,
      address: d.address,
      distance: '2.5 km',
      nextAvailableSlot: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      consultationFee: d.consultationFee || 100,
      languages: ['English'], // À ajouter dans la DB plus tard
      experience: d.experience || 10,
      verified: d.verified || false,
      acceptsInsurance: d.acceptsInsurance || false,
      availableToday: d.available
    }));

    res.json({
      doctors: formatted,
      total: formatted.length,
      page: 1,
      limit: 10,
      totalPages: 1
    });
  } catch (error) {
    console.error('Erreur /api/doctors:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;