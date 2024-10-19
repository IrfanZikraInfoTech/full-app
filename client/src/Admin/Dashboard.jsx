import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { StudentContext } from "../StudentContext";

const Dashboard = () => {
  const { students, setStudents, error, setError } = useContext(StudentContext); // Access the context
  const navigate = useNavigate();
  console.log("====================================");
  console.log(students);
  console.log("====================================");
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("auth-token"); // Retrieve token

      // Send DELETE request to delete the student
      await axios.delete(
        `https://full-app-8iz6.vercel.app/api/students/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in the Authorization header
          },
        }
      );

      // Update the students state after deletion
      setStudents(students.filter((student) => student._id !== id));
    } catch (err) {
      console.error("Error deleting student:", err);
      setError("Failed to delete student");
    }
  };

  const handleView = (student) => {
    navigate(`/user/${student._id}`);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("auth-token");

      // Check if the token exists and send a logout request
      if (token) {
        await axios.post(
          "https://full-app-8iz6.vercel.app/api/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send token in Bearer format
            },
          }
        );
        console.log("Logout API call successful");
      }
    } catch (err) {
      console.error("Logout error:", err); // Log any errors in the console for debugging
    } finally {
      // Clear localStorage regardless of whether the API call succeeds
      localStorage.removeItem("auth-token");
      localStorage.removeItem("user");

      console.log("LocalStorage cleared"); // Log to ensure localStorage was cleared

      // Redirect to home page after clearing storage
      navigate("/");
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
              onClick={handleLogout} // Call handleLogout on click
              className="bg-white text-blue-600 px-6 py-2 rounded-lg shadow-lg hover:bg-blue-100 transition duration-300 ease-in-out"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Show error if fetching students fails */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Cards for each student */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {students.map((student) => (
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
        </div>

        {students.length === 0 && !error && (
          <div className="mt-10 text-center text-white">
            <h3 className="text-2xl">No Students Found</h3>
            <p className="mt-2">Click "Add Student" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
