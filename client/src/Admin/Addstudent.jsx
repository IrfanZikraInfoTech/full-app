import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios

const AddStudent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    registrationNumber: "",
    addharnumber: "",
    fathername: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Clear any existing errors
    setSuccess(""); // Clear any existing success messages

    try {
      const token = localStorage.getItem("auth-token"); // Retrieve token if using authentication

      // Send POST request to add the student
      const response = await axios.post(
        "https://full-app-8iz6.vercel.app/api/students",
        {
          name: formData.name,
          email: formData.email,
          registrationNumber: formData.registrationNumber,
          addharnumber: formData.addharnumber,
          fathername: formData.fathername, // Make sure fathername is included here
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Assuming you're using JWT authentication
          },
        }
      );

      if (response.status === 201) {
        // Check for 201 Created status
        setSuccess("Student added successfully!");

        // Navigate to dashboard immediately
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error adding student:", err);
      setError("There was an error adding the student.");
    } finally {
      setIsLoading(false); // Stop the loader
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500 p-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Add New Student
        </h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter student's name"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter student's email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              Father Name
            </label>
            <input
              type="text"
              id="fatername"
              name="fathername"
              value={formData.fathername}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Father Name"
              required
            />
          </div>

          {/* Registration Number Field */}
          <div>
            <label
              htmlFor="registrationNumber"
              className="block text-gray-700 font-medium mb-2"
            >
              Registration Number
            </label>
            <input
              type="text"
              id="registrationNumber"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter student's registration number"
              required
            />
          </div>

          {/* Addhar Number Field */}
          <div>
            <label
              htmlFor="addharnumber"
              className="block text-gray-700 font-medium mb-2"
            >
              Addhar Number
            </label>
            <input
              type="text"
              id="addharnumber"
              name="addharnumber"
              value={formData.addharnumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter student's Addhar number"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        </form>
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddStudent;
