// EVSalesPivot.js

import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsFullScreen from "highcharts/modules/full-screen";
import axios from "axios";
import "./styles/EVSalesPivot.css"; // Ensure this path is correct

// Initialize Highcharts modules
HighchartsExporting(Highcharts);
HighchartsFullScreen(Highcharts);

const EVSalesPivot = () => {
  const [data, setData] = useState([]);
  const [states, setStates] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPivotData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/evTimeSeries?query=pivot"
        );
        const fetchedData = response.data;

        if (fetchedData.length === 0) {
          setError("No data available.");
          setLoading(false);
          return;
        }

        // Extract years by excluding the 'State' key
        const yearKeys = Object.keys(fetchedData[0])
          .filter((key) => key !== "State")
          .sort();

        setYears(yearKeys);

        // Extract state names
        const stateNames = fetchedData.map((item) => item.State);
        setStates(stateNames);

        // Set default selected state
        setSelectedState(stateNames[0]);

        setData(fetchedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching pivot data:", err);
        setError("Failed to fetch pivot data.");
        setLoading(false);
      }
    };

    fetchPivotData();
  }, []);

  // Handle state selection change
  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
  };

  // Prepare series data based on selected state
  const prepareSeriesData = () => {
    if (!selectedState) return [];

    const selectedStateData = data.find((item) => item.State === selectedState);

    if (!selectedStateData) return [];

    return [
      {
        name: selectedState,
        data: years.map((year) => selectedStateData[year]),
        color: "#3498db", // Optional: Customize the series color
        marker: {
          symbol: "circle",
          radius: 5,
        },
      },
    ];
  };

  const chartOptions = {
    chart: {
      type: "column",
      events: {
        fullscreenChange: function () {
          const isFullScreen = this.fullscreen.isOpen;
          this.update({
            title: {
              text: isFullScreen
                ? `EV Sales Pivot Chart - ${selectedState} (Full Screen)`
                : `EV Sales Pivot Chart - ${selectedState}`,
            },
          });
        },
      },
    },
    title: {
      text: `EV Sales Pivot Chart - ${selectedState}`,
    },
    xAxis: {
      categories: years,
      title: { text: "Year" },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Number of EV Sales",
      },
      labels: {
        formatter: function () {
          return this.value;
        },
      },
    },
    tooltip: {
      headerFormat: "<b>{point.x}</b><br/>",
      pointFormat: "{series.name}: {point.y}<br/>Total: {point.y}",
      shared: true,
    },
    plotOptions: {
      column: {
        stacking: "normal",
        dataLabels: {
          enabled: true,
          formatter: function () {
            return this.y;
          },
        },
      },
    },
    series: prepareSeriesData(),
    exporting: {
      enabled: true,
      buttons: {
        contextButton: {
          menuItems: [
            "viewFullscreen",
            "printChart",
            "separator",
            "downloadPNG",
            "downloadJPEG",
            "downloadPDF",
            "downloadSVG",
          ],
        },
      },
    },
    credits: {
      enabled: false, // Remove Highcharts credits
    },
  };

  if (loading)
    return <div className="status-message">Loading pivot chart...</div>;
  if (error) return <div className="status-message error">Error: {error}</div>;

  return (
    <div className="pivot-container">
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
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default EVSalesPivot;