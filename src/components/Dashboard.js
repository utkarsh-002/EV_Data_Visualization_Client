import React, { useState, useEffect } from "react";
import SalesChart from "./Saleschart";
import PenetrationChart from "./PenetrationChart";
import EVSalesMap from "./EVSalesMap";
import EVSalesPivot from "./EVSalesPivot";
import TimeSeriesCategory from "./timeSeriesCategory";
import "./Dashboard.css";
import DashboardCards from "./DashboardCards";

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState("evSalesByState");
  const [statewiseOpen, setStatewiseOpen] = useState(true);
  const [timeseriesOpen, setTimeseriesOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (selectedOption) {
      case "evSalesByState":
        return <SalesChart />;
      case "electricPenetration":
        return <PenetrationChart />;
      case "evSalesMap":
        return <EVSalesMap />;
      case "pivot":
        return <EVSalesPivot />;
      case "timeSeriesCategory":
        return <TimeSeriesCategory />;
      default:
        return <PenetrationChart />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Hamburger Button */}
      <button className="hamburger-btn" onClick={toggleSidebar}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? "active" : ""}`}>
        <ul>
          <li
            className="sidebar-heading"
            onClick={() => setStatewiseOpen(!statewiseOpen)}
          >
            {statewiseOpen ? "▼" : "►"} Statewise
          </li>
          {statewiseOpen && (
            <>
              <li
                className={
                  selectedOption === "evSalesByState" ? "active" : ""
                }
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
            </>
          )}

          <li
            className="sidebar-heading"
            onClick={() => setTimeseriesOpen(!timeseriesOpen)}
          >
            {timeseriesOpen ? "▼" : "►"} Timeseries
          </li>
          {timeseriesOpen && (
            <>
              <li
                className={
                  selectedOption === "evSalesMap" ? "active" : ""
                }
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
              <li
                className={
                  selectedOption === "timeSeriesCategory" ? "active" : ""
                }
                onClick={() => setSelectedOption("timeSeriesCategory")}
              >
                EV_Sales_Category-wise
              </li>
            </>
          )}
        </ul>
      </aside>

      {/* Main Content */}
      <div className={`dashboard-content ${isSidebarOpen ? "expanded" : ""}`}>
        <DashboardCards />
        <main className="dashboard-main">{renderContent()}</main>
      </div>
    </div>
  );
};

export default Dashboard;