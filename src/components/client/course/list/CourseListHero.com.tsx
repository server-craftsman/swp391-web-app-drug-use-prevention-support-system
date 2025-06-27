import React from "react";

interface CourseListHeroProps {
    searchTerm: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CourseListHero: React.FC<CourseListHeroProps> = () => {
    return (
        <div className="bg-gradient-to-r from-[#20558A] via-[#153759] to-[#153759] text-white py-16 px-8 mb-12">
            <div className="max-w-[2000px] mx-auto text-center">
                <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    Khám Phá Khóa Học Chất Lượng
                </h1>
                <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
                    Nâng cao kiến thức và kỹ năng với các khóa học được thiết kế chuyên nghiệp
                </p>


            </div>
        </div>
    );
};

export default CourseListHero; 