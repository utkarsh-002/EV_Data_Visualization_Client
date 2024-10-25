import React from "react";

const Filters = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="filters">
      <label>
        Year:
        <select name="year" value={filters.year} onChange={handleChange}>
          {[...Array(2024 - 2013 + 1)].map((_, i) => {
            const year = 2013 + i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </label>

      <label>
        Month:
        <select name="month" value={filters.month} onChange={handleChange}>
          {[
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
      </label>

      <label>
        Vehicle Category:
        <select
          name="vehicleCategory"
          value={filters.vehicleCategory}
          onChange={handleChange}
        >
          {["2-Wheelers", "3-Wheelers", "4-Wheelers", "Bus", "Others"].map(
            (category) => (
              <option key={category} value={category}>
                {category}
              </option>
            )
          )}
        </select>
      </label>

      <label>
        Vehicle Type:
        <select
          name="vehicleType"
          value={filters.vehicleType}
          onChange={handleChange}
        >
          {["Select all", "Personal", "Shared"].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default Filters;