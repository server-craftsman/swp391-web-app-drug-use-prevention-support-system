import React from "react";
import type { Program } from "../../../types/program/Program.type";

interface Props {
  program: Program;
}

const ProgramCard: React.FC<Props> = ({ program }) => {
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <div
      className="border rounded-xl shadow-md hover:shadow-xl transition bg-white flex flex-col"
      style={{ width: "100%", height: 510, boxSizing: "border-box" }}
    >
      <div
        className="overflow-hidden rounded-t-xl flex-shrink-0 m-4 bg-gray-100 flex items-center justify-center"
        style={{ height: 330 }}
      >
        <img
          src={program.programImgUrl}
          alt={program.name}
          className="w-full h-full object-cover block transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-extrabold text-[#20558A] mb-1">
          {program.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2">{program.location}</p>
        <p className="text-gray-700 text-sm mb-3">{program.description}</p>

        <div className="flex justify-between items-center text-xs text-gray-500">
          <div>
            {formatDate(program.startDate)} → {formatDate(program.endDate)}
          </div>
          <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold">
            {program.type?.replace("_", " ")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
