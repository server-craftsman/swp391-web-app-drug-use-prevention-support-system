import React, { useEffect, useState } from "react";
import { Typography, message } from "antd";
import { CourseService } from "../../../services/course/course.service";
import type { Course } from "../../../types/course/Course.res.type";
import CourseListGrid from "../course/list/CourseListGrid.com";

const { Title } = Typography;

const MyCourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  // Lấy userId từ localStorage userInfo
  let userId = "";
  const userInfoStr = localStorage.getItem("userInfo");
  if (userInfoStr) {
    try {
      const userInfo = JSON.parse(userInfoStr);
      userId = userInfo.id || "";
    } catch {
      userId = "";
    }
  }

  useEffect(() => {
    const fetchMyCourses = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const res = await CourseService.getMyCourses(userId);
        setCourses(res.data?.data || []);
      } catch (err) {
        message.error("Không thể tải danh sách khóa học của bạn!");
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, [userId]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Title level={2} className="mb-8 text-center">
        Khóa học của tôi
      </Title>
      <CourseListGrid
        courses={courses}
        loading={loading}
        total={courses.length}
        current={1}
        pageSize={courses.length || 1}
        onPageChange={() => {}}
      />
    </div>
  );
};

export default MyCourseList;
