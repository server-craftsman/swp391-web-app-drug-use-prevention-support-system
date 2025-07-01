import React from "react";
import { Carousel } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import ProgramCard from "./ProgramCard.com";
import programData from "../../../data/program.json";
import type { Program } from "../../../types/program/Program.type";

const typedPrograms = programData as unknown as Program[];

const CustomPrevArrow = ({ onClick }: any) => (
  <div
    className="absolute top-1/2 left-6 -translate-y-1/2 z-10 cursor-pointer bg-[#20558A]  text-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
    onClick={onClick}
  >
    <LeftOutlined className="text-base" />
  </div>
);

// Custom nút phải
const CustomNextArrow = ({ onClick }: any) => (
  <div
    className="absolute top-1/2 right-6 -translate-y-1/2 z-10 cursor-pointer bg-[#20558A]  text-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
    onClick={onClick}
  >
    <RightOutlined className="text-base" />
  </div>
);

const ProgramList: React.FC = () => {
  return (
    <>
      <header className="max-w-5xl mx-auto text-center mb-2">
        <h1 className="text-4xl font-extrabold uppercase mb-2 tracking-wider text-[#20558A]">
          Gắn Kết Cộng Đồng, Đẩy Lùi Ma Túy
        </h1>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          Những chương trình thiết thực được tổ chức bởi tình nguyện viên,
          chuyên gia và người dân để tạo nên một cộng đồng khỏe mạnh, nói không
          với ma túy.
        </p>
      </header>

      <section className="max-w-6xl mx-auto px-4 md:px-0 mb-20 relative">
        <Carousel
          arrows
          prevArrow={<CustomPrevArrow />}
          nextArrow={<CustomNextArrow />}
          slidesToShow={1} // Chỉ hiển thị 1 slide mỗi lần
          slidesToScroll={1} // Cuộn 1 slide mỗi lần
        >
          {typedPrograms.map((program) => (
            <div key={program.id} className="px-6">
              <ProgramCard program={program} />
            </div>
          ))}
        </Carousel>
      </section>

      <section className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-16 px-4">
        {[
          { value: "10+", label: "Chương trình đã thực hiện" },
          { value: "500+", label: "Người dân tham gia" },
          { value: "90%", label: "Tăng nhận thức phòng ngừa" },
        ].map(({ value, label }, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-br from-white to-blue-50 border border-blue-200 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transform transition duration-300 p-8"
          >
            <p className="text-5xl font-extrabold text-[#20558A]">{value}</p>
            <p className="text-gray-700 mt-3 text-base font-medium">{label}</p>
          </div>
        ))}
      </section>

      <div className="flex justify-center">
        <button className=" mt-6 bg-[#20558A] text-white px-8 py-3 rounded hover:bg-gray-800 transition">
          Đăng ký tham gia chương trình
        </button>
      </div>
    </>
  );
};

export default ProgramList;
