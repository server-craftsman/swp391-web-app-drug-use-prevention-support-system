const FooterLayout = () => {
  return (
    <footer className="bg-primary text-white py-6 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="transform transition-transform hover:translate-y-[-5px] duration-300">
            <h3 className="font-bold text-lg mb-3 border-b-2 border-white pb-2">Về PDP</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover-primary">Về Chúng Tôi</a></li>
              <li><a href="#" className="hover-primary">Tổ Chức</a></li>
              <li><a href="#" className="hover-primary">Trang Giám Đốc</a></li>
              <li><a href="#" className="hover-primary">Cơ Hội Nghề Nghiệp</a></li>
            </ul>
          </div>
          
          <div className="transform transition-transform hover:translate-y-[-5px] duration-300">
            <h3 className="font-bold text-lg mb-3 border-b-2 border-white pb-2">Tài Nguyên</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover-primary">Nguồn Lực Y Tế</a></li>
              <li><a href="#" className="hover-primary">Dữ Liệu & Thống Kê</a></li>
              <li><a href="#" className="hover-primary">Ấn Phẩm</a></li>
              <li><a href="#" className="hover-primary">Nghiên Cứu</a></li>
            </ul>
          </div>
          
          <div className="transform transition-transform hover:translate-y-[-5px] duration-300">
            <h3 className="font-bold text-lg mb-3 border-b-2 border-white pb-2">Tin Tức & Sự Kiện</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover-primary">Thông Cáo Báo Chí</a></li>
              <li><a href="#" className="hover-primary">Hội Nghị & Sự Kiện</a></li>
              <li><a href="#" className="hover-primary">Đa Phương Tiện</a></li>
              <li><a href="#" className="hover-primary">Mạng Xã Hội</a></li>
            </ul>
          </div>
          
          <div className="transform transition-transform hover:translate-y-[-5px] duration-300">
            <h3 className="font-bold text-lg mb-3 border-b-2 border-white pb-2">Kết Nối với PDP</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover-primary">Liên Hệ</a></li>
              <li><a href="#" className="hover-primary">Đăng Ký Nhận Tin</a></li>
              <li><a href="#" className="hover-primary">Chính Sách Bảo Mật</a></li>
              <li><a href="#" className="hover-primary">Khả Năng Tiếp Cận</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-white text-center">
          <p className="text-white font-title font-bold">© 2025 Viện Quốc Gia về Phòng Ngừa Ma Túy. Đã đăng ký Bản quyền.</p>
          
        </div>
      </div>
    </footer>
  )
}

export default FooterLayout