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

  // Assuming marks is an array of objects with obtainedMarks and maxMarks as numeric values
  const totalMarks = marks.reduce(
    (acc, curr) => acc + Number(curr.obtainedMarks),
    0
  );
  const maxMarks = marks.reduce((acc, curr) => acc + Number(curr.maxMarks), 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen mx-auto p-6 rounded-lg shadow-lg">
      <div className="fixed top-0 -z-10 h-full w-full">
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      </div>{" "}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-blue-900">
          VED COMPUTER EDUCATION INSTITUTE
        </h1>
        <p className="text-white">
          A VENTURE OF EDUCATION LIVE FOUNDATION, NEW DELHI
        </p>
        <p className="text-lg font-semibold text-white mt-2">
          Statement of Marks
        </p>
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
              <td className="border bg-gray-300 border-gray-300 px-4 py-2 text-center">
                {index + 1}
              </td>
              <td className="border bg-gray-300 border-gray-300 px-4 py-2">
                {subject.subject}
              </td>
              <td className="border bg-gray-300 border-gray-300 px-4 py-2 text-center">
                {subject.maxMarks}
              </td>
              <td className="border bg-gray-300 border-gray-300 px-4 py-2 text-center">
                {subject.obtainedMarks}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between text-white items-center mb-6">
        <p className="font-bold text-xl">
          Total Marks: {totalMarks}/{maxMarks}
        </p>
        <p className="font-bold text-xl">PASS IN GRADE: A</p>
      </div>
      <div className="flex justify-end space-x-4">
        <button
          className="text-white px-8 py-1 rounded bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] transition duration-300"
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
