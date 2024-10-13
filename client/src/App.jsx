import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Admin/Login";
import Signup from "./Admin/Signup";
import Result from "./User/result";
import Home from "./Home/Home";
import Dashboard from "./Admin/Dashboard";
import AddStudent from "./Admin/Addstudent";
import Adminuservew from "./Admin/Adminuservew";
import AddResult from "./Admin/Addresult";
import Studentdetails from "./Admin/Studentdetails";
import { StudentProvider } from "./StudentContext";
import PublicRoute from "./ProtectedRoute/PublicRoute";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import UserForm from "./User/user";
import Certificate from "./AdminResult/Certificate";

const App = () => {
  return (
    <Router>
      <StudentProvider>
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              <PublicRoute requireAuth={false}>
                <Home />
              </PublicRoute>
            }
          />
          <Route
            path="/user"
            element={
              <PublicRoute requireAuth={false}>
                <UserForm />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute requireAuth={false}>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute requireAuth={false}>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/result/:id"
            element={
              <PublicRoute requireAuth={true}>
                <Result />
              </PublicRoute>
            }
          />
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add_student"
            element={
              <ProtectedRoute>
                <AddStudent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/:id"
            element={
              <ProtectedRoute>
                <Studentdetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/:id/result/:resultid"
            element={
              <ProtectedRoute>
                <Adminuservew />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-result/:id"
            element={
              <ProtectedRoute>
                <AddResult />
              </ProtectedRoute>
            }
          />
          <Route
            path="certificate"
            element={
              <ProtectedRoute>
                <Certificate />
              </ProtectedRoute>
            }
          />
        </Routes>
      </StudentProvider>
    </Router>
  );
};

export default App;
