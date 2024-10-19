import React, { useEffect, useState, useContext } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { StudentContext } from "../StudentContext";
import { MdOutlineFileDownload } from "react-icons/md";

const Studentdetails = () => {
  const navigate = useNavigate();
  const { students } = useContext(StudentContext); // Access the context
  const { id } = useParams(); // Get the student ID from the URL
  const student = students.find((student) => student._id === id) || null; // Find the specific student by ID

  console.log("[After Finding in context data is]", student);
  console.log("[Context student data is]", students);

  const [results, setResults] = useState([]); // State to store student results
  const [error, setError] = useState(""); // State to store any errors
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("auth-token"); // Get the auth token
        const response = await axios.get(
          `https://full-app-8iz6.vercel.app/api/results/${id}`, // Fetch results by student ID
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send token in Authorization header
            },
          }
        );
        setResults(response.data); // Store fetched results in state
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching results:", err);
        setError("Failed to fetch results.");
        setIsLoading(false);
      }
    };

    if (student) {
      fetchResults(); // Fetch results when the student is available
    }
  }, [id, student]);

  const handleDelete = async (resultId) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("auth-token");
      await axios.delete(
        `https://full-app-8iz6.vercel.app/api/results/${resultId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // After deletion, update the results state to reflect changes
      setResults(results.filter((result) => result._id !== resultId));
    } catch (err) {
      console.error("Error deleting result:", err);
      setError("Failed to delete result.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (course) => {
    // Placeholder for handling view action
    console.log("Viewing course:", course.name);
    navigate(`/user/${student._id}/result/${course.id}`);
  };

  const handleCertificate = (resultId) => {
    navigate("/certificate", {
      state: {
        student,
        result: results.find((result) => result._id === resultId), // Pass the specific result data
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center p-8">
      <div className="max-w-5xl w-full bg-white shadow-2xl rounded-xl p-8">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 text-center">
          Student Details
        </h1>
        <div className="flex justify-end">
          <button
            className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
            onClick={() => navigate(`/add-result/${student._id}`)} // Pass student ID via the route
          >
            New Result
          </button>
        </div>

        {/* Student Info */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-700 mb-2">
            {student.name} {/* Dynamically display the student's name */}
          </h2>
          <p className="text-lg text-gray-600">
            <strong>Registration Number:</strong> {student.registration_number}
          </p>
          <p className="text-lg text-gray-600">
            <strong>Email:</strong> {student.email}
          </p>
        </div>

        {/* Table for Courses and Results */}
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Results</h3>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-collapse rounded-lg shadow-sm overflow-hidden">
            <thead>
              <tr>
                <th className="py-4 px-6 bg-gray-100 text-left text-lg font-semibold text-gray-600 border-b">
                  Course
                </th>
                <th className="py-4 px-6 bg-gray-100 text-left text-lg font-semibold text-gray-600 border-b">
                  Year
                </th>
                <th className="py-4 px-6 bg-gray-100 text-left text-lg font-semibold text-gray-600 border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr
                  key={result._id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-blue-50 transition-colors duration-200`}
                >
                  <td className="py-4 px-6 border-b text-gray-700 text-lg">
                    {result.course_name}
                  </td>
                  <td className="py-4 px-6 border-b text-gray-700 text-lg">
                    {result.result_year}
                  </td>
                  <td className="py-4 px-6 border-b text-gray-700 text-lg flex space-x-6">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleView(result)}
                    >
                      <FaEye className="inline-block mr-2" />
                      View
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(result._id)}
                    >
                      <FaTrash className="inline-block mr-2" />
                      Delete
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleCertificate(result._id)}
                    >
                      <MdOutlineFileDownload className="inline-block mr-2" />
                      Certificate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {results.length === 0 && (
          <p className="text-center text-gray-600 mt-4">No results found.</p>
        )}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Studentdetails;
