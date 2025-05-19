import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

const SearchCom = () => {
  return (
    <div className="relative">
        <Input
            placeholder="Tìm kiếm khóa học, thông tin..."
            className="border border-gray-300 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all w-56"
            suffix={null}
            bordered={false}
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <SearchOutlined />
        </span>
    </div>
  )
}

export default SearchCom