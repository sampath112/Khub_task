// frontend/src/components/DataTable.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DataTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/data');
      setData(response.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      alert('Error fetching data. Please try again.');
    }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            {/* Add other columns based on your Excel data */}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.age}</td>
              {/* Add other columns based on your Excel data */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;