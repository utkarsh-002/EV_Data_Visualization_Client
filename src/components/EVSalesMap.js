import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import "./MapStyles.css";

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/india/india-states.json";

const EVSalesMap = ({ data }) => {
  // Create a mapping of states to sales data
  const salesByState = data.reduce((acc, item) => {
    acc[item.State] = (acc[item.State] || 0) + item.Total;
    return acc;
  }, {});

  // Define a color scale based on sales data
  const colorScale = (value) => {
    if (value > 100000) return "#0c2c84";
    if (value > 50000) return "#225ea8";
    if (value > 10000) return "#1d91c0";
    if (value > 5000) return "#41b6c4";
    if (value > 1000) return "#7fcdbb";
    return "#c7e9b4";
  };

  return (
    <div className="map-container">
      <h2>EV Sales Map</h2>
      <ComposableMap projection="geoMercator">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateName = geo.properties.st_nm;
              const salesValue = salesByState[stateName] || 0;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={colorScale(salesValue)}
                  stroke="#FFF"
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default EVSalesMap;