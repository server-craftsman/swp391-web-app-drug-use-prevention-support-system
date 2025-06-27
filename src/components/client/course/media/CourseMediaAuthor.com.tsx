import React from "react";
import { Avatar, Typography, Tag } from "antd";
import type { Course } from "../../../../types/course/Course.res.type";

const { Text } = Typography;

interface CourseMediaAuthorProps {
    course: Course;
}

const CourseMediaAuthor: React.FC<CourseMediaAuthorProps> = ({ }) => {
    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
                <Avatar
                    size={48}
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=author"
                    className="border-2 border-blue-100 shadow-md"
                />
                <div>
                    <Text className="block font-semibold text-gray-800 text-sm">
                        Huy Nguyen
                    </Text>
                    <Text className="text-xs text-gray-500">
                        Founder at M&A.vn
                    </Text>
                </div>
            </div>

            <Tag
                color="blue"
                className="border-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-lg"
            >
                Chuyên gia
            </Tag>
        </div>
    );
};

export default CourseMediaAuthor; 