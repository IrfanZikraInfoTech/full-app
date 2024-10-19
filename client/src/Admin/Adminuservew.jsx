import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { StudentContext } from "../StudentContext";
import AdminResult from "../AdminResult/AdminResult"; // Import the AdminResult component

const Adminuservew = () => {
  const { students, setError } = useContext(StudentContext);
  const { id } = useParams(); // Get result ID from URL params
  const [resultData, setResultData] = useState([]); // To store the result data
  const [studentInfo, setStudentInfo] = useState(null); // To store the selected student's info

  useEffect(() => {
    // Find the student by ID from the context
    const selectedStudent = students.find(
      (student) => student._id === (id)
    );
    if (selectedStudent) {
      setStudentInfo(selectedStudent);
    } else {
      setError("Student not found");
    }

    // Fetch the result for the specific student by ID
    const fetchResultData = async () => {
      try {
        const token = localStorage.getItem("auth-token"); // Get auth token
        const response = await axios.get(
          `https://full-app-8iz6.vercel.app/api/results/${id}`, // Fetch result by result ID
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add auth header
            },
          }
        );

        // Access the first item in the array and its 'result' field
        if (response.data && response.data.length > 0) {
          const resultField = response.data[0].result; // Corrected access to 'result'

          if (resultField) {
            let parsedResult = [];
            try {
              parsedResult = JSON.parse(resultField); // Parse the result JSON
              setResultData(parsedResult); // Set the parsed JSON data to state
            } catch (parseError) {
              console.error("Error parsing result JSON:", parseError);
              setError("Failed to parse result data.");
            }
          } else {
            console.error("Result field is undefined or empty");
            setError("Result data is unavailable.");
          }
        } else {
          console.error("No data found in response");
          setError("No result data found.");
        }
      } catch (err) {
        console.error("Error fetching result data:", err);
        setError("Failed to fetch result data.");
      }
    };

    fetchResultData();
  }, [id, students, setError]);

  // Function to handle print
  const handlePrint = () => {
    window.print(); // This will open the browser print dialog
  };

  return (
    <>
      <div className="bg-gray-100 flex justify-end p-8">
        <div className="text-center no-print">
          <button
            onClick={handlePrint}
            className="bg-indigo-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-600 transition duration-300"
          >
            Print
          </button>
        </div>
      </div>
      <div className=" bg-gray-100 py-8 flex justify-center">
        {studentInfo && resultData.length > 0 ? (
          <div className="print-area">
            {/* Pass studentInfo and resultData as props to AdminResult */}
            <AdminResult studentInfo={studentInfo} resultData={resultData} />

            {/* Print Button */}
          </div>
        ) : (
          <div className="text-red-500 text-center">
            Loading student information or result data...
          </div>
        )}
      </div>
    </>
  );
};

export default Adminuservew;
