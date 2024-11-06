// PenetrationChart.js

import React from "react";
import Highcharts from "highcharts";
import Highcharts3D from "highcharts/highcharts-3d";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsReact from "highcharts-react-official";
import "./styles/PenetrationChart.css";

// Initialize the 3D and exporting modules
Highcharts3D(Highcharts);
HighchartsExporting(Highcharts);

const PenetrationChart = ({ data }) => {
  // Aggregate electric vehicles per state
  const aggregatedElectric = data.reduce((acc, item) => {
    acc[item.State] = (acc[item.State] || 0) + item.Electric;
    return acc;
  }, {});

  // Convert the aggregated data into an array and sort it
  const chartData = Object.keys(aggregatedElectric).map((state) => ({
    name: state,
    y: aggregatedElectric[state],
  }));

  // Sort data in descending order
  chartData.sort((a, b) => b.y - a.y);

  // Limit to top 10 states for readability
  const topStatesData = chartData.slice(0, 10);

  // Pie Chart Options
  const pieOptions = {
    chart: {
      type: "pie",
      options3d: {
        enabled: true,
        alpha: 45,
      },
      backgroundColor: "#f0f3f4",
    },
    title: {
      text: "Top 10 States - Electric Vehicle Penetration (Pie Chart)",
    },
    tooltip: {
      pointFormat: "<b>{point.y}</b> EVs ({point.percentage:.1f}%)",
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        depth: 35,
        dataLabels: {
          enabled: true,
          format: "{point.name}: {point.percentage:.1f}%",
        },
      },
    },
    series: [
      {
        name: "Electric Vehicles",
        data: topStatesData,
      },
    ],
  };

  // Bar Chart Options
  const barOptions = {
    chart: {
      type: "bar",
      backgroundColor: "#f0f3f4",
    },
    title: {
      text: "Top 10 States - Electric Vehicle Penetration (Bar Chart)",
    },
    xAxis: {
      categories: topStatesData.map((item) => item.name),
      title: {
        text: null,
      },
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Number of Electric Vehicles",
        align: "high",
      },
      labels: {
        overflow: "justify",
      },
    },
    tooltip: {
      valueSuffix: " EVs",
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
        },
      },
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        name: "Electric Vehicles",
        data: topStatesData.map((item) => item.y),
        color: "#1abc9c",
      },
    ],
  };

  return (
    <div className="penetration-chart">
      <div className="chart-container">
        <HighchartsReact highcharts={Highcharts} options={pieOptions} />
      </div>
      <div className="chart-container">
        <HighchartsReact highcharts={Highcharts} options={barOptions} />
      </div>
    </div>
  );
};

export default PenetrationChart;
