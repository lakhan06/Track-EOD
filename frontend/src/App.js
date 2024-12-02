import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/Authcontext";
import DashboardLayout from "./Components/DashBoardLayout/DashboardLayout";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Tasks from "./pages/Tasks/Task";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profilepage/ProfilePage";
import Navbar from "./Components/Navbar/Navbar";
import AddEod from "./pages/EOd/EOD";
import EmployeeTasks from "./pages/Tasks/EmPloyeeTask";
import UserEods from "./pages/EOd/UserEODs";
import Notifications from "./Components/Notifications/Notification";
import EmployeeDetails from "./pages/EmployeeDetails/EmployeeDetails";
import EmployeeEods from "./pages/EmployeeDetails/EmployeeEodForCOmpany";
import ProtectedRoute from "./Components/Proctected ROutes/ProctedRoute";
import LandingPage from "./pages/LandingPage/LandingPage";
import Footer from "./Components/Footer/Footer";

const AppRoutes = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const isLandingPage = location.pathname === "/" && location.search.includes("view=landing");

  return (
    <>
      <Navbar />
      <Routes>
        {/* Landing Page or Redirect to Dashboard */}
        <Route
          path="/"
          element={
            user && !isLandingPage ? <Navigate to="/dashboard" /> : <LandingPage />
          }
        />

        {/* Protected Routes for Authenticated Users */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}
        >
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="Employeetasks" element={<EmployeeTasks />} />
          <Route path="employee/eods" element={<UserEods />} />
          <Route path="employeeDetails" element={<EmployeeDetails />} />
          <Route path="company/employeeEods/:employeeId" element={<EmployeeEods />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="createEod" element={<AddEod />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      {/* Render Footer only on Landing Page */}
      {isLandingPage && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
