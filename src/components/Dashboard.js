import React, { useState, useEffect } from "react";
import SalesChart from "./Saleschart";
import PenetrationChart from "./PenetrationChart";
import EVSalesMap from "./EVSalesMap";
import "./Dashboard.css";

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState("evSalesByState");
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/createProcedure`, {
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

  if (loading) {
    return (
      <div className="dashboard-container">
        <h1>EV Sales Dashboard</h1>
        <p>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <h1>EV Sales Dashboard</h1>
        <p>Error: {error}</p>
      </div>
    );
  }

  // Render content based on selected option
  const renderContent = () => {
    switch (selectedOption) {
      case "evSalesByState":
        return <SalesChart data={salesData} />;
      case "electricPenetration":
        return <PenetrationChart data={salesData} />;
      case "evSalesMap":
        return <EVSalesMap data={salesData} />;
      // Add more cases for additional options
      default:
        return <SalesChart data={salesData} />;
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>EEV Data Visualization Dashboard</h1>
      </header>
      <div className="dashboard-content">
        <aside className="dashboard-sidebar">
          <ul>
            <li
              className={selectedOption === "evSalesByState" ? "active" : ""}
              onClick={() => setSelectedOption("evSalesByState")}
            >
              EV Sales by State
            </li>
            <li
              className={
                selectedOption === "electricPenetration" ? "active" : ""
              }
              onClick={() => setSelectedOption("electricPenetration")}
            >
              Electric Penetration Chart
            </li>
            <li
              className={selectedOption === "evSalesMap" ? "active" : ""}
              onClick={() => setSelectedOption("evSalesMap")}
            >
              EV Sales Map
            </li>
            {/* Add more sidebar options as needed */}
          </ul>
        </aside>
        <main className="dashboard-main">{renderContent()}</main>
      </div>
    </div>
  );
};

export default Dashboard;