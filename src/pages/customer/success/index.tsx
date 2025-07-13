import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className=" h-screen flex items-center justify-center bg-gradient-to-br from-green-200 to-green-50">
      <Result
        status="success"
        className="w-full h-full flex flex-col justify-center items-center"
        title={
          <span className="text-4xl font-bold text-[#20558A] text-center">
            Thanh toán thành công!
          </span>
        }
        subTitle={
          <span className="text-gray-600 text-xl text-center">
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
      <style>
        {`
          .ant-result {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
        `}
      </style>
    </div>
  );
}
