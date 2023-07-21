import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Dropzone from 'react-dropzone';
import './App.css';
import Plot from 'react-plotly.js';
import axios from 'axios';

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
  });
  const [formDataSet, setFormDataSet] = useState([]); // State to store the form data set

  // Function to save data to the database
  const saveToDatabase = (data) => {
    axios
      .post('/api/saveExcelData', data)
      .then((response) => {
        console.log(response.data.message);
        // Optionally, you can show a success message to the user
      })
      .catch((error) => {
        console.error('Error saving data to the database:', error);
        // Optionally, you can show an error message to the user
      });
  };

  // Function to handle file upload
  const handleFileUpload = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.SheetNames[0];
      const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);

      // Remove columns with all null values
      const filteredData = excelData.filter((item) => !Object.values(item).every((value) => value === null));

      // Set the filtered data to the state
      setFilteredData(filteredData);
    };
    reader.readAsArrayBuffer(file);
    saveToDatabase(filteredData);
  };

  // Function to handle form input change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Function to handle saving Excel file for form data
  const handleSaveFormExcelFile = () => {
    if (formDataSet.length === 0) {
      alert('Form data is empty. Fill the form and try again.');
      return;
    }

    // Create a new workbook with a single worksheet
    const worksheet = XLSX.utils.json_to_sheet(formDataSet);

    // Create a new workbook with the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'FormData');

    // Convert the workbook to an array buffer
    const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

    // Save the data as an Excel file
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'form_data.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to handle saving the form data
  const handleSaveFormData = () => {
    setFormDataSet((prevFormDataSet) => [...prevFormDataSet, formData]);
    setFormData({
      name: '',
      age: '',
      email: '',
    });
  };

  // Function to render charts
  const renderCharts = () => {
    if (filteredData) {
      const columns = Object.keys(filteredData[0]);
      const traces = columns.map((column) => ({
        x: filteredData.map((item) => item[column]),
        y: filteredData.map((item) => item[column]),
        type: 'scatter', // Use 'scatter' for line charts and scatter plots
        mode: 'lines+markers', // Show lines and markers for line charts and scatter plots
        name: column,
      }));

      const barTraces = columns.map((column) => ({
        x: columns,
        y: filteredData.map((item) => item[column]),
        type: 'bar',
        name: column,
      }));

      const lineTraces = columns.map((column) => ({
        x: filteredData.map((item) => item[column]),
        y: filteredData.map((item) => item[column]),
        type: 'line',
        name: column,
      }));

      const pieTrace = {
        labels: columns,
        values: columns.map((column) => filteredData.length),
        type: 'pie',
        name: 'Pie Chart',
      };

      return (
        <>
          <h2>Line Charts</h2>
          <Plot data={lineTraces} layout={{ title: 'Line Charts' }} />
          <h2>Scatter Plots</h2>
          <Plot data={traces} layout={{ title: 'Scatter Plots' }} />
          <h2>Bar Charts</h2>
          <Plot data={barTraces} layout={{ title: 'Bar Charts', barmode: 'group' }} />
          <h2>Pie Chart</h2>
          <Plot data={[pieTrace]} layout={{ title: 'Pie Chart' }} />
        </>
      );
    }
  };


  return (
    <div className="container">
      <h1 className="title">Excel Upload App</h1>
      <div className="toggle-buttons">
        <button onClick={() => setShowForm(false)}>Upload Excel</button>
        <button onClick={() => setShowForm(true)}>Fill Form</button>
      </div>
      {!showForm && (
        <Dropzone onDrop={handleFileUpload}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} />
              <p>Drag and drop an Excel file here, or click to select one.</p>
              {uploadedFile && <p className="file-info">Uploaded File: {uploadedFile.name}</p>}
            </div>
          )}
        </Dropzone>
      )}
      {showForm && (
        <div className="form-container">
          <h2>Add Data</h2>
          <form className="data-form">
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleFormChange} />
            <input type="text" name="age" placeholder="Age" value={formData.age} onChange={handleFormChange} />
            <input type="text" name="email" placeholder="Email" value={formData.email} onChange={handleFormChange} />
          </form>
          <button onClick={handleSaveFormData}>Save Form Data</button>
          <button onClick={handleSaveFormExcelFile}>Save Form Data as Excel</button>
        </div>
      )}
      {filteredData && renderCharts()}
    </div>
  );
}

export default App;
