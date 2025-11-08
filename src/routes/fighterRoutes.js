const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const storage = require('../models/localStorage');

const router = express.Router();

/**
 * @swagger
 * /api/fighters:
 *   get:
 *     tags:
 *       - Fighters
 *     summary: Get all fighters
 *     description: Retrieve a list of all fighters
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of fighters
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, (req, res) => {
  const fighters = storage.getFighters();
  res.status(200).json(fighters);
});

/**
 * @swagger
 * /api/fighters/search:
 *   get:
 *     tags:
 *       - Fighters
 *     summary: Search fighters
 *     description: Search fighters by name or weight class
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Fighter name to search for
 *       - in: query
 *         name: weightClass
 *         schema:
 *           type: string
 *         description: Weight class to filter by
 *     responses:
 *       200:
 *         description: List of matching fighters
 *       401:
 *         description: Unauthorized
 */
router.get('/search', authMiddleware, (req, res) => {
  const { name, weightClass } = req.query;
  let results = [];

  if (name) {
    results = storage.findFighterByName(name);
  } else if (weightClass) {
    results = storage.findFightersByWeightClass(weightClass);
  } else {
    return res.status(400).json({ message: 'Please provide either name or weightClass parameter' });
  }

  res.status(200).json(results);
});

/**
 * @swagger
 * /api/fighters:
 *   post:
 *     tags:
 *       - Fighters
 *     summary: Create a new fighter
 *     description: Add a new fighter to the database
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *               weightClass:
 *                 type: string
 *               nationality:
 *                 type: string
 *               specialty:
 *                 type: string
 *               record:
 *                 type: string
 *     responses:
 *       201:
 *         description: Fighter created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, (req, res) => {
  const { name, image, weightClass, nationality, specialty, record } = req.body;

  if (!name || !weightClass || !nationality || !specialty || !record) {
    return res.status(400).json({ message: 'All fields except image are required' });
  }

  const newFighter = {
    id: storage.getFighters().length + 1,
    name,
    image: image || 'default-fighter.png',
    weightClass,
    nationality,
    specialty,
    record
  };

  storage.addFighter(newFighter);
  res.status(201).json(newFighter);
});

/**
 * @swagger
 * /api/fighters/{id}:
 *   put:
 *     tags:
 *       - Fighters
 *     summary: Update a fighter
 *     description: Update an existing fighter's information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *               weightClass:
 *                 type: string
 *               nationality:
 *                 type: string
 *               specialty:
 *                 type: string
 *               record:
 *                 type: string
 *     responses:
 *       200:
 *         description: Fighter updated successfully
 *       404:
 *         description: Fighter not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const updateData = req.body;

  if (storage.updateFighter(id, updateData)) {
    res.json({ message: 'Fighter updated successfully' });
  } else {
    res.status(404).json({ message: 'Fighter not found' });
  }
});

/**
 * @swagger
 * /api/fighters/{id}:
 *   delete:
 *     tags:
 *       - Fighters
 *     summary: Delete a fighter
 *     description: Remove a fighter from the database
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Fighter deleted successfully
 *       404:
 *         description: Fighter not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);

  if (storage.deleteFighter(id)) {
    res.json({ message: 'Fighter deleted successfully' });
  } else {
    res.status(404).json({ message: 'Fighter not found' });
  }
});

module.exports = router;