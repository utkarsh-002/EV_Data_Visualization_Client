import React, { useEffect, useState, useMemo } from "react";
import Highcharts, { color } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "./styles/Saleschart.css";

const SalesChart = () => {
  const [data, setData] = useState([]);
  const [allStates, setAllStates] = useState([]);
  const [top10States, setTop10States] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/statewiseSales");
        const result = await response.json();
        setData(result);
        
        const aggregatedData = result.reduce((acc, item) => {
          acc[item.State] = (acc[item.State] || 0) + item.Electric;
          return acc;
        }, {});

        setData(aggregatedData);

        // Calculate total sales across all states
        const total = Object.values(aggregatedData).reduce((a, b) => a + b, 0);
        setTotalSales(total);

        // Calculate ratio and sort top 10 states
        const statesWithRatio = Object.entries(aggregatedData).map(
          ([state, sales]) => ({
            state,
            sales,
            ratio: (sales / total) * 100,
          })
        );

        statesWithRatio.sort((a, b) => b.ratio - a.ratio);
        const top10 = statesWithRatio.slice(0, 10);
        setTop10States(top10);

        // Prepare all states data with top10 flag
        const allStatesData = statesWithRatio.map((item) => ({
          name: item.state,
          y: item.sales,
          ratio: item.ratio,
          isTop10: top10.some((top) => top.state === item.state),
        }));
        setAllStates(allStatesData);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching sales data:", err);
        setError("Failed to load sales data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const top10Colors = [
    "#FF5733", "#33FF57", "#3357FF", "#F1C40F", "#9B59B6",
    "#E67E22", "#1ABC9C", "#34495E", "#E74C3C", "#2ECC71"
  ];

  const chartOptions = useMemo(
    () => ({
      chart: {
        type: "column",
        height: 750,
        scrollablePlotArea: {
          minWidth: allStates.length * 40,
          scrollPositionX: 1,
        },
      },
      title: {
        text: "EV Sales by State(2014-24)",
      },
      xAxis: {
        categories: allStates.map((item) => item.name),
        title: {
          text: "State",
        },
        labels: {
          rotation: -45,
          style: {
            fontSize: "12px",
            fontFamily: "Verdana, sans-serif",
            color: function () {
              const stateData = allStates.find(
                (item) => item.name === this.value
              );
              return stateData && stateData.isTop10 ? "#FF5733" : "#7FB3D5";
            },
          },
        },
      },
      yAxis: {
        min: 0,
        tickInterval: 500,
        title: {
          text: "Number of EV Sales",
        },
      },
      tooltip: {
        formatter: function () {
          const stateData = allStates.find((item) => item.name === this.key);
          if (stateData) {
            return `<b>${this.key}</b><br/>Total Sales: ${
              stateData.y
            }<br/>Ratio: ${stateData.ratio.toFixed(4)}%`;
          }
          return `<b>${this.key}</b>`;
        },
      },
      plotOptions: {
        column: {
          colorByPoint: false,
          dataLabels: {
            enabled: false,
          },
          pointWidth: 20,
          groupPadding: 0.1,
          pointpadding: 0.1,
        },
      },
      legend: {
        enabled: true,
        layout: "vertical",
        align: "right",
        verticalAlign: "middle",
      },
      series: [
        {
          name: "EV Sales",
          data: allStates.map((item) => {
            const colorIndex = top10States.findIndex(
              (top) => top.state === item.name
            );
            const color =
              item.isTop10 && colorIndex !== -1
                ? top10Colors[colorIndex % top10Colors.length]
                : "#7FB3D5";
            return {
              name: item.name,
              y: item.y,
              color: color,
            }; 
          }),
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
    [allStates, top10States]
  );

  const chartData = Object.keys(data).map((state) => ({
    name: state,
    y: data[state],
  }));

  chartData.sort((a, b) => b.y - a.y);

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
      text: "Electric Vehicle Penetration by State (All States)",
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

  if (loading)
    return <div className="status-message">Loading sales chart...</div>;
  if (error) return <div className="status-message error">Error: {error}</div>;

  return (
    <>
    <div className="chart-container">
        <HighchartsReact highcharts={Highcharts} options={pieOptions} />
      </div>
    <div className="chart-container">
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
    </>
  );
};

export default SalesChart;
