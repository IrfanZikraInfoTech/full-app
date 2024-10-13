import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserForm = () => {
  const [email, setEmail] = useState("");
  const [registration_number, setRegistration_number] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/auth/result-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          registration_number,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token in localStorage
        localStorage.setItem("result-token", data.token);

        // Navigate to the result page with student and result data
        navigate(`/result/${data.student.id}`, {
          state: {
            student: data.student,
            result: data.result,
          },
        });
      } else {
        setError(data.error || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error logging in. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-teal-500">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          View Your Results
        </h2>
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Registration Number"
          value={registration_number}
          onChange={(e) => setRegistration_number(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default UserForm;
