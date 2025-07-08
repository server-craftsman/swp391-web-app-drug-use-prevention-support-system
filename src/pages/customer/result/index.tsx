// ✅ PaymentResultPage.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const PaymentResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Trạng thái kết quả thanh toán truyền từ PaymentPage
  const { isSuccess, isCancelled } = location.state || {};

  const handleExplore = () => {
    navigate("/courses");
  };

  let title = "Kết quả thanh toán";
  let subTitle = "";
  let icon = <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 80 }} />;
  let bgColor = "bg-gradient-to-br from-green-100 to-green-50";

  if (isCancelled) {
    status = "error";
    title = "Đơn hàng đã được huỷ";
    subTitle = "Bạn đã huỷ thanh toán cho đơn hàng này.";
    icon = <CloseCircleOutlined style={{ color: "#ff4d4f", fontSize: 80 }} />;
    bgColor = "bg-gradient-to-br from-red-100 to-red-50";
  } else if (isSuccess) {
    status = "success";
    title = "Thanh toán thành công!";
    subTitle = "Cảm ơn bạn đã mua khóa học. Chúc bạn học tập hiệu quả!";
    icon = <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 80 }} />;
    bgColor = "bg-gradient-to-br from-green-100 to-green-50";
  } else {
    status = "error";
    title = "Không xác định kết quả";
    subTitle = "Đã xảy ra lỗi hoặc truy cập không hợp lệ.";
    icon = <CloseCircleOutlined style={{ color: "#ff4d4f", fontSize: 80 }} />;
    bgColor = "bg-gradient-to-br from-gray-100 to-gray-50";
  }

  return (
    <div
      className={`flex justify-center items-center min-h-screen ${bgColor}`}
      style={{ minHeight: "100vh" }}
    >
      <div className="bg-white rounded-2xl shadow-xl px-10 py-12 flex flex-col items-center max-w-md w-full animate-fade-in">
        <div className="mb-6">{icon}</div>
        <h2 className="text-3xl font-bold mb-2 text-[#20558A] text-center">
          {title}
        </h2>
        <p className="text-gray-600 text-lg mb-8 text-center">{subTitle}</p>
        <Button
          type="primary"
          size="large"
          className="bg-gradient-to-r from-[#20558A] to-blue-500 font-semibold px-8 py-2 rounded-lg shadow hover:from-blue-800 hover:to-blue-600 transition"
          onClick={handleExplore}
        >
          Tiếp tục khám phá
        </Button>
      </div>
      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 0.7s;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(40px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
};

export default PaymentResultPage;
