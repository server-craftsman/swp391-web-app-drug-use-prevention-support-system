import React, { useState } from "react";
import { Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface CustomSearchProps {
    placeholder?: string;
    onSearch: (keyword: string) => void;
    loading?: boolean;
    className?: string;
    inputWidth?: string;
}

const CustomSearch: React.FC<CustomSearchProps> = ({
    placeholder = "Tìm kiếm...",
    onSearch,
    loading = false,
    className = "",
    inputWidth = "w-80"
}) => {
    const [searchKeyword, setSearchKeyword] = useState("");

    const handleSearch = () => {
        const trimmedKeyword = searchKeyword.trim();
        onSearch(trimmedKeyword);
    };

    const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKeyword(e.target.value);
    };

    const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleClear = () => {
        setSearchKeyword("");
        onSearch("");
    };

    return (
        <div className={`flex items-center gap-0 ${className}`}>
            <div className="relative flex items-center shadow-lg rounded-md overflow-hidden bg-white border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl">
                <Input
                    placeholder={placeholder}
                    allowClear
                    value={searchKeyword}
                    onChange={handleKeywordChange}
                    onKeyDown={handleEnterPress}
                    onClear={handleClear}
                    prefix={<SearchOutlined className="text-gray-400 ml-1" />}
                    className={`${inputWidth} h-8 border-0 rounded-none bg-transparent focus:shadow-none hover:bg-gray-50/50 transition-colors duration-200`}
                />
                <Button
                    type="primary"
                    size="small"
                    icon={<SearchOutlined />}
                    loading={loading}
                    className="h-8 border-0 bg-primary hover:bg-primary/80 px-4 text-white rounded-none shadow-none transition-all duration-300 font-medium"
                    onClick={handleSearch}
                >
                    Tra cứu
                </Button>
            </div>
        </div>
    );
};

export default CustomSearch;
