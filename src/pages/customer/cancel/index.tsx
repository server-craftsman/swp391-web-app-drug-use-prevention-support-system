import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { ROUTER_URL } from "../../../consts/router.path.const";

export default function PaymentFail() {
  const navigate = useNavigate();

  return (
    <div className=" h-screen flex items-center justify-center bg-gradient-to-br from-red-200 to-red-50">
      <Result
        status="error"
        className="w-full h-full flex flex-col justify-center items-center"
        title={
          <span className="text-4xl font-bold text-[#D7263D] text-center">
            Thanh toán thất bại
          </span>
        }
        subTitle={
          <span className="text-gray-600 text-xl text-center">
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
            onClick={() => navigate(ROUTER_URL.CLIENT.COURSE)}
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
