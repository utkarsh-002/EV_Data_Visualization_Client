import React, { useState, useEffect } from "react";
import SalesChart from "./Saleschart";
import PenetrationChart from "./PenetrationChart";
import EVSalesMap from "./EVSalesMap";
import EVSalesPivot from "./EVSalesPivot";
import "./Dashboard.css";

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState("evSalesByState");

  // Render content based on selected option
  const renderContent = () => {
    switch (selectedOption) {
      case "evSalesByState":
        return <SalesChart/>;
      case "electricPenetration":
        return <PenetrationChart/>;
      case "evSalesMap":
        return <EVSalesMap/>;
      case "pivot":
        return <EVSalesPivot/>;
      // Add more cases for additional options
      default:
        return <PenetrationChart />;
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>EV Data Visualization Dashboard</h1>
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
              EV Penetration Chart
            </li>
            <li
              className={selectedOption === "evSalesMap" ? "active" : ""}
              onClick={() => setSelectedOption("evSalesMap")}
            >
              EV_Sales-TimeSeries
            </li>
            <li
              className={selectedOption === "pivot" ? "active" : ""}
              onClick={() => setSelectedOption("pivot")}
            >
              EV Sales Pivot
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