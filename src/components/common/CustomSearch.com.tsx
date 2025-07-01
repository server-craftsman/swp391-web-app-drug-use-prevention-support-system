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
        <div className={`flex items-center gap-3 ${className}`}>
            <div className="relative">
                <Input
                    placeholder={placeholder}
                    allowClear
                    value={searchKeyword}
                    onChange={handleKeywordChange}
                    onKeyDown={handleEnterPress}
                    onClear={handleClear}
                    prefix={<SearchOutlined className="text-gray-400" />}
                    className={`${inputWidth} h-10 rounded-lg border-gray-200 focus:border-primary shadow-sm`}
                />
            </div>
            <Button
                type="primary"
                size="large"
                loading={loading}
                className="bg-primary hover:bg-primary/80 border-0 rounded-lg px-6 h-10 shadow-md transition-all duration-200"
                onClick={handleSearch}
            >
                Tìm kiếm
            </Button>
        </div>
    );
};

export default CustomSearch;
