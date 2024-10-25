import axios from "axios";

export const fetchSalesData = async (filters) => {
  try {
    const response = await axios.post("http://localhost:3000/swQuery", filters);
    return response.data;
  } catch (error) {
    console.error("Error fetching sales data:", error);
    throw error;
  }
};