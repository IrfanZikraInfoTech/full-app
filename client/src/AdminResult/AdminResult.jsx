import React from "react";
import header from "./images/header.png"; // Your header image path
import footer from "./images/footer.png"; // Your footer image path

const AdminResult = ({ studentInfo, resultData }) => {
  const totalMarks = resultData.reduce(
    (total, item) => total + item.obtainedMarks,
    0
  );
  const totalMaxMarks = resultData.reduce(
    (total, item) => total + item.maxMarks,
    0
  );

  return (
    <div className="w-[1000px] h-[1400px] mx-auto relative">
      {/* Header */}
      <header>
        <img src={header} alt="Header" className="w-full h-auto" />
      </header>

      {/* Main Content */}
      <main className="p-8 font-sans text-sm bg-white text-gray-900">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold">Statement of Marks</h2>
        </div>

        <div className="flex justify-between mb-8">
          <div>
            <p>
              <strong>Registration No:</strong>{" "}
              {studentInfo.registration_number}
            </p>
            <p>
              <strong>Student's Name:</strong> {studentInfo.name}
            </p>
          </div>
          <div className="text-right">
            <p>
              <strong>Aadhar No:</strong> {studentInfo.aadhar_number}
            </p>
          </div>
        </div>

        {/* Result Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Sr. No.</th>
              <th className="border border-gray-300 px-4 py-2">Subjects</th>
              <th className="border border-gray-300 px-4 py-2">Max. Marks</th>
              <th className="border border-gray-300 px-4 py-2">
                Obtained Marks
              </th>
            </tr>
          </thead>
          <tbody>
            {resultData.map((result, index) => (
              <tr key={index} className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {index + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-left">
                  {result.subject}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {result.maxMarks}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {result.obtainedMarks}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right mb-8">
          <p className="font-semibold">
            Total Marks: {totalMarks} / {totalMaxMarks}
          </p>
        </div>

        <div className="text-center mt-8">
          <p className="font-bold">PASS IN GRADE: A</p>
        </div>
      </main>

      {/* Footer */}
      <footer >
        <img src={footer} alt="Footer" className="w-full h-auto" />
      </footer>
    </div>
  );
};

export default AdminResult;
