// frontend/src/components/PieChart.js
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';

const PieChart = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/data');
      // Process data for the pie chart
      const processedData = processDataForPieChart(response.data);
      setChartData(processedData);
    } catch (err) {
      console.error('Error fetching data:', err);
      alert('Error fetching data. Please try again.');
    }
  };

  const processDataForPieChart = (data) => {
    // Process the data to suit the pie chart format
    // You may need to customize this based on your Excel data
    // For example, grouping by a specific field and calculating counts

    return {
      labels: ['Label 1', 'Label 2', 'Label 3'], // Replace with actual labels
      datasets: [
        {
          label: 'Pie Chart Data',
          data: [10, 20, 30], // Replace with actual data
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Replace with colors as needed
        },
      ],
    };
  };

  return (
    <div>
      <h2>Pie Chart</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default PieChart;