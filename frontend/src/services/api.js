import axios from "axios";

// Create Axios instance
const API = axios.create({
  baseURL: "http://localhost:8000/api", // Replace with your backend URL
});

// Request Interceptor: Add token to headers
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => {
    console.error("Request Error:", error.message);
    return Promise.reject(error);
  }
);

// Response Interceptor: Global error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorDetails = error.response?.data || {
      message: error.message || "Something went wrong",
    };
    console.error("API Error:", errorDetails);
    return Promise.reject(errorDetails);
  }
);

// Authentication APIs
export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);

// Task APIs
export const fetchTasksForCompany = async (companyId) => {
  try {
    const { data } = await API.get(`/task/company/${companyId}`);
    return data || [];
  } catch (error) {
    console.error(`Error fetching tasks for company ${companyId}:`, error);
    throw error;
  }
};

export const fetchTasksForEmployee = async (employeeId) => {
  try {
    const { data } = await API.get(`/task/employee/${employeeId}`);
    return data || [];
  } catch (error) {
    console.error(`Error fetching tasks for employee ${employeeId}:`, error);
    throw error;
  }
};

export const createTask = (data) => API.post("/task/create", data);
export const updateTask = (taskId, data) => API.patch(`/task/${taskId}`, data);
export const deleteTask = (taskId) => API.delete(`/task/${taskId}`);

// EOD APIs
export const submitEod = (data) => API.post("/eod/submit", data);
export const fetchEodsForCompany = async (companyId) => {
  try {
    const { data } = await API.get(`/eod/company/${companyId}`);
    return data || [];
  } catch (error) {
    console.error(`Error fetching EODs for company ${companyId}:`, error);
    throw error;
  }
};
export const fetchEodsForEmployee = async (employeeId) => {
  try {
    const { data } = await API.get(`/eod/employee/${employeeId}`);
    return data || [];
  } catch (error) {
    console.error(`Error fetching EODs for employee ${employeeId}:`, error);
    throw error;
  }
};
export const updateEod = (eodId, data) => API.patch(`/eod/${eodId}`, data);

// Notification APIs
export const fetchNotifications = async (userId) => {
  try {
    const { data } = await API.get(`/notifications/${userId}`);
    return data || [];
  } catch (error) {
    console.error(`Error fetching notifications for user ${userId}:`, error);
    throw error;
  }
};
export const markNotificationRead = (notificationId) =>
  API.patch(`/notifications/read/${notificationId}`);

// Company APIs
export const fetchCompanies = async () => {
  try {
    const { data } = await API.get("/companies");
    return data || [];
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }
};
export const fetchEmployeesForCompany = (companyId) =>
  API.get(`/companies/employees/${companyId}`);

// User APIs
export const fetchUserData = async () => {
  try {
    const { data } = await API.get("/user");
    return data || {};
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const updateUserProfile = async (data) => {
  try {
    const response = await API.put("/profile", data);
    return response.data || {};
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Utility: Enhanced error handling wrapper
export const safeApiCall = async (apiFunc, ...params) => {
  try {
    const data = await apiFunc(...params);
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("API call failed:", error);
    return {
      success: false,
      error: error.message || "Something went wrong",
    };
  }
};
