import React, { useState } from 'react';
import { SettingsHeader, SettingsTabs } from '../../../components/client/settings';

const SettingsPage: React.FC = () => {
    const [loading, setLoading] = useState(false);

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-[950px] mx-auto px-4">
                <SettingsHeader />
                <SettingsTabs loading={loading} setLoading={setLoading} />
            </div>
        </div>
    );
};

export default SettingsPage;
