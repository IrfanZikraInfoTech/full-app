import React from "react";
import { useLocation } from "react-router-dom";

const Result = () => {
  const location = useLocation();

  // Get student and result from location.state
  const { student, result } = location.state || {};

  if (!student || !result) {
    return <div>No result found for this student.</div>;
  }

  const { courseName, resultYear, marks } = result;

  const totalMarks = marks.reduce((acc, curr) => acc + curr.obtainedMarks, 0);
  const maxMarks = marks.reduce((acc, curr) => acc + curr.maxMarks, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-blue-600">
          VED COMPUTER EDUCATION INSTITUTE
        </h1>
        <p>A VENTURE OF EDUCATION LIVE FOUNDATION, NEW DELHI</p>
        <p className="text-lg font-semibold mt-2">Statement of Marks</p>
      </div>

      <div className="mb-6">
        <p>
          <strong>Registration No:</strong> {student.registrationNumber}
        </p>
        <p>
          <strong>Student's Name:</strong> {student.name}
        </p>
        <p>
          <strong>Course:</strong> {courseName}
        </p>
        <p>
          <strong>Result Year:</strong> {resultYear}
        </p>
      </div>

      <table className="table-auto w-full border-collapse border border-gray-300 mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Sr. No.</th>
            <th className="border border-gray-300 px-4 py-2">Subjects</th>
            <th className="border border-gray-300 px-4 py-2">Max. Marks</th>
            <th className="border border-gray-300 px-4 py-2">Obtained Marks</th>
          </tr>
        </thead>
        <tbody>
          {marks.map((subject, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {index + 1}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {subject.subject}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {subject.maxMarks}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {subject.obtainedMarks}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mb-6">
        <p className="font-bold text-xl">
          Total Marks: {totalMarks}/{maxMarks}
        </p>
        <p className="font-bold text-xl">PASS IN GRADE: A</p>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={handlePrint}
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default Result;
