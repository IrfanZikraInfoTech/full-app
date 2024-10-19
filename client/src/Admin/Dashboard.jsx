import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { StudentContext } from "../StudentContext";
import Spinner from "./Spinner"; // You can create a separate spinner component or use an existing library

const Dashboard = () => {
  const { students, setStudents, error, setError } = useContext(StudentContext); // Access the context
  const [loading, setLoading] = useState(false); // Loading state
  const [alerts, setAlerts] = useState([]); // State for managing alerts
  const navigate = useNavigate();

  // Universal showAlert function for success and error alerts
  const showAlert = (type, text) => {
    const id = Math.random(); // generate a unique id for the alert
    setAlerts((alerts) => [...alerts, { id, type, text }]);
    setTimeout(() => {
      setAlerts((alerts) => alerts.filter((alert) => alert.id !== id));
    }, 3000); // Hide alert after 3 seconds
  };

  // Fetch students when the component loads
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true); // Start loading
        const token = localStorage.getItem("auth-token");

        const response = await axios.get(
          "https://full-app-8iz6.vercel.app/api/students",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStudents(response.data.students); // Set students after successful fetch
        showAlert("success", "Students loaded successfully!"); // Show success alert
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to fetch students.");
        showAlert("error", "Failed to load students!"); // Show error alert
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchStudents();
  }, [setStudents, setError]);

  // Handle delete student
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("auth-token");

      // Send DELETE request to delete the student
      await axios.delete(
        `https://full-app-8iz6.vercel.app/api/students/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the students state after deletion
      setStudents(students.filter((student) => student._id !== id));
      showAlert("success", "Student deleted successfully!"); // Show success alert
    } catch (err) {
      console.error("Error deleting student:", err);
      setError("Failed to delete student.");
      showAlert("error", "Failed to delete student!"); // Show error alert
    }
  };

  const handleView = (student) => {
    navigate(`/user/${student._id}`);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("auth-token");

      if (token) {
        await axios.post(
          "https://full-app-8iz6.vercel.app/api/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        showAlert("success", "Logged out successfully!"); // Show success alert
      }
    } catch (err) {
      console.error("Logout error:", err);
      showAlert("error", "Failed to log out!"); // Show error alert
    } finally {
      localStorage.removeItem("auth-token");
      localStorage.removeItem("user");
      navigate("/"); // Redirect after logout
    }
  };

  return (
    <div className="bg-gradient-to-r from-green-400 to-blue-400 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Student Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/add_student")}
              className="bg-white text-blue-600 px-6 py-2 rounded-lg shadow-lg hover:bg-blue-100 transition duration-300 ease-in-out"
            >
              Add Student
            </button>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-6 py-2 rounded-lg shadow-lg hover:bg-blue-100 transition duration-300 ease-in-out"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Loader when fetching data */}
        {loading && <Spinner />}

        {/* Display alerts */}
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`alert alert-${alert.type} mb-4 text-center`}
          >
            {alert.text}
          </div>
        ))}

        {/* Show error if fetching students fails */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Cards for each student */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {!loading &&
            students.map((student) => (
              <div
                key={student._id}
                className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 ease-in-out"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {student.name}
                  </h2>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Email:</span> {student.email}
                  </p>
                  <p className="text-gray-600 mb-3">
                    <span className="font-medium">Reg. Number:</span>{" "}
                    {student.registration_number}
                  </p>
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
                    onClick={() => handleView(student)}
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(student._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

          {/* Message when no students found */}
          {!loading && students.length === 0 && !error && (
            <div className="mt-10 text-center text-white">
              <h3 className="text-2xl">No Students Found</h3>
              <p className="mt-2">Click "Add Student" to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
