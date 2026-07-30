import { useState } from "react";
import {
  HiOutlineDocumentText,
  HiOutlineArrowDownTray,
  HiOutlineTrash,
  HiOutlineCloudArrowUp,
  HiOutlineCheckCircle,
  HiOutlinePencilSquare,
} from "react-icons/hi2";

const Reports = () => {
  const [reports, setReports] = useState([
    {
      id: 1,
      name: "Blood Test Report.pdf",
      date: "21 Jul 2026",
      type: "Lab Report",
      size: "1.8 MB",
    },
    {
      id: 2,
      name: "Chest X-Ray.png",
      date: "20 Jul 2026",
      type: "Radiology",
      size: "3.2 MB",
    },
  ]);

  const removeReport = (id) => {
    setReports(reports.filter((report) => report.id !== id));
  };

  return (
    <div className="mt-6 space-y-8">
      {/* Header */}

      <div>
        <h2 className="text-2xl font-bold text-[#4D2E23]">
          Reports
        </h2>

        <p className="mt-1 text-[#8B7A70]">
          Upload and manage patient reports.
        </p>
      </div>

      {/* Upload */}

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D9C9BF] bg-[#FFFDFB] py-12 transition hover:bg-[#FFF7F2]">
        <HiOutlineCloudArrowUp
          size={55}
          className="text-[#6A3F2D]"
        />

        <p className="mt-4 text-lg font-semibold text-[#4D2E23]">
          Upload Medical Report
        </p>

        <p className="mt-2 text-sm text-[#8B7A70]">
          PDF, JPG or PNG (Max 10 MB)
        </p>

        <input
          type="file"
          className="hidden"
        />
      </label>

      {/* Reports */}

      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="flex items-center justify-between rounded-2xl border border-[#E6DAD3] bg-white p-5"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-[#FFF5EF] p-3">
                <HiOutlineDocumentText
                  size={30}
                  className="text-[#6A3F2D]"
                />
              </div>

              <div>
                <h3 className="font-semibold text-[#4D2E23]">
                  {report.name}
                </h3>

                <p className="mt-1 text-sm text-[#8B7A70]">
                  {report.type} • {report.date} • {report.size}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="rounded-lg p-2 hover:bg-[#FFF5EF]">
                <HiOutlineArrowDownTray
                  size={22}
                  className="text-[#6A3F2D]"
                />
              </button>

              <button
                onClick={() => removeReport(report.id)}
                className="rounded-lg p-2 hover:bg-red-50"
              >
                <HiOutlineTrash
                  size={22}
                  className="text-red-500"
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Doctor Remarks */}

      <div>
        <label className="mb-3 block font-semibold text-[#4D2E23]">
          Doctor Remarks
        </label>

        <textarea
          rows={5}
          placeholder="Enter observations based on reports..."
          className="w-full rounded-2xl border border-[#E6DAD3] bg-[#FFFDFB] p-4 outline-none focus:border-[#6A3F2D]"
        />
      </div>

      {/* Buttons */}

      <div className="flex justify-end gap-4">
        <button className="flex items-center gap-2 rounded-xl border border-[#E6DAD3] px-6 py-3 text-[#6A3F2D] hover:bg-[#FFF5EF]">
          <HiOutlinePencilSquare />
          Edit
        </button>

        <button className="flex items-center gap-2 rounded-xl bg-[#6A3F2D] px-6 py-3 text-white hover:bg-[#593324]">
          <HiOutlineCheckCircle />
          Save Reports
        </button>
      </div>
    </div>
  );
};

export default Reports;