// frontend/src/components/BarGraph.js
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

const BarGraph = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/data');
      // Process data for the bar graph
      const processedData = processDataForBarGraph(response.data);
      setChartData(processedData);
    } catch (err) {
      console.error('Error fetching data:', err);
      alert('Error fetching data. Please try again.');
    }
  };

  const processDataForBarGraph = (data) => {
    // Process the data to suit the bar graph format
    // You may need to customize this based on your Excel data
    // For example, grouping by a specific field and calculating counts

    return {
      labels: ['Label 1', 'Label 2', 'Label 3'], // Replace with actual labels
      datasets: [
        {
          label: 'Bar Graph Data',
          data: [50, 75, 100], // Replace with actual data
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Replace with colors as needed
        },
      ],
    };
  };

  return (
    <div>
      <h2>Bar Graph</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default BarGraph;