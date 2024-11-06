import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesChart = ({ data }) => {
  // Aggregate total sales per state
  const aggregatedData = data.reduce((acc, item) => {
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