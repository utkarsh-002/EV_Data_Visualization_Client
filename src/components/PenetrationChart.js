import React, { useState, useEffect } from "react";
import Highcharts, { chart } from "highcharts";
import Highcharts3D from "highcharts/highcharts-3d";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsReact from "highcharts-react-official";
import "./styles/PenetrationChart.css"; // Import the customized CSS if available

Highcharts3D(Highcharts);
HighchartsExporting(Highcharts);

const PenetrationChart = () => {

    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allStates, setAllStates] = useState([]);

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
          const allStatesData = data.map((item) => ({
            State: item.State,
            "Vehicle Category": item["Vehicle Category"],
            Electric: item.Electric,
            Total: item.Total,
            Ratio: item.Ratio,
          }));
          setAllStates(allStatesData);
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

  const chartData = Object.keys(aggregatedElectric).map((state) => ({
    name: state,
    y: aggregatedElectric[state],
    z: aggregatedTotal[state],
  }));

  chartData.sort((a, b) => b.y - a.y);

  const vehicleCategories = [
    "Others",
    "2-Wheelers",
    "4-Wheelers",
    "3-Wheelers",
    "Bus"
  ];

  // Prepare categories for xAxis (States)
  const categories = [...new Set(allStates.map((item) => item.State))];

  // Prepare series data
  const seriesData = vehicleCategories.map((category) => ({
    name: category,
    data: categories.map((state) => {
      const stateData = allStates.find(
        (item) => item.State === state && item["Vehicle Category"] === category
      );
      return stateData
        ? {
            y: stateData.Electric,
            ratio: parseFloat(stateData.Ratio) * 100,
          }
        : { y: 0, ratio: 0 };
    }),
  }));

  const barOptions = {
    chart: {
      type: "column",
      backgroundColor: "#f0f3f4",
      height: 650,
      marginBottom: 150,
    },
    title: {
      text: "Electric Vehicle Sales by State and Vehicle Category",
    },
    xAxis: {
      categories: categories,
      title: { text: "State" },
      labels: {
        rotation: -45,
        style: {
          fontSize: "12px",
          fontFamily: "Verdana, sans-serif",
        },
      },
      lineColor: "#000000",
      lineWidth: 1,
    },
    yAxis: {
      min: 0,
      title: { text: "Number of Electric Vehicle Sales" },
      labels: { format: "{value}" },
      gridLineWidth: 1,
      startOnTick: true,
      endOnTick: true, 
    },
    tooltip: {
      shared: true,
      formatter: function () {
        let tooltipText = `<b>${this.x}</b>`;
        this.points.forEach((point) => {
          tooltipText += `<br/>${point.series.name}: ${point.y} EVs (Ratio: ${point.point.ratio.toFixed(
            4
          )}%)`;
        });
        return tooltipText;
      },
    },
    plotOptions: {
      column: {
        stacking: null,
        dataLabels: {
          enabled: false,
        },
      },
    },
    series: seriesData,
    credits: { enabled: false },
    exporting: {
      enabled: true,
      buttons: {
        contextButton: {
          menuItems: ["viewFullscreen", "printChart"],
        },
      },
    },
  };

  const chartOption = {
    chart: {
      type: "line",
      height: 650,
      scrollablePlotArea: {
        minWidth: 700,
        scrollPositionX: 1,
      }
    },
    title: {
      text: "Electric Vehicle Penetration (EV vs Total Sales)",
    },
    xAxis: {
      categories: chartData.map((item) => item.name),
      title: { text: "State" },
    },
    yAxis: {
      title: { text: "Ratio(EV vs Total Vehicle)" },
      labels: { format: "{value}" },
    },
    series: [
      {
        name: "Ratio",
        data: chartData.map((item) => item.y / item.z),
        color: "#3498db",
        marker: {
          symbol: "circle",
          radius: 5,
        },
      },
    ],
    exporting: {
      enabled: true,
      buttons: {
        contextButton: {
          menuItems: ["viewFullscreen", "printChart"],
        },
      },
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.y}</b>",
    },
  };

  return (
    <div className="penetration-chart">
      <div className="chart-container">
        <HighchartsReact highcharts={Highcharts} options={chartOption} />
      </div>
      <div className="chart-container">
        <HighchartsReact highcharts={Highcharts} options={barOptions} />
      </div>
    </div>
  );
};

export default PenetrationChart;