import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registering required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesChart = ({ data }) => {
  const salesChartData = {
    labels: data.map((item) => item.state), // States for y-axis
    datasets: [
      {
        label: "EV Sales",
        data: data.map((item) => item.sales),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div className="chart-container">
      <h3>EV Sales by State</h3>
      <Bar
        data={salesChartData}
        options={{
          indexAxis: "y", // Displaying states on y-axis
          scales: {
            x: {
              beginAtZero: true, // x-axis starts at 0
              title: {
                display: true,
                text: "EV Sales",
              },
            },
            y: {
              title: {
                display: true,
                text: "State",
              },
              ticks: {
                autoSkip: false, // Ensures all states appear on the y-axis
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
          },
          responsive: true,
          maintainAspectRatio: false, // Ensure the chart is not distorted
        }}
        height={400} // Setting a fixed height for the chart canvas
      />
    </div>
  );
};

export default SalesChart;