// backend/routes/data.js
const express = require('express');
const router = express.Router();
const Data = require('../models/dataModel');

// Fetch data from MongoDB
router.get('/data', async (req, res) => {
  try {
    const data = await Data.find({});
    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching data from MongoDB:', err);
    res.status(500).json({ error: 'Error fetching data from MongoDB' });
  }
});

module.exports = router;