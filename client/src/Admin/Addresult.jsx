import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams to get the route parameter
import axios from "axios";
import { StudentContext } from "../StudentContext";

const AddResult = () => {
  const { students } = useContext(StudentContext); // Access the context
  const { id } = useParams(); // Get studentId from the URL
  const student = students.find((student) => student._id === id); // Find the specific student by ID
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [rows, setRows] = useState([
    { subject: "", maxMarks: "", obtainedMarks: "" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [resultDetails, setResultDetails] = useState({
    resultName: "",
    resultYear: "",
  });

  const handleAddRow = () => {
    setRows([...rows, { subject: "", maxMarks: "", obtainedMarks: "" }]);
  };

  const handleRowChange = (index, field, value) => {
    const updatedRows = rows.map((row, rowIndex) =>
      rowIndex === index ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
  };

  const handleSaveResult = () => {
    setShowModal(true);
  };

  const handleModalSave = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("auth-token"); // Retrieve token

      const requestBody = {
        studentId: student._id, // Use the student ID from the URL
        resultName: resultDetails.resultName,
        resultYear: resultDetails.resultYear,
        rows: rows,
      };

      // Send the result data to the backend
      const response = await axios.post(
        "https://full-app-8iz6.vercel.app/api/save-result",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in the Authorization header
          },
        }
      );

      console.log("Results saved:", response.data);
      setShowModal(false);
      navigate(`/user/${id}`);
    } catch (error) {
      console.error("Failed to save results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResultDetails({ ...resultDetails, [name]: value });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 -z-10 h-full w-full">
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      </div>{" "}
      <div className="container mx-auto p-8 flex-1">
        <h1 className="text-5xl font-bold text-white mb-8">
          Add Student Result
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Subjects</th>
                <th className="border border-gray-300 px-4 py-2">Max. Marks</th>
                <th className="border border-gray-300 px-4 py-2">
                  Obtained Marks
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={row.subject}
                      onChange={(e) =>
                        handleRowChange(index, "subject", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded px-2 py-1"
                      placeholder="Enter subject"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      value={row.maxMarks}
                      onChange={(e) =>
                        handleRowChange(index, "maxMarks", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded px-2 py-1"
                      placeholder="Max Marks"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      value={row.obtainedMarks}
                      onChange={(e) =>
                        handleRowChange(index, "obtainedMarks", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded px-2 py-1"
                      placeholder="Obtained Marks"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4">
            <button
              className="text-white px-4 py-2 rounded bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] transition duration-300"
              onClick={handleAddRow}
            >
              Add Row
            </button>

            <button
              className="text-white px-4 py-2 ml-4 rounded bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] transition duration-300"
              onClick={handleSaveResult}
            >
              Save Result
            </button>
          </div>
        </div>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Enter Result Details</h2>

            <div className="mb-4">
              <label className="block text-gray-700">Result Name</label>
              <input
                type="text"
                name="resultName"
                value={resultDetails.resultName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-2 py-2"
                placeholder="Enter result name"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Result Year</label>
              <input
                type="number"
                name="resultYear"
                value={resultDetails.resultYear}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-2 py-2"
                placeholder="Enter result year"
              />
            </div>

            <div className="flex justify-end">
              <button
                className="w-full  text-white p-2 mr-2 rounded bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] transition duration-300"
                onClick={handleModalSave}
              >
                Save
              </button>
              <button
                className="w-full  text-white p-2 rounded bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] transition duration-300"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default AddResult;
