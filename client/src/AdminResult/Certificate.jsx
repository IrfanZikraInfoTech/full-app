import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import certificateheader from "./images/certificateheader.png";
import certificatefooter from "./images/certificatefooter.png";
import { FaDownload } from "react-icons/fa";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Certificate = () => {
  const location = useLocation();
  const { student, result } = location.state || {};

  useEffect(() => {
    document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!student || !result) {
    return <div>No student or result data found</div>;
  }

  const downloadCertificate = () => {
    const certificate = document.getElementById("certificate-container");

    html2canvas(certificate, {
      scale: 2,
      useCORS: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("portrait", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${student.name}_Certificate.pdf`);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div
        id="certificate-container"
        className="certificate-container bg-white border-4 border-blue-700 rounded-lg shadow-xl relative"
        style={{
          width: "400px",
          height: "auto",
          aspectRatio: "1 / 1.414",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <header className="w-full">
          <img
            src={certificateheader}
            alt="certificate header"
            className="w-full h-auto"
          />
        </header>

        {/* Main Content */}
        <main className="text-center bg-gray-50 p-2 flex-grow flex flex-col justify-center">
          <div className="mb-2">
            <h2 className="text-2xl font-bold mb-1 text-blue-800">
              {student.name}
            </h2>
            <p className="text-sm mb-1">
              S/o, W/o, D/o: {student.guardian || "N/A"}
            </p>
            <p className="text-xs font-medium mb-1 text-orange-600">
              For Successfully Completing the Course
            </p>
            <h3 className="text-lg font-semibold text-orange-600 uppercase mb-1">
              {result.course_name}
            </h3>
            <p className="text-xs mb-2">
              From {result.start_date || "N/A"} to {result.end_date || "N/A"}
            </p>
          </div>

          <div className="text-center mb-2">
            <h4 className="text-sm font-semibold mb-1 text-gray-700">
              Marks Obtained
            </h4>
            {result.marks ? (
              <ul className="list-none text-xs">
                {Object.entries(result.marks).map(([subject, grade]) => (
                  <li key={subject}>
                    {subject}: <strong>{grade}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs">No marks available for this result.</p>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full">
          <img
            src={certificatefooter}
            alt="certificate footer"
            className="w-full h-auto"
          />
        </footer>

        {/* Download Button in Top-Right Corner */}
        <button
          onClick={downloadCertificate}
          className="absolute top-2 right-2"
        >
          <FaDownload className="mr-2" />
        </button>
      </div>
    </div>
  );
};

export default Certificate;
