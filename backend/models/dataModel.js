// backend/models/dataModel.js
const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  name: String,
  age: Number,
  // Add other fields based on your Excel data columns
});

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;