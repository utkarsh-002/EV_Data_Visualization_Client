// EVSalesMap.js

import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsFullScreen from "highcharts/modules/full-screen";
import axios from "axios";
import "./styles/EVSalesMap.css";

// Initialize Highcharts modules
HighchartsExporting(Highcharts);
HighchartsFullScreen(Highcharts);

const EVSalesMap = () => {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [penData, setPenData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPenetrationData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/evTimeSeries?query=penetration"
        );
        const data = response.data;

        const processedData = data
          .map((item) => ({
            State: item.State,
            Year: Number(item.Year),
            Penetration: parseFloat(item.Penetration),
          }))
          .sort((a, b) => a.Year - b.Year);

        setPenData(processedData);
        setLoading(false);

        const uniqueStates = [
          ...new Set(processedData.map((item) => item.State)),
        ].sort();
        setStates(uniqueStates);
        if (uniqueStates.length > 0) {
          setSelectedState(uniqueStates[0]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchPenetrationData();
  }, []);

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
  };

  const filteredData = penData.filter((item) => item.State === selectedState);

  const chartOptions = {
    chart: {
      type: "line",
      events: {
        fullscreenChange: function () {
          const isFullScreen = this.fullscreen.isOpen;
          this.update({
            title: {
              text: isFullScreen
                ? `Electric Vehicle Penetration - ${selectedState} (Full Screen)`
                : `Electric Vehicle Penetration - ${selectedState}`,
            },
          });
        },
      },
    },
    title: {
      text: `Electric Vehicle Penetration - ${selectedState}`,
    },
    xAxis: {
      categories: filteredData.map((item) => item.Year),
      title: { text: "Year" },
    },
    yAxis: {
      title: { text: "Penetration (%)" },
      labels: { format: "{value}%" },
    },
    series: [
      {
        name: "Penetration",
        data: filteredData.map((item) => item.Penetration),
        color: "#3498db", // Change line color
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
          menuItems: [
            "viewFullscreen",
            "printChart"
          ],
        },
      },
    },
    credits: {
      enabled: false, // Remove Highcharts credits
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.y}%</b>",
      shared: true,
    },
  };

  if (loading) return <div className="status-message">Loading data...</div>;
  if (error) return <div className="status-message error">Error: {error}</div>;

  return (
    <div className="map-container">
      <h2>EV_Sales Penetration</h2>
      <div className="dropdown-filter">
        <label htmlFor="state-select">Select State: </label>
        <select
          id="state-select"
          value={selectedState}
          onChange={handleStateChange}
        >
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>
      <div className="chart-container">
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
    </div>
  );
};

export default EVSalesMap;