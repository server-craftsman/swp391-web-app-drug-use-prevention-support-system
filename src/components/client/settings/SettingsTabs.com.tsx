import React from 'react';
import { Tabs } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import ProfileTab from './ProfileTab.com';
import PasswordTab from './PasswordTab.com';

interface SettingsTabsProps {
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({ loading, setLoading }) => {
    const tabItems = [
        {
            key: 'profile',
            label: (
                <span className="flex items-center">
                    <UserOutlined className="mr-2" />
                    Hồ sơ cá nhân
                </span>
            ),
            children: <ProfileTab loading={loading} setLoading={setLoading} />,
        },
        {
            key: 'password',
            label: (
                <span className="flex items-center">
                    <LockOutlined className="mr-2" />
                    Đổi mật khẩu
                </span>
            ),
            children: <PasswordTab loading={loading} setLoading={setLoading} />,
        },
    ];

    return (
        <Tabs
            defaultActiveKey="profile"
            size="large"
            tabPosition="top"
            items={tabItems}
            className="rounded-lg shadow-sm"
            tabBarStyle={{
                padding: '0 24px',
                margin: 0,
                borderBottom: '1px solid #f0f0f0'
            }}
        />
    );
};

export default SettingsTabs; 