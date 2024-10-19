import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const fetchStudents = async () => {
      const authToken = localStorage.getItem("auth-token");
      const resultToken = localStorage.getItem("result-token");

      // Define which paths require auth-token and result-token
      const publicPaths = ["/login", "/signup", "/", "/user"];
      const resultPaths = /^\/result\/\d+$/; // Regular expression to match /result/:id

      try {
        // If the current path is a public path, no need for tokens
        if (publicPaths.includes(location.pathname)) {
          return;
        }

        // If the path is a result path, check for result-token
        if (resultPaths.test(location.pathname)) {
          if (!resultToken) {
            navigate("/login");
            return;
          }
        } else if (!authToken) {
          // For any other path, check if auth-token exists
          navigate("/login");
          return;
        }

        // If auth-token is present, make the API request
        if (authToken) {
          const response = await axios.get(
            "https://full-app-8iz6.vercel.app/api/students",
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          setStudents(response.data);
        }
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load students");

        // If token is invalid (401), redirect to login
        if (
          err.response &&
          err.response.status === 401 &&
          !publicPaths.includes(location.pathname)
        ) {
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [navigate, location.pathname]);

  return (
    <StudentContext.Provider value={{ students, setStudents, error, setError }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
    </StudentContext.Provider>
  );
};
