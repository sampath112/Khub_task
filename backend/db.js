const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const XLSX = require('xlsx');
const fs = require('fs');

const app = express();
const PORT = 5000;

// MongoDB connection URL
const MONGODB_URI = 'mongodb://0.0.0.0:27017/excel_form';

// MongoDB models and schema
const ExcelSchema = new mongoose.Schema({}, { strict: false });
const ExcelModel = mongoose.model('ExcelData', ExcelSchema);

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// API endpoint for uploading Excel file and storing in MongoDB
app.post('/api/saveExcelData', upload.single('excelFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileData = fs.readFileSync(req.file.path);
  const workbook = XLSX.read(fileData, { type: 'buffer' });
  const firstSheet = workbook.SheetNames[0];
  const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);

  ExcelModel.insertMany(excelData, (err, docs) => {
    if (err) {
      console.error('Error saving data to MongoDB:', err);
      return res.status(500).json({ error: 'Error saving data to MongoDB' });
    }

    console.log('Data saved to MongoDB:', docs);
    return res.status(200).json({ message: 'Data saved to MongoDB' });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
