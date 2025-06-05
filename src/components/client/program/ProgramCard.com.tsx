import React, { useState } from "react";
import type { Program } from "../../../types/program/ProgramModel";

interface Props {
  program: Program;
}

const ProgramCard: React.FC<Props> = ({ program }) => {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <div
      className="border rounded-xl p-4 shadow hover:shadow-lg transition bg-white flex flex-col"
      style={{ width: "100%", height: 400, boxSizing: "border-box" }}
    >
      <img
        src={program.programImgUrl}
        alt={program.name}
        className="w-full h-48 object-cover rounded-md mb-3 flex-shrink-0"
      />
      <h3 className="text-lg font-bold text-[#20558A] mb-1 flex-shrink-0">
        {program.name}
      </h3>
      <p className="text-sm text-gray-500 mb-2 flex-shrink-0">
        {program.location}
      </p>

      {/* Mô tả với giới hạn dòng và nút xem thêm */}
      <p
        className={`text-sm text-gray-700 ${
          expanded ? "" : "line-clamp-3"
        } transition-all duration-300 flex-grow overflow-hidden`}
      >
        {program.description}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-blue-600 text-xs mt-1 hover:underline self-start"
      >
        {expanded ? "View Less" : "View More"}
      </button>

      <div className="text-xs text-gray-500 mt-3 flex-shrink-0">
        {formatDate(program.startDate)} → {formatDate(program.endDate)}
      </div>
      <div className="mt-2 text-xs inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-medium flex-shrink-0">
        {program.type.replace("_", " ")}
      </div>
    </div>
  );
};

export default ProgramCard;
