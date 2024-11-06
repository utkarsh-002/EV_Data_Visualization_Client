// PenetrationChart.js

import React from "react";
import Highcharts from "highcharts";
import Highcharts3D from "highcharts/highcharts-3d";
import HighchartsReact from "highcharts-react-official";

// Initialize the 3D module
Highcharts3D(Highcharts);

const PenetrationChart = ({ data }) => {
  // Aggregate electric vehicles per state
  const aggregatedElectric = data.reduce((acc, item) => {
    acc[item.State] = (acc[item.State] || 0) + item.Electric;
    return acc;
  }, {});

  const chartData = Object.keys(aggregatedElectric).map((state) => ({
    name: state,
    y: aggregatedElectric[state],
  }));

  const options = {
    chart: {
      type: "pie",
      options3d: {
        enabled: true,
        alpha: 45,
        beta: 0,
      },
      backgroundColor: "#ffffff",
    },
    title: {
      text: "Electric Penetration by State",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        depth: 45,
        dataLabels: {
          enabled: true,
          format: "{point.name}: {point.y} ({point.percentage:.1f}%)",
        },
      },
    },
    series: [
      {
        name: "Electric Vehicles",
        data: chartData,
      },
    ],
  };

  return (
    <div className="chart-container">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default PenetrationChart;