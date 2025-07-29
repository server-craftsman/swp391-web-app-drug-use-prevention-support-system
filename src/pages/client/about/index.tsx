import { 
  AcademicCapIcon, 
  HeartIcon, 
  UserGroupIcon,
  BookOpenIcon,
  ClipboardDocumentCheckIcon,
  CalendarDaysIcon,
  SpeakerWaveIcon,
  UserIcon,
  PresentationChartBarIcon,
  SparklesIcon,
  EyeIcon,
  StarIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export default function About() {
  return (
    <div className="bg-white w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white py-32 w-full">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative w-full max-w-[1400px] text-center px-6 md:px-20 lg:px-32">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mb-6">
              <SparklesIcon className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold mb-8 leading-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Vì một cộng đồng vững vàng,<br />
            <span className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">vì một tương lai không ma túy</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-5xl mx-auto mb-12 leading-relaxed font-light">
            Chúng tôi tin rằng phòng ngừa là chìa khóa. Bằng sức mạnh của công nghệ 
            và sự tận tâm của cộng đồng, chúng tôi kiến tạo những giải pháp để bảo vệ thế hệ trẻ.
          </p>
          <div className="flex justify-center">
            <div className="w-40 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full shadow-lg"></div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-6 md:px-20 lg:px-32 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="group">
              <div className="bg-white p-10 rounded-3xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                    <HeartIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-800 bg-clip-text text-transparent">Sứ Mệnh Của Chúng Tôi</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Sứ mệnh của chúng tôi là lan tỏa nhận thức, cung cấp công cụ và kết nối chuyên gia 
                  nhằm hỗ trợ hiệu quả công tác phòng, chống ma túy trong cộng đồng. Thông qua nền tảng 
                  công nghệ hiện đại, chúng tôi mong muốn trao quyền cho mỗi cá nhân, gia đình và nhà trường 
                  để chủ động xây dựng một môi trường sống an toàn và lành mạnh.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white p-10 rounded-3xl shadow-xl border border-emerald-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-green-600"></div>
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                    <EyeIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-green-800 bg-clip-text text-transparent">Tầm Nhìn Đến 2030</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Chúng tôi hướng tới một tương lai nơi mỗi người trẻ đều được trang bị đầy đủ kiến thức 
                  và kỹ năng để tự tin nói "Không" với ma túy. Ma túy sẽ không còn là nỗi ám ảnh thầm lặng 
                  trong các gia đình hay học đường, mà thay vào đó là sự thấu hiểu, sẻ chia và một mạng lưới 
                  hỗ trợ vững chắc.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 px-6 md:px-20 lg:px-32 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-indigo-50/50"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent mb-8">Câu Chuyện Của Chúng Tôi</h2>
            <div className="flex justify-center">
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-md"></div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-12 md:p-16 rounded-3xl shadow-2xl border border-blue-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-200/20 to-blue-200/20 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative">
              <p className="text-gray-700 text-xl leading-relaxed mb-8">
                Mọi chuyện bắt đầu từ một nhóm nhỏ những tình nguyện viên cùng chung một trăn trở: 
                <span className="font-semibold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent"> Làm thế nào để ngăn chặn ma túy trước khi nó tàn phá cuộc sống của một ai đó?</span>
              </p>
              
              <p className="text-gray-700 text-xl leading-relaxed mb-8">
                Chúng tôi đã đi, đã gặp, đã lắng nghe những câu chuyện đau lòng từ các gia đình, trường học 
                và nhận ra rằng, dù nỗ lực đến đâu, sức người cũng có hạn.
              </p>
              
              <p className="text-gray-700 text-xl leading-relaxed mb-10">
                Ý tưởng về một nền tảng số ra đời từ chính thực tế đó. Chúng tôi tin rằng công nghệ có thể 
                nhân lên nỗ lực của hàng trăm tình nguyện viên, có thể đưa kiến thức phòng ngừa đến mọi ngõ ngách, 
                và có thể tạo ra một cầu nối an toàn, bảo mật giữa người cần giúp đỡ và các chuyên gia tư vấn.
              </p>
              
              <div className="bg-white p-8 rounded-2xl border-l-4 border-orange-400 shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-amber-400 rounded-xl flex items-center justify-center flex-shrink-0">
                    <StarIcon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-800 font-medium italic text-lg leading-relaxed">
                    "Phần mềm này là tâm huyết của chúng tôi – một sản phẩm phi lợi nhuận được xây dựng 
                    bởi những trái tim tình nguyện, với mong muốn duy nhất là bảo vệ thế hệ tương lai."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-24 px-6 md:px-20 lg:px-32 bg-gradient-to-br from-gray-50 to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent mb-8">Cách Chúng Tôi Hành Động</h2>
            <div className="flex justify-center">
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-md"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: BookOpenIcon,
                title: "Giáo dục & Nâng cao nhận thức",
                desc: "Cung cấp các khóa học trực tuyến được thiết kế chuyên biệt cho từng lứa tuổi và các buổi chia sẻ kinh nghiệm trên blog.",
                gradient: "from-blue-500 to-blue-600"
              },
              {
                icon: ClipboardDocumentCheckIcon,
                title: "Đánh giá & Hỗ trợ sớm",
                desc: "Hệ thống cho phép thực hiện các bài khảo sát khoa học như ASSIST, CRAFFT để tự đánh giá mức độ nguy cơ.",
                gradient: "from-emerald-500 to-green-600"
              },
              {
                icon: UserGroupIcon,
                title: "Kết nối & Đồng hành",
                desc: "Đội ngũ chuyên viên tư vấn uy tín luôn sẵn sàng. Chức năng đặt lịch hẹn đảm bảo sự tiện lợi và bảo mật tuyệt đối.",
                gradient: "from-purple-500 to-violet-600"
              },
              {
                icon: SpeakerWaveIcon,
                title: "Lan tỏa trong cộng đồng",
                desc: "Tổ chức các chương trình truyền thông, giáo dục tại trường học và địa phương với hiệu quả được đo lường khoa học.",
                gradient: "from-orange-500 to-amber-600"
              }
            ].map((item, index) => (
              <div key={index} className="group">
                <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.gradient}"></div>
                  <div className={`w-16 h-16 bg-gradient-to-r ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-4 text-center text-gray-800 group-hover:text-blue-700 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-center">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Highlight */}
      <section className="py-24 px-6 md:px-20 lg:px-32 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/30"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent mb-8">Tính Năng Nổi Bật</h2>
            <div className="flex justify-center">
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-md"></div>
            </div>
          </div>

          <div className="space-y-6">
            {[
              {
                icon: AcademicCapIcon,
                title: "Khóa học trực tuyến",
                desc: "Học các chủ đề như nhận thức về ma túy, kỹ năng phòng ngừa, kỹ năng từ chối, phù hợp theo từng nhóm tuổi (học sinh, sinh viên, phụ huynh...).",
                gradient: "from-blue-500 to-blue-600"
              },
              {
                icon: ClipboardDocumentCheckIcon,
                title: "Đánh giá nguy cơ",
                desc: "Thực hiện các bài khảo sát khoa học như ASSIST và CRAFFT để xác định nguy cơ sử dụng ma túy và nhận gợi ý phù hợp.",
                gradient: "from-emerald-500 to-green-600"
              },
              {
                icon: CalendarDaysIcon,
                title: "Đặt lịch tư vấn",
                desc: "Kết nối nhanh chóng và an toàn với các chuyên gia tâm lý và tư vấn giàu kinh nghiệm.",
                gradient: "from-purple-500 to-violet-600"
              },
              {
                icon: SpeakerWaveIcon,
                title: "Truyền thông cộng đồng",
                desc: "Tham gia các hoạt động nâng cao nhận thức, được tổ chức định kỳ và đo lường hiệu quả qua khảo sát.",
                gradient: "from-orange-500 to-amber-600"
              },
              {
                icon: UserIcon,
                title: "Quản lý chuyên viên",
                desc: "Hệ thống lưu trữ và cập nhật hồ sơ chuyên môn, bằng cấp và lịch làm việc của đội ngũ tư vấn.",
                gradient: "from-teal-500 to-cyan-600"
              },
              {
                icon: UserIcon,
                title: "Hồ sơ người dùng",
                desc: "Theo dõi hành trình học tập, tư vấn và tham gia chương trình để người dùng tự quản lý và phát triển bản thân.",
                gradient: "from-pink-500 to-rose-600"
              },
              {
                icon: PresentationChartBarIcon,
                title: "Dashboard & Báo cáo",
                desc: "Giao diện thống kê trực quan hỗ trợ quản trị viên theo dõi, đánh giá và tối ưu hoạt động hiệu quả.",
                gradient: "from-indigo-500 to-purple-600"
              }
            ].map((item, index) => (
              <div key={index} className="group">
                <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-blue-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/0 to-transparent group-hover:via-blue-50/50 transition-all duration-500"></div>
                  <div className="relative flex items-start space-x-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${item.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-blue-700 text-xl mb-3 group-hover:text-blue-800 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-6 md:px-20 lg:px-32 bg-gradient-to-br from-gray-50 to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent mb-8">Đội Ngũ Của Chúng Tôi</h2>
            <div className="flex justify-center">
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-md"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-10 mb-16">
            <div className="group">
              <div className="bg-white p-10 rounded-3xl shadow-xl text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-blue-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <UserGroupIcon className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-blue-800 mb-4">Những Người Sáng Lập</h4>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Nhóm những tình nguyện viên đầy nhiệt huyết, cùng chung một sứ mệnh bảo vệ cộng đồng
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white p-10 rounded-3xl shadow-xl text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-emerald-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-green-600"></div>
                <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <UserIcon className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-emerald-800 mb-4">Chuyên Gia Tư Vấn</h4>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Đội ngũ chuyên viên tâm lý, bác sĩ với nhiều năm kinh nghiệm trong lĩnh vực phòng chống ma túy
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white p-10 rounded-3xl shadow-xl text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-purple-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-violet-600"></div>
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <HeartIcon className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-purple-800 mb-4">Tình Nguyện Viên</h4>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Trái tim của tổ chức - hàng trăm tình nguyện viên đang cống hiến thời gian và tâm huyết
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-xl text-center border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-amber-400"></div>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-amber-400 rounded-2xl flex items-center justify-center shadow-lg">
                <StarIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <p className="text-gray-700 text-xl italic leading-relaxed max-w-4xl mx-auto">
              "Và trái tim của tổ chức chính là hàng trăm tình nguyện viên – những người đã và đang 
              cống hiến thời gian và tâm huyết để biến những ý tưởng này thành hiện thực."
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6 md:px-20 lg:px-32 bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-blue-400/20 rounded-full translate-y-40 -translate-x-40"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-10 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Hãy Cùng Chúng Tôi Hành Động!
          </h2>
          <p className="text-xl text-gray-200 max-w-4xl mx-auto mb-16 leading-relaxed font-light">
            Dù bạn là một cá nhân muốn tìm hiểu, một phụ huynh lo lắng, hay một tổ chức muốn hợp tác, 
            luôn có một cách để bạn góp phần vào sứ mệnh chung.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group">
              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl hover:bg-white/20 transition-all duration-500 hover:-translate-y-2 border border-white/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <BookOpenIcon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4">Tìm Hiểu Các Khóa Học</h4>
                  <p className="text-blue-100 mb-6 leading-relaxed">
                    Khám phá các chương trình giáo dục được thiết kế chuyên biệt
                  </p>
                  <button className="bg-white text-blue-800 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Xem Khóa Học
                  </button>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl hover:bg-white/20 transition-all duration-500 hover:-translate-y-2 border border-white/20 relative overflow-hidden h-full flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-green-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex flex-col h-full">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <HeartIcon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4">Trở Thành Tình Nguyện Viên</h4>
                  <p className="text-blue-100 mb-6 leading-relaxed flex-grow">
                    Gia nhập đội ngũ những người thay đổi cộng đồng
                  </p>
                  <button className="bg-white text-emerald-800 px-8 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl mt-auto">
                    Đăng Ký Ngay
                  </button>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl hover:bg-white/20 transition-all duration-500 hover:-translate-y-2 border border-white/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-violet-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4">Liên Hệ Hợp Tác</h4>
                  <p className="text-blue-100 mb-6 leading-relaxed">
                    Kết nối với chúng tôi để xây dựng những dự án ý nghĩa
                  </p>
                  <button className="bg-white text-purple-800 px-8 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Liên Hệ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Message */}
      <section className="py-20 px-6 md:px-20 lg:px-32 bg-gradient-to-br from-white to-blue-50/30 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/20 to-transparent"></div>
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <SparklesIcon className="w-10 h-10 text-white" />
            </div>
          </div>
          <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent mb-8">
            Cùng Nhau Xây Dựng Cộng Đồng Không Ma Túy
          </h3>
          <p className="text-gray-700 text-xl leading-relaxed">
            Mỗi hành động nhỏ hôm nay có thể tạo nên thay đổi lớn trong tương lai. 
            Hãy cùng chúng tôi lan tỏa tri thức, kết nối yêu thương và hành động thiết thực 
            để xây dựng một cộng đồng khỏe mạnh, không ma túy.
          </p>
        </div>
      </section>
    </div>
  );
}
