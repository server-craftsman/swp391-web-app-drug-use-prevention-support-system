export default function About() {
  return (
    <section className="bg-white py-16 px-6 md:px-20 lg:px-32">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-blue-800 mb-6">
          Giới Thiệu Về Chúng Tôi
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed mb-10">
          Chúng tôi là một tổ chức tình nguyện phi lợi nhuận, hoạt động với sứ
          mệnh phòng ngừa và giảm thiểu tác hại của ma túy trong cộng đồng. Nền
          tảng số của chúng tôi cung cấp các giải pháp giáo dục, tư vấn và can
          thiệp sớm — đặc biệt hướng đến thanh thiếu niên — nhằm nâng cao nhận
          thức, thay đổi hành vi và tạo ra môi trường sống lành mạnh, an toàn.
        </p>

        <h3 className="text-2xl font-semibold text-blue-700 mb-5">
          Tính Năng Nổi Bật
        </h3>
        <ul className="space-y-6 text-gray-800 text-base leading-relaxed">
          {[
            {
              icon: "🎓",
              title: "Khóa học trực tuyến",
              desc: "Học các chủ đề như nhận thức về ma túy, kỹ năng phòng ngừa, kỹ năng từ chối, phù hợp theo từng nhóm tuổi (học sinh, sinh viên, phụ huynh...).",
            },
            {
              icon: "🧠",
              title: "Đánh giá nguy cơ",
              desc: "Thực hiện các bài khảo sát khoa học như ASSIST và CRAFFT để xác định nguy cơ sử dụng ma túy và nhận gợi ý phù hợp.",
            },
            {
              icon: "🗓️",
              title: "Đặt lịch tư vấn",
              desc: "Kết nối nhanh chóng và an toàn với các chuyên gia tâm lý và tư vấn giàu kinh nghiệm.",
            },
            {
              icon: "📢",
              title: "Truyền thông cộng đồng",
              desc: "Tham gia các hoạt động nâng cao nhận thức, được tổ chức định kỳ và đo lường hiệu quả qua khảo sát.",
            },
            {
              icon: "👩‍⚕️",
              title: "Quản lý chuyên viên",
              desc: "Hệ thống lưu trữ và cập nhật hồ sơ chuyên môn, bằng cấp và lịch làm việc của đội ngũ tư vấn.",
            },
            {
              icon: "👤",
              title: "Hồ sơ người dùng",
              desc: "Theo dõi hành trình học tập, tư vấn và tham gia chương trình để người dùng tự quản lý và phát triển bản thân.",
            },
            {
              icon: "📊",
              title: "Dashboard & Báo cáo",
              desc: "Giao diện thống kê trực quan hỗ trợ quản trị viên theo dõi, đánh giá và tối ưu hoạt động hiệu quả.",
            },
          ].map((item, index) => (
            <li
              key={index}
              className="transition-all duration-300 hover:bg-blue-50 hover:pl-4 border-l-4 border-transparent hover:border-blue-400 rounded-lg p-3"
            >
              <span className="font-semibold text-blue-600">
                {item.icon} {item.title}:
              </span>{" "}
              {item.desc}
            </li>
          ))}
        </ul>

        <div className="mt-16 text-center">
          <h4 className="text-2xl md:text-3xl font-bold text-blue-800 mb-4">
            Cùng Nhau Xây Dựng Cộng Đồng Không Ma Túy
          </h4>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto">
            Mỗi hành động nhỏ hôm nay có thể tạo nên thay đổi lớn trong tương
            lai. Hãy cùng chúng tôi lan tỏa tri thức, kết nối yêu thương và hành
            động thiết thực để xây dựng một cộng đồng khỏe mạnh, không ma túy.
          </p>
        </div>
      </div>
    </section>
  );
}
