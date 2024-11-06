import axios from "axios";

export const fetchSalesData = async (filters) => {
  try {
    const response = await axios.get(
      "http://localhost:3000/createProcedure",
      filters
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching sales data:", error);
    throw error;
  }
};