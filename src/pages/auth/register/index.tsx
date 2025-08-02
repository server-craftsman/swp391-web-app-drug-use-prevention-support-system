import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Input, Button, DatePicker, Radio, Select, Upload, message } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined, CameraOutlined } from '@ant-design/icons'
import { useRegister } from '../../../hooks/useAuth'
import { UserRole } from '../../../app/enums'
import { ROUTER_URL } from '../../../consts/router.path.const'
import Background from '../../../assets/cover.jpg'
import dayjs from 'dayjs'
import { BaseService } from '../../../app/api/base.service'
import { LocationService } from '../../../services/location.service'
import type { Province, District, Ward } from '../../../services/location.service'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'
import type { RcFile } from 'antd/es/upload'

const { Option } = Select

// Validation functions
const validatePassword = (_: any, value: string) => {
  if (!value) {
    return Promise.resolve()
  }

  const hasUpperCase = /[A-Z]/.test(value)
  const hasLowerCase = /[a-z]/.test(value)
  const hasNumbers = /\d/.test(value)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value)

  if (value.length < 8) {
    return Promise.reject(new Error('Mật khẩu phải có ít nhất 8 ký tự'))
  }

  if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
    return Promise.reject(new Error('Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt'))
  }

  return Promise.resolve()
}

const validateEmail = (_: any, value: string) => {
  if (!value) {
    return Promise.resolve()
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    return Promise.reject(new Error('Email không hợp lệ'))
  }

  // Check for common email domains
  const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com']
  const domain = value.split('@')[1]
  if (!commonDomains.includes(domain) && !domain.includes('.edu') && !domain.includes('.gov')) {
    // Just a warning, not blocking
    console.warn('Uncommon email domain:', domain)
  }

  return Promise.resolve()
}

const validatePhoneNumber = (_: any, value: string) => {
  if (!value) {
    return Promise.resolve()
  }

  // Vietnam phone number patterns
  const vietnamPhoneRegex = /^(84|0[3|5|7|8|9])+([0-9]{8,9})$/
  if (!vietnamPhoneRegex.test(value.replace(/\s/g, ''))) {
    return Promise.reject(new Error('Số điện thoại Việt Nam không hợp lệ'))
  }

  return Promise.resolve()
}

const validateName = (_: any, value: string) => {
  if (!value) {
    return Promise.resolve()
  }

  const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/
  if (!nameRegex.test(value)) {
    return Promise.reject(new Error('Tên chỉ được chứa chữ cái và khoảng trắng'))
  }

  if (value.trim().length < 2) {
    return Promise.reject(new Error('Tên phải có ít nhất 2 ký tự'))
  }

  return Promise.resolve()
}

const validateDateOfBirth = (_: any, value: any) => {
  if (!value) {
    return Promise.resolve()
  }

  const today = dayjs()
  const birthDate = dayjs(value)
  const age = today.diff(birthDate, 'year')

  if (birthDate.isAfter(today)) {
    return Promise.reject(new Error('Ngày sinh không thể trong tương lai'))
  }

  if (age < 13) {
    return Promise.reject(new Error('Bạn phải ít nhất 13 tuổi để đăng ký'))
  }

  if (age > 100) {
    return Promise.reject(new Error('Vui lòng kiểm tra lại ngày sinh'))
  }

  return Promise.resolve()
}

const validatePasswordConfirmation = (getFieldValue: any) => ({
  validator(_: any, value: string) {
    if (!value || getFieldValue('password') === value) {
      return Promise.resolve()
    }
    return Promise.reject(new Error('Mật khẩu xác nhận không khớp'))
  },
})

const validateAddressDetails = (_: any, value: string) => {
  if (!value) {
    return Promise.resolve()
  }

  if (value.length < 5) {
    return Promise.reject(new Error('Địa chỉ chi tiết phải có ít nhất 5 ký tự'))
  }

  if (value.length > 200) {
    return Promise.reject(new Error('Địa chỉ chi tiết không được quá 200 ký tự'))
  }

  return Promise.resolve()
}

const RegisterPage = () => {
  const [form] = Form.useForm()
  const { mutate: register } = useRegister()

  // State for location data
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [selectedProvince, setSelectedProvince] = useState<string>('')
  const [selectedDistrict, setSelectedDistrict] = useState<string>('')
  const [addressDetails, setAddressDetails] = useState<string>('')

  // State for profile picture
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [profilePicUrl, setProfilePicUrl] = useState<string>('')
  const [previewImage, setPreviewImage] = useState<string>('')

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      const data = await LocationService.getProvinces()
      setProvinces(data)
    }

    fetchProvinces()
  }, [])

  // Fetch districts when province changes
  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        const data = await LocationService.getDistricts(selectedProvince)
        setDistricts(data)
        setSelectedDistrict('')
        setWards([])
      }

      fetchDistricts()
    }
  }, [selectedProvince])

  // Fetch wards when district changes
  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        const data = await LocationService.getWards(selectedDistrict)
        setWards(data)
      }

      fetchWards()
    }
  }, [selectedDistrict])

  // // Handle profile picture upload
  // const handleUpload = async () => {
  //   const file = fileList[0]
  //   if (!file || !file.originFileObj) {
  //     message.error('No file selected')
  //     return
  //   }

  //   // setUploading(true)
  //   try {
  //     const url = await BaseService.uploadFile(file.originFileObj)
  //     if (url) {
  //       setProfilePicUrl(url)
  //       message.success('Profile picture uploaded successfully')
  //     }
  //   } catch (error) {
  //     console.error('Upload error:', error)
  //     message.error('Profile picture upload failed')
  //   }
  // }

  // Xử lý thay đổi file khi người dùng chọn ảnh
  // Hàm này được gọi mỗi khi có sự thay đổi trong danh sách file upload
  const handleFileChange: UploadProps['onChange'] = ({ fileList }) => {
    // Cập nhật danh sách file vào state
    setFileList(fileList)

    if (fileList.length > 0) {
      // Lấy URL xem trước cho ảnh đã chọn
      const file = fileList[0]

      // Nếu có file gốc (file mới được chọn từ máy tính)
      if (file.originFileObj) {
        // Sử dụng FileReader để đọc file và tạo URL xem trước
        const reader = new FileReader()
        reader.onload = () => {
          // Khi đọc file xong, set URL xem trước
          setPreviewImage(reader.result as string)
        }
        // Đọc file dưới dạng Data URL (base64)
        reader.readAsDataURL(file.originFileObj)
      }
      // Nếu file đã có URL sẵn (file từ server)
      else if (file.url) {
        setPreviewImage(file.url)
      }
      // Nếu có thumbnail URL
      else if (file.thumbUrl) {
        setPreviewImage(file.thumbUrl)
      }
    } else {
      // Nếu không có file nào, xóa ảnh xem trước
      setPreviewImage('')
    }
  }

  // Hàm kiểm tra file trước khi upload để ngăn chặn upload tự động
  // Thực hiện validation file trước khi cho phép upload
  const beforeUpload = (file: RcFile) => {
    // Kiểm tra loại file - chỉ cho phép file ảnh
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.error('You can only upload image files!')
      return false
    }

    // Kiểm tra kích thước file - giới hạn dưới 5MB
    const isLt5M = file.size / 1024 / 1024 < 5
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!')
      return false
    }

    // Trả về false để ngăn chặn upload tự động
    // File sẽ được upload thủ công khi submit form
    return false
  }

  // ...existing code...

  // Handle form submission
  const handleSubmit = async (values: any) => {
    try {
      let finalProfilePicUrl = profilePicUrl;

      // Upload ảnh đại diện nếu có file nhưng chưa có URL
      if (fileList.length > 0 && !profilePicUrl) {
        const file = fileList[0];
        if (file.originFileObj) {
          const url = await BaseService.uploadFile(file.originFileObj);
          if (url) {
            finalProfilePicUrl = url;
            setProfilePicUrl(url);
          } else {
            return; // Dừng việc submit form nếu upload thất bại
          }
        }
      }

      // Format address
      const selectedProvObj = provinces.find(p => p.code === selectedProvince);
      const selectedDistObj = districts.find(d => d.code === selectedDistrict);
      const selectedWardObj = wards.find(w => w.code === values.ward);

      const fullAddress = LocationService.formatFullAddress(
        addressDetails,
        selectedWardObj,
        selectedDistObj,
        selectedProvObj
      );

      const formattedValues = {
        ...values,
        dob: dayjs(values.dob).format('YYYY-MM-DD'),
        role: UserRole.CUSTOMER,
        address: fullAddress,
        profilePicUrl: finalProfilePicUrl || ''
      };

      console.log('Submitting registration with data:', formattedValues); // Debug log

      register(formattedValues);
    } catch (error) {
      console.error('Form submission error:', error);
      message.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-purple-900/70 mix-blend-multiply z-10"></div>
        <div className="absolute inset-0 backdrop-blur-sm z-0"></div>
        <img
          src={Background}
          alt="Background"
          className="w-full h-full object-cover animate-slow-zoom"
        />
      </div>

      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden w-full max-w-2xl relative z-20 transition-all duration-700 hover:shadow-blue-900/20 animate-fade-in">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[80px] border-t-[#0056b3] border-l-[80px] border-l-transparent z-10"></div>
        <div className="absolute bottom-0 left-0 w-0 h-0 border-b-[80px] border-b-[#0056b3] border-r-[80px] border-r-transparent z-10"></div>

        <div className="px-10 pt-14 pb-10">
          <Link to="/" className="transition-transform hover:scale-105 duration-300 block">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold mb-2">PDP</h1>
              <h2 className="text-lg uppercase tracking-wider text-gray-800">Đăng ký tài khoản</h2>
            </div>
          </Link>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
            className="space-y-2"
          >
            {/* Modern Profile Picture Upload */}
            <Form.Item
              name="profilePicUrl"
              label="Ảnh đại diện"
            >
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4 group">
                  <div
                    className={`w-full h-full rounded-full overflow-hidden border-4 ${previewImage ? 'border-blue-500' : 'border-gray-200'} shadow-lg transition-all duration-300`}
                  >
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <UserOutlined className="text-4xl text-gray-400" />
                      </div>
                    )}
                  </div>

                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleFileChange}
                    maxCount={1}
                    fileList={fileList}
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity duration-300">
                      <div className="text-white flex flex-col items-center">
                        <CameraOutlined className="text-2xl" />
                        <span className="text-xs mt-1">{previewImage ? 'Thay đổi' : 'Chọn ảnh'}</span>
                      </div>
                    </div>
                  </Upload>
                </div>

                {/* {fileList.length > 0 && !profilePicUrl && (
                  <Button
                    type="primary"
                    onClick={handleUpload}
                    loading={uploading}
                    size="middle"
                    icon={<UploadOutlined />}
                    className="bg-blue-500 hover:bg-blue-600 border-none rounded-full px-6"
                  >
                    Tải ảnh lên
                  </Button>
                )} */}

                {fileList.length > 0 && (
                  <div className="text-sm text-gray-500 mt-2 max-w-[200px] truncate">
                    {fileList[0].name}
                  </div>
                )}
              </div>
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="firstName"
                label="Họ"
                rules={[
                  { required: true, message: 'Vui lòng nhập họ' },
                  { validator: validateName }
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Họ" />
              </Form.Item>

              <Form.Item
                name="lastName"
                label="Tên"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên' },
                  { validator: validateName }
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Tên" />
              </Form.Item>
            </div>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { validator: validateEmail }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu' },
                { validator: validatePassword }
              ]}
              help="Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số"
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                validatePasswordConfirmation(form.getFieldValue)
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="phoneNumber"
                label="Số điện thoại"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại' },
                  { validator: validatePhoneNumber }
                ]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
              </Form.Item>

              <Form.Item
                name="dob"
                label="Ngày sinh"
                rules={[
                  { required: true, message: 'Vui lòng chọn ngày sinh' },
                  { validator: validateDateOfBirth }
                ]}
              >
                <DatePicker
                  className="w-full"
                  placeholder="Ngày sinh"
                  disabledDate={(current) => {
                    // Disable future dates and dates more than 100 years ago
                    const today = dayjs()
                    const hundredYearsAgo = today.subtract(100, 'year')
                    return current && (current.isAfter(today, 'day') || current.isBefore(hundredYearsAgo, 'day'))
                  }}
                />
              </Form.Item>
            </div>

            <Form.Item
              name="gender"
              label="Giới tính"
              rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
            >
              <Radio.Group>
                <Radio value="male">Nam</Radio>
                <Radio value="female">Nữ</Radio>
                <Radio value="other">Khác</Radio>
              </Radio.Group>
            </Form.Item>

            {/* Address Section */}
            <div className="border p-4 rounded-md bg-gray-50">
              <h3 className="text-lg font-medium mb-4">Địa chỉ</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="province"
                  label="Tỉnh/Thành phố"
                  rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố' }]}
                >
                  <Select
                    placeholder="Chọn tỉnh/thành phố"
                    onChange={(value) => setSelectedProvince(value)}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {provinces.map((province) => (
                      <Option key={province.code} value={province.code}>
                        {province.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="district"
                  label="Quận/Huyện"
                  rules={[{ required: true, message: 'Vui lòng chọn quận/huyện' }]}
                >
                  <Select
                    placeholder="Chọn quận/huyện"
                    disabled={!selectedProvince}
                    onChange={(value) => setSelectedDistrict(value)}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {districts.map((district) => (
                      <Option key={district.code} value={district.code}>
                        {district.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="ward"
                  label="Phường/Xã"
                  rules={[{ required: true, message: 'Vui lòng chọn phường/xã' }]}
                >
                  <Select
                    placeholder="Chọn phường/xã"
                    disabled={!selectedDistrict}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {wards.map((ward) => (
                      <Option key={ward.code} value={ward.code}>
                        {ward.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="addressDetails"
                  label="Địa chỉ chi tiết"
                  rules={[
                    { required: true, message: 'Vui lòng nhập địa chỉ chi tiết' },
                    { validator: validateAddressDetails }
                  ]}
                >
                  <Input
                    prefix={<HomeOutlined />}
                    placeholder="Số nhà, tên đường..."
                    onChange={(e) => setAddressDetails(e.target.value)}
                  />
                </Form.Item>
              </div>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12 bg-primary hover:bg-[#0056b3] text-white rounded transition-all duration-300 font-medium hover:shadow-lg"
              >
                Đăng ký
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Đã có tài khoản? <Link to={ROUTER_URL.AUTH.LOGIN} className="text-primary hover:underline font-medium transition-colors duration-300">Đăng nhập</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage