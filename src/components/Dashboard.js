import React, { useState, useEffect } from "react";
import SalesChart from "./Saleschart";
import PenetrationChart from "./PenetrationChart";
import "./Dashboard.css";

const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [penetrationData, setPenetrationData] = useState([]);

  // State for filters
  const [filters, setFilters] = useState({
    year: 2023,
    month: "January",
    vehicleCategory: "2-Wheelers",
    vehicleType: "Personal",
  });

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Fetch data for sales and penetration charts
  const fetchData = async () => {
    console.log("Fetching data with filters:", filters);
    try {
      const response = await fetch("http://localhost:3000/swQuery", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters), // Using selected filters in the request body
      });
      const data = await response.json();
      setSalesData(data.sales);
      setPenetrationData(data.penetration);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="filters">
        <div>
          <label htmlFor="year">Year: </label>
          <select
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
          >
            {[...Array(12)].map((_, i) => {
              const year = 2013 + i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label htmlFor="month">Month: </label>
          <select
            name="month"
            value={filters.month}
            onChange={handleFilterChange}
          >
            {[
              "Select all",
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="vehicleCategory">Vehicle Category: </label>
          <select
            name="vehicleCategory"
            value={filters.vehicleCategory}
            onChange={handleFilterChange}
          >
            {["2-Wheelers", "3-Wheelers", "4-Wheelers", "Bus", "Others"].map(
              (category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <label htmlFor="vehicleType">Vehicle Type: </label>
          <select
            name="vehicleType"
            value={filters.vehicleType}
            onChange={handleFilterChange}
          >
            {["Select all", "Personal", "Shared"].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <button onClick={fetchData}>Apply</button>
      </div>

      {/* Charts Section */}
      <div className="charts-row">
        <SalesChart data={salesData} />
        <PenetrationChart data={penetrationData} />
      </div>
    </div>
  );
};

export default Dashboard;