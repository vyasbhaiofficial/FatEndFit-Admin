import axios from "axios";

// export const API_BASE = " http://localhost:3002/api/v1";
export const API_BASE = "https://fatendfit.codestoreapp.com/api/v1";


// Get auth headers from localStorage token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); 
  return { Authorization: `Bearer ${token}` };
};

// Admin login
export const loginAdmin = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/admin/login`, {
      email,
      password,
    });
    return response.data.data; 
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    throw err;
  }
};
