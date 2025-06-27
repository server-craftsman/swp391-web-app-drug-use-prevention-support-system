import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface CourseListHeroProps {
    searchTerm: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CourseListHero: React.FC<CourseListHeroProps> = ({ searchTerm, onSearchChange }) => {
    return (
        <div className="bg-gradient-to-r from-[#20558A] via-[#153759] to-[#153759] text-white py-16 px-8 mb-12">
            <div className="max-w-[2000px] mx-auto text-center">
                <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    Khám Phá Khóa Học Chất Lượng
                </h1>
                <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
                    Nâng cao kiến thức và kỹ năng với các khóa học được thiết kế chuyên nghiệp
                </p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto">
                    <Input
                        size="large"
                        placeholder="Tìm kiếm khóa học..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        value={searchTerm}
                        onChange={onSearchChange}
                        className="rounded-full border-0 shadow-lg"
                        style={{ height: '50px', fontSize: '16px' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CourseListHero; 