import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function PaymentFail() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-200 to-red-50">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl px-10 py-12 flex flex-col items-center max-w-md w-full animate-fade-in">
        <Result
          status="error"
          title={
            <span className="text-3xl font-bold text-[#D7263D] text-center">
              Thanh toán thất bại
            </span>
          }
          subTitle={
            <span className="text-gray-600 text-lg text-center">
              Có lỗi xảy ra hoặc bạn đã huỷ thanh toán.
              <br />
              Vui lòng thử lại hoặc liên hệ hỗ trợ.
            </span>
          }
          extra={
            <Button
              type="primary"
              size="large"
              className="bg-gradient-to-r from-[#D7263D] to-red-400 font-semibold px-8 py-2 rounded-lg shadow hover:from-red-700 hover:to-red-500 transition"
              onClick={() => navigate("/courses")}
            >
              Quay lại trang khóa học
            </Button>
          }
        />
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
}
