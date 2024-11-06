import React, { useState, useEffect } from "react";
import SalesChart from "./Saleschart";
import PenetrationChart from "./PenetrationChart";
import "./Dashboard.css";

const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/createProcedure`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log("Fetched Data:", data);
        setSalesData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="dashboard-container">
      <div className="charts-row">
        <PenetrationChart data={salesData} />
        <SalesChart data={salesData} />
      </div>
    </div>
  );
};

export default Dashboard;
