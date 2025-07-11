import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-200 to-green-50">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl px-10 py-12 flex flex-col items-center max-w-md w-full animate-fade-in">
        <Result
          status="success"
          title={
            <span className="text-3xl font-bold text-[#20558A] text-center">
              Thanh toán thành công!
            </span>
          }
          subTitle={
            <span className="text-gray-600 text-lg text-center">
              Cảm ơn bạn đã thanh toán.
              <br />
              Đơn hàng của bạn đã được ghi nhận.
            </span>
          }
          extra={
            <Button
              type="primary"
              size="large"
              className="bg-gradient-to-r from-[#20558A] to-blue-500 font-semibold px-8 py-2 rounded-lg shadow hover:from-blue-800 hover:to-blue-600 transition"
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
