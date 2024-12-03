import axios from "axios";

// Create Axios instance
const API = axios.create({
  // baseURL: "https://track-eod-backend.codewithabhinav.online/api", // Replace with your backend URL
  baseURL: "http://localhost:5000/api", // Replace with your backend URL
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

export const fetchTasksForEmployee = async () => {
  try {
    const { data } = await API.get(`/task/employee`);
    return data || [];
  } catch (error) {
    console.error(`Error fetching tasks for employee :`, error);
    throw error;
  }
};

export const createTask = (data) => API.post("/task/create", data);
export const updateTask = (taskId, data) => API.patch(`/task/${taskId}`, data);
export const deleteTask = (taskId) => API.delete(`/task/${taskId}`);

// Project APIs
export const fetchProjectsForCompany = async (companyId) => {
  try {
    const { data } = await API.get(`/projects/company/${companyId}`);
    return data || [];
  } catch (error) {
    console.error(`Error fetching projects for company ${companyId}:`, error);
    throw error;
  }
};

export const createProject = async (data) => {
  try {
    const { data: responseData } = await API.post("/projects", data);
    return responseData || {};
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const createProjectWithTasksAndWorks = async (data) => {
  try {
    const { data: responseData } = await API.post("/project/projects-with-tasks", data);
    return responseData || {};
  } catch (error) {
    console.error("Error creating project with tasks and works:", error);
    throw error;
  }
};

export const updateProject = async (projectId, data) => {
  try {
    const { data: responseData } = await API.put(`/projects/${projectId}`, data);
    return responseData || {};
  } catch (error) {
    console.error(`Error updating project ${projectId}:`, error);
    throw error;
  }
};

export const deleteProject = async (projectId) => {
  try {
    await API.delete(`/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting project ${projectId}:`, error);
    throw error;
  }
};

// Work APIs
export const fetchWorksForTask = async (taskId) => {
  try {
    const { data } = await API.get(`/works/task/${taskId}`);
    return data || [];
  } catch (error) {
    console.error(`Error fetching works for task ${taskId}:`, error);
    throw error;
  }
};

export const createWorkForTask = async (taskId, workData) => {
  try {
    const { data: responseData } = await API.post(`/works/task/${taskId}`, workData);
    return responseData || {};
  } catch (error) {
    console.error(`Error creating work for task ${taskId}:`, error);
    throw error;
  }
};

export const updateWork = async (workId, data) => {
  try {
    const { data: responseData } = await API.put(`/works/${workId}`, data);
    return responseData || {};
  } catch (error) {
    console.error(`Error updating work ${workId}:`, error);
    throw error;
  }
};

export const deleteWork = async (workId) => {
  try {
    await API.delete(`/works/${workId}`);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting work ${workId}:`, error);
    throw error;
  }
};

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

export const fetchEodsForUser = async () => {
  try {
    const { data } = await API.get(`/eod/employee`);
    return data || [];
  } catch (error) {
    console.error(`Error fetching your EODs:`, error);
    throw error;
  }
};

export const updateEod = (eodId, data) => API.patch(`/eod/${eodId}`, data);

// New API for updating EOD feedback and status
export const updateEodFeedbackAndStatus = async (eodId, data) => {
  try {
    const response = await API.put(`/eod/${eodId}`, data);
    return response.data || {};
  } catch (error) {
    console.error("Error updating EOD feedback and status:", error);
    throw error;
  }
};

// Notification APIs
export const fetchNotifications = async () => {
  try {
    const { data } = await API.get(`/notifications`);
    return data || [];
  } catch (error) {
    console.error(`Error fetching notifications for you:`, error);
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

export const fetchEmployeesForCompany = () =>
  API.get(`/companies/employees`);

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
