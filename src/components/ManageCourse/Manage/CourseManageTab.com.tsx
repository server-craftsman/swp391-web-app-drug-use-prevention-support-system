// src/components/admin/CourseManagementTabs.tsx
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import CourseManager from "../course/CourseManager.com";
import SessionManager from "../session/SessionManager.com";
import LessonManager from "../lesson/LessonManager.com";
export default function CourseManageTab() {
  {
    const items: TabsProps["items"] = [
      {
        key: "1",
        label: "Quản lý khóa học",
        children: <CourseManager />,
      },
      {
        key: "2",
        label: "Quản lý buổi học",
        children: <SessionManager />,
      },
      {
        key: "3",
        label: "Quản lý bài học",
        children: <LessonManager />,
      },
    ];

    return <Tabs defaultActiveKey="1" items={items} />;
  }
}
