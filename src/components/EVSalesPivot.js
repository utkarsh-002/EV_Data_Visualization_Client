// EVSalesPivot.js

import React, { useEffect, useState, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "./styles/EVSalesPivot.css"; // Ensure the customized CSS file is imported

const EVSalesPivot = () => {
  const [data, setData] = useState([]);
  const [states, setStates] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [totalSales, setTotalSales] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPivotData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/evTimeSeries?query=pivot"
        );
        const fetchedData = await response.json();

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

        // Extract unique state names using Set to avoid duplicates
        const stateNames = [
          ...new Set(fetchedData.map((item) => item.State)),
        ].sort();

        setStates(stateNames);

        // Set default selected state
        setSelectedState(stateNames[0]);

        setData(fetchedData);

        // Calculate total sales per year across all states
        const totals = {};
        fetchedData.forEach((item) => {
          yearKeys.forEach((year) => {
            totals[year] =
              (totals[year] || 0) + (parseInt(item[year], 10) || 0);
          });
        });
        setTotalSales(totals);

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

  // Prepare series data based on selected state and total sales
  const prepareSeriesData = () => {
    if (!selectedState) return [];

    const selectedStateData = data.find(
      (item) => item.State === selectedState
    );

    if (!selectedStateData) return [];

    return [
      {
        name: "Total Sales",
        data: years.map((year) => totalSales[year]),
        color: "rgba(211, 211, 211, 0.5)",
      },
      {
        name: selectedState,
        data: years.map((year) => selectedStateData[year]),
        color: "#3498db",
        marker: {
          symbol: "circle",
          radius: 5,
        },
        borderWidth: 1,
      },
    ];
  };

  // Prepare pie chart data based on selected state
  const preparePieChartData = () => {
    if (!selectedState) return [];

    const selectedStateData = data.find(
      (item) => item.State === selectedState
    );

    if (!selectedStateData) return [];

    return years.map((year) => ({
      name: year,
      y: selectedStateData[year],
    }));
  };

  const chartOptions = useMemo(
    () => ({
      chart: {
        type: "column",
        events: {
          fullscreenChange: function () {
            const isFullScreen = this.fullscreen.isOpen;
            this.update({
              title: {
                text: isFullScreen
                  ? `Year-wise Comparison of Total and State-specific EV Sales - ${selectedState} (Full Screen)`
                  : `Year-wise Comparison of Total and State-specific EV Sales - ${selectedState}`,
              },
            });
          },
        },
      },
      title: {
        text: `Year-wise Comparison of Total and State-specific EV Sales - ${selectedState}`,
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
        formatter: function () {
          const year = this.x;
          const stateSales =
            this.series.name === selectedState ? this.y : null;
          const total = totalSales[year] || 0;
          const ratio =
            stateSales ? ((stateSales / total) * 100).toFixed(2) : null;

          if (this.series.name === selectedState) {
            return `<b>${year}</b><br/>${selectedState}: ${stateSales}<br/>Total: ${total}<br/>Ratio: ${ratio}%`;
          } else if (this.series.name === "Total Sales") {
            return `<b>${year}</b><br/>Total Sales: ${total}`;
          }
          return `<b>${year}</b>`;
        },
      },
      plotOptions: {
        column: {
          stacking: null,
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
              "printChart"
            ],
          },
        },
      },
      credits: {
        enabled: false,
      },
      totals: totalSales,
    }),
    [selectedState, years, totalSales]
  );

  const pieChartOptions = useMemo(
    () => ({
      chart: {
        type: "pie",
        backgroundColor: "#f0f3f4",
      },
      title: {
        text: `EV Sales Distribution for ${selectedState} (2014-2024)`,
      },
      tooltip: {
        pointFormat: "<b>{point.y}</b> EVs ({point.percentage:.1f}%)",
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "{point.name}: {point.percentage:.1f}%",
          },
        },
      },
      series: [
        {
          name: "EV Sales",
          data: preparePieChartData(),
        },
      ],
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: [
              "viewFullscreen",
              "printChart",
            ],
          },
        },
      },
    }),
    [selectedState, years, data]
  );

  if (loading)
    return <div className="status-message">Loading pivot chart...</div>;
  if (error)
    return <div className="status-message error">Error: {error}</div>;

  return (
    <div className="pivot-container">
      <div className="dropdown-filter">
        <label htmlFor="state-select">Select State: </label>
        <select
          id="state-select"
          value={selectedState}
          onChange={handleStateChange}
          aria-label="Select State for EV Sales Pivot Chart"
        >
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      <HighchartsReact highcharts={Highcharts} options={pieChartOptions} />
    </div>
  );
};

export default EVSalesPivot;