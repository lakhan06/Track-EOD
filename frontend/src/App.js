import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/Authcontext";
import DashboardLayout from "./Components/DashBoardLayout/DashboardLayout";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Tasks from "./pages/Tasks/Task";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profilepage/ProfilePage";
import Navbar from "./Components/Navbar/Navbar"
import AddEod from "./pages/EOd/EOD";
import EmployeeTasks from "./pages/Tasks/EmPloyeeTask";
import UserEods from "./pages/EOd/UserEODs";
import Notifications from "./Components/Notifications/Notification";
import EmployeeDetails from "./pages/EmployeeDetails/EmployeeDetails";
import EmployeeEods from "./pages/EmployeeDetails/EmployeeEodForCOmpany";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/Employeetasks" element={<EmployeeTasks />} />
            <Route path="/employee/eods" element={<UserEods />} />
            <Route path="/employeeDetails" element={<EmployeeDetails />} />
            <Route path="/company/employeeEods/:employeeId" element={<EmployeeEods />} />
            <Route path="/notifications" element={<Notifications />} />

            <Route path="/createEod" element={<AddEod />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
