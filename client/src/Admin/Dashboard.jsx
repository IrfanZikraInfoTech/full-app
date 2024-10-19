import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { StudentContext } from "../StudentContext";

const Dashboard = () => {
  const { students, setStudents, error, setError } = useContext(StudentContext); // Access the context
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleDelete = async (id) => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (student) => {
    navigate(`/user/${student._id}`);
  };

  const handleLogout = async () => {
    setIsLoading(true);
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
      setIsLoading(false);

      // Redirect to home page after clearing storage
      navigate("/");
    }
  };

  return (
    <div className="overflow-x-hidden flex items-center justify-center h-screen text-neutral-300 antialiased selection:bg-cyan-300 selection:text-cyan-900">
      <div className="fixed top-0 -z-10 h-full w-full">
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      </div>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Student Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/add_student")}
              className="w-full  text-white p-2 rounded bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] transition duration-300"
            >
              Add Student
            </button>
            <button
              onClick={handleLogout} // Call handleLogout on click
              className="w-full  text-white p-2 rounded bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] transition duration-300"
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
                  className="w-full  text-white p-2 rounded bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] transition duration-300"
                  onClick={() => handleView(student)}
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(student._id)}
                  className="w-full  text-white p-2 rounded bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] transition duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

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
