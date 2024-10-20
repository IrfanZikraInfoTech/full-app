import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminSignup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState(
    "What is your first school name?"
  ); // Fixed question
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // Initial signup request
      const response = await axios.post(
        "https://full-app-8iz6.vercel.app/api/signup",
        {
          name,
          email,
          password,
        }
      );

      // If the security question is needed (user already exists)
      if (response.data.securityQuestion) {
        setSecurityQuestion(response.data.securityQuestion); // Set the security question
        setShowModal(true); // Open the modal to ask for security answer
      } else {
        // If signup was successful without the need for a security answer
        console.log("Signup successful:", response.data);
        navigate("/login");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response.data.error || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle final submission after the modal is closed
  const handleFinalSubmit = async () => {
    try {
      // Submit with the security answer
      const response = await axios.post(
        "https://full-app-8iz6.vercel.app/api/signup",
        {
          name,
          email,
          password,
          securityAnswer, // Send the security answer in the request
        }
      );

      console.log("User replaced successfully:", response.data);
      navigate("/login");
    } catch (err) {
      console.error("Replacement error:", err);
      setError(err.response.data.error || "Failed to replace the user.");
    } finally {
      setShowModal(false); // Close the modal
    }
  };

  return (
    <div className="overflow-x-hidden flex items-center justify-center h-screen text-neutral-300 antialiased selection:bg-cyan-300 selection:text-cyan-900">
      <div className="fixed top-0 -z-10 h-full w-full">
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">
          Admin Sign Up
        </h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 mb-4 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-2 mb-4 border rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full text-white p-2 rounded bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] transition duration-300"
        >
          Sign Up
        </button>
      </form>

      {/* Modal for Security Question */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-center">
              {securityQuestion}
            </h2>
            <input
              type="text"
              placeholder="Enter the answer"
              className="w-full p-2 mb-4 border rounded"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              required
            />
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                onClick={handleFinalSubmit} // Submit when the modal is closed
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSignup;
