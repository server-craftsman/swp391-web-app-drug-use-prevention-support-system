import React from 'react';
import { motion } from 'framer-motion';

const SettingsHeader: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
        >
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Cài đặt tài khoản</h1>
            <p className="text-gray-600">Quản lý thông tin cá nhân và bảo mật tài khoản</p>
        </motion.div>
    );
};

export default SettingsHeader; 