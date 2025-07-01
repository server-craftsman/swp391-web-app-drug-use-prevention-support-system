import React, { useState } from "react";
import { Image } from "antd";
import type { Course } from "../../../../types/course/Course.res.type";

interface CourseMediaImageProps {
  course: Course;
}

const CourseMediaImage: React.FC<CourseMediaImageProps> = ({ course }) => {
  const [imageError, setImageError] = useState(false);

  const fallbackImage =
    "https://via.placeholder.com/800x450/4f46e5/ffffff?text=Course+Image";

  return (
    <div className="relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
      <Image
        src={imageError ? fallbackImage : course.imageUrls?.[0]}
        alt={course.name}
        className="w-full h-64 object-cover transform group-hover:scale-105 transition-all duration-700"
        onError={() => setImageError(true)}
        fallback={fallbackImage}
        preview={{
          mask: (
            <div className="flex flex-col items-center text-white">
              <svg
                className="w-6 h-6 mb-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Xem trước</span>
            </div>
          ),
        }}
      />

      {/* Floating elements */}
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-800 shadow-lg">
          Khóa học
        </div>
      </div>

      <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg cursor-pointer hover:bg-white transition-all duration-200">
          <svg
            className="w-4 h-4 text-gray-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CourseMediaImage;
