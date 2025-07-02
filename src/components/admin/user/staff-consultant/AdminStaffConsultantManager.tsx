import React, { useState } from "react";
import { Tabs } from "antd";
import { UserOutlined, TeamOutlined } from "@ant-design/icons";
import AdminStaffManager from "../staff-manager/AdminStaffManager";
import AdminConsultantManager from "../consultant-manager/AdminConsultantManager";

const AdminStaffConsultantManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState("staff");

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quản lý Nhân viên & Tư vấn viên
        </h1>
        <p className="text-gray-600">
          Quản lý tập trung đội ngũ nhân viên và tư vấn viên trong hệ thống
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          size="large"
          className="px-6 pt-4"
          items={[
            {
              key: "staff",
              label: (
                <span className="flex items-center gap-2">
                  <UserOutlined />
                  Nhân viên
                </span>
              ),
              children: <AdminStaffManager />,
            },
            {
              key: "consultant",
              label: (
                <span className="flex items-center gap-2">
                  <TeamOutlined />
                  Tư vấn viên
                </span>
              ),
              children: <AdminConsultantManager />,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default AdminStaffConsultantManager;
