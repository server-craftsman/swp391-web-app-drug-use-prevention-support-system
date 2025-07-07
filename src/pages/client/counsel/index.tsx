import CounselList from "../../../components/client/counsel/CounselList.com";

export default function CounselPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#20558A] to-[#4f35e2] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Dịch vụ tư vấn chuyên nghiệp
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Kết nối với đội ngũ tư vấn viên giàu kinh nghiệm để nhận được hỗ trợ tốt nhất
          </p>
        </div>
      </div>

      <div className="relative -mt-8">
        <CounselList />
      </div>
    </div>
  );
}
