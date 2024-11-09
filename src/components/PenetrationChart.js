import {React, useState, useEffect} from "react";
import Highcharts, { chart } from "highcharts";
import Highcharts3D from "highcharts/highcharts-3d";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsReact from "highcharts-react-official";
import "./styles/PenetrationChart.css";

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
            name: item.State,
            "Electric Vehicles": item["Electric Vehicles"],
            y: item.Electric,
            z: item.Total,
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

  // Bar Chart Options
  const barOptions = {
    chart: {
      type: "bar",
      backgroundColor: "#f0f3f4",
      height: 750,
      scrollablePlotArea: {
        minHeight: allStates.length * 50,
        scrollPositionY: 1,
      },
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
      tickInterval: 500,
      title: {
        text: "Number of EV Sales",
        align: "high",
      },
      labels: {
        overflow: "justify",
      },
    },
    tooltip: {
      formatter: function () {
      const stateName = chartData.find((item) => item.name === this.x);
      const totalEVSales = stateName.y;
      const totalSales = stateName.z;
      const ratio = totalEVSales / totalSales;
      return `<b>${this.x}</b><br/>
        Total EV Sales: ${totalEVSales}<br/>
        Total Vehicle Sales: ${totalSales}<br/>
        EV Penetration Rate: ${(ratio * 100).toFixed(4)}%`;
      },
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: false,
        },
      }
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