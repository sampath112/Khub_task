// backend/routes/upload.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const Data = require('../models/dataModel');

// Multer configuration to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// Excel file upload route
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Save the data to MongoDB
    Data.insertMany(sheetData, (err, data) => {
      if (err) {
        console.error('Error saving data to MongoDB:', err);
        res.status(500).json({ error: 'Error saving data to MongoDB' });
      } else {
        res.status(200).json({ message: 'Data saved successfully' });
      }
    });
  } catch (err) {
    console.error('Error parsing the Excel file:', err);
    res.status(400).json({ error: 'Error parsing the Excel file' });
  }
});

module.exports = router;