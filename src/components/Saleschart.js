import {React, useState, useEffect} from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesChart = () => {
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data when the component mounts
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:3000/statewiseSales`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setSalesData(data);
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, []);

    // Show loading message while fetching data
    if (loading) {
      return <div>Loading data...</div>;
    }

    // Show error message if there was an error fetching data
    if (error) {
      return <div>Error fetching data: {error}</div>;
    }
    
  // Aggregate total sales per state
  const aggregatedData = salesData.reduce((acc, item) => {
    acc[item.State] = (acc[item.State] || 0) + item.Total;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(aggregatedData),
    datasets: [
      {
        label: "Total Sales",
        data: Object.values(aggregatedData),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="chart-container">
      <h2>Total Sales by State</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default SalesChart;