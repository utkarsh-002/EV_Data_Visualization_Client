// PenetrationChart.js

import {React, useState, useEffect} from "react";
import Highcharts from "highcharts";
import Highcharts3D from "highcharts/highcharts-3d";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsReact from "highcharts-react-official";
import "./styles/PenetrationChart.css";

// Initialize the 3D and exporting modules
Highcharts3D(Highcharts);
HighchartsExporting(Highcharts);

const PenetrationChart = () => {

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

  // Aggregate electric vehicles per state
  const aggregatedElectric = salesData.reduce((acc, item) => {
    acc[item.State] = (acc[item.State] || 0) + item.Electric;
    return acc;
  }, {});

  const aggregatedTotal = salesData.reduce((acc, item) => {
    acc[item.State] = (acc[item.State] || 0) + item.Total;
    return acc;
  }, {});

  // Convert the aggregated data into an array and sort it
  const chartData = Object.keys(aggregatedElectric).map((state) => ({
    name: state,
    y: aggregatedElectric[state],
  }));

  chartData.sort((a, b) => b.y - a.y);


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
      text: "Electric Vehicle Penetration by State (All States)"
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
        data: chartData,
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
      text: "Electric Vehicle Penetration by State (All States)",
    },
    xAxis: {
      categories: chartData.map((item) => item.name),
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
        data: chartData.map((item) => item.y),
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