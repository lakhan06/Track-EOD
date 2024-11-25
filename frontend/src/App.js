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

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
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
