import React, { useEffect, useState, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "./styles/timeSeriesCategory.css"; 

const EVTimeSeries = () => {
  const [data, setData] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimeSeriesData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/evTimeSeries?query=timeSeries"
        );
        const fetchedData = await response.json();

        if (fetchedData.length === 0) {
          setError("No data available.");
          setLoading(false);
          return;
        }

        // Extract unique state names and years
        const stateNames = [
          ...new Set(fetchedData.map((item) => item.State)),
        ].sort();
        const yearKeys = [
          ...new Set(fetchedData.map((item) => item.Year)),
        ].sort();

        setStates(stateNames);
        setYears(yearKeys);

        // Set default selected state
        setSelectedState(stateNames[0]);

        setData(fetchedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching time series data:", err);
        setError("Failed to fetch time series data.");
        setLoading(false);
      }
    };

    fetchTimeSeriesData();
  }, []);

  // Handle state selection change
  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
  };

  // Prepare data for the charts
  const prepareChartData = () => {
    if (!selectedState) return { lineData: [], circleData: [] };

    const filteredData = data.filter((item) => item.State === selectedState);

    const vehicleCategories = [
      ...new Set(filteredData.map((item) => item["Vehicle Category"])),
    ];

    const lineData = vehicleCategories.map((category) => ({
      name: category,
      data: years.map((year) => {
        const yearData = filteredData.find(
          (item) => item.Year === year && item["Vehicle Category"] === category
        );
        return yearData ? parseFloat(yearData.Ratio) : 0;
      }),
    }));

    const circleData = filteredData.map((item) => ({
      name: `${item.Year} - ${item["Vehicle Category"]}`,
      y: item.Electric,
      ratio: parseFloat(item.Ratio),
    }));

    return { lineData, circleData };
  };

  const { lineData, circleData } = prepareChartData();

  const lineChartOptions = useMemo(
    () => ({
      chart: {
        type: "line",
      },
      title: {
        text: `EV Sales Ratio by Vehicle Category for ${selectedState}`,
      },
      xAxis: {
        categories: years,
        title: {
          text: "Year",
        },
      },
      yAxis: {
        title: {
          text: "EV Sales Ratio",
        },
        labels: {
          format: "{value}%",
        },
      },
      tooltip: {
        shared: true,
        formatter: function () {
          return `<b>${this.x}</b><br/>${this.points
            .map((point) => `${point.series.name}: ${point.y.toFixed(2)}%`)
            .join("<br/>")}`;
        },
      },
      series: lineData,
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: ["viewFullscreen", "printChart"],
          },
        },
      },
    }),
    [selectedState, years, lineData]
  );

  const circleChartOptions = useMemo(
    () => ({
      chart: {
        type: "pie",
      },
      title: {
        text: `EV Sales Distribution by Vehicle Category for ${selectedState}`,
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
          data: circleData,
        },
      ],
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: ["viewFullscreen", "printChart"],
          },
        },
      },
    }),
    [selectedState, circleData]
  );

  if (loading)
    return <div className="status-message">Loading time series data...</div>;
  if (error) return <div className="status-message error">Error: {error}</div>;

  return (
    <div className="timeseries-container">
      <div className="dropdown-filter">
        <label htmlFor="state-select">Select State: </label>
        <select
          id="state-select"
          value={selectedState}
          onChange={handleStateChange}
          aria-label="Select State for EV Time Series Chart"
        >
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>
      <HighchartsReact highcharts={Highcharts} options={lineChartOptions} />
      <HighchartsReact highcharts={Highcharts} options={circleChartOptions} />
    </div>
  );
};

export default EVTimeSeries;