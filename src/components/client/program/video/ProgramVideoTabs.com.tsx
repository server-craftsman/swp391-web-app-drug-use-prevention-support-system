import React from "react";
import { Card, Tabs, Typography } from "antd";
import { PlayCircleOutlined, DownloadOutlined, CommentOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import type { Program } from "../../../../types/program/Program.type";

// Import the new tab components
import ProgramOverviewTab from "./ProgramOverviewTab.ui";
import ProgramDownloadsTab from "./ProgramDownloadsTab.ui";
// import ProgramTranscriptTab from "./ProgramTranscriptTab";
import ProgramDiscussionTab from "./ProgramDiscussionTab.ui";

interface ProgramVideoTabsProps {
    program: Program;
    activeTab: string;
    onTabChange: (key: string) => void;
    videoRef?: React.RefObject<HTMLVideoElement | null>;
}

const ProgramVideoTabs: React.FC<ProgramVideoTabsProps> = ({ program, activeTab, onTabChange }) => {
    const { Title } = Typography;
    const tabVariants = {
        initial: {
            opacity: 0,
            y: 20,
            scale: 0.95
        },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1
        },
        exit: {
            opacity: 0,
            y: -20,
            scale: 0.95
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <ProgramOverviewTab program={program} />;
            case 'downloads':
                return <ProgramDownloadsTab program={program} />;
            case 'discussion':
                return <ProgramDiscussionTab program={program} />;
            default:
                return <ProgramOverviewTab program={program} />;
        }
    };

    return (
        <Card
            title={<Title level={3} style={{ margin: 0, color: '#1a202c', fontWeight: 700 }}>{program.name}</Title>}
            headStyle={{ borderBottom: '1px solid #e8e8e8', padding: '16px 24px' }}
            style={{
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                borderRadius: '12px',
                border: '1px solid #e8e8e8',
                backgroundColor: '#ffffff',
                marginBottom: '32px'
            }}>
            <Tabs
                activeKey={activeTab}
                onChange={onTabChange}
                style={{
                    margin: '0 -24px',
                    padding: '0 24px',
                    '--ant-primary-color': '#20558A'
                } as React.CSSProperties}
                size="large"
                className="coursera-tabs"
                items={[
                    {
                        key: 'overview',
                        label: (
                            <motion.span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: activeTab === 'overview' ? '#20558A' : '#718096',
                                    fontWeight: activeTab === 'overview' ? 600 : 500,
                                    padding: '8px 16px'
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                <PlayCircleOutlined />
                                <span>Mô tả</span>
                            </motion.span>
                        ),
                        children: (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`overview-${activeTab}`}
                                    variants={tabVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{
                                        duration: 0.3,
                                        ease: "easeInOut"
                                    }}
                                >
                                    {activeTab === 'overview' && renderTabContent()}
                                </motion.div>
                            </AnimatePresence>
                        )
                    },
                    {
                        key: 'downloads',
                        label: (
                            <motion.span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: activeTab === 'downloads' ? '#20558A' : '#718096',
                                    fontWeight: activeTab === 'downloads' ? 600 : 500,
                                    padding: '8px 16px'
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                <DownloadOutlined />
                                <span>Tài liệu</span>
                            </motion.span>
                        ),
                        children: (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`downloads-${activeTab}`}
                                    variants={tabVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{
                                        duration: 0.3,
                                        ease: "easeInOut"
                                    }}
                                >
                                    {activeTab === 'downloads' && renderTabContent()}
                                </motion.div>
                            </AnimatePresence>
                        )
                    },
                    // {
                    //     key: 'transcript',
                    //     label: (
                    //         <span style={{ 
                    //             display: 'flex', 
                    //             alignItems: 'center', 
                    //             gap: '8px',
                    //             color: activeTab === 'transcript' ? '#20558A' : '#718096',
                    //             fontWeight: activeTab === 'transcript' ? 600 : 500,
                    //             padding: '8px 16px'
                    //         }}>
                    //             <FileTextOutlined />
                    //             <span>Transcript</span>
                    //         </span>
                    //     ),
                    //     children: <ProgramTranscriptTab program={program} videoRef={videoRef} />
                    // },
                    {
                        key: 'discussion',
                        label: (
                            <motion.span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: activeTab === 'discussion' ? '#20558A' : '#718096',
                                    fontWeight: activeTab === 'discussion' ? 600 : 500,
                                    padding: '8px 16px'
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                <CommentOutlined />
                                <span>Thảo luận</span>
                            </motion.span>
                        ),
                        children: (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`discussion-${activeTab}`}
                                    variants={tabVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{
                                        duration: 0.3,
                                        ease: "easeInOut"
                                    }}
                                >
                                    {activeTab === 'discussion' && renderTabContent()}
                                </motion.div>
                            </AnimatePresence>
                        )
                    }
                ]}
            />
            <style>{`
                .coursera-tabs .ant-tabs-tab {
                    border: none !important;
                    border-radius: 8px 8px 0 0 !important;
                    margin-right: 4px !important;
                    background: transparent !important;
                    transition: all 0.3s ease !important;
                }
                .coursera-tabs .ant-tabs-tab:hover {
                    background: rgba(32, 85, 138, 0.05) !important;
                }
                .coursera-tabs .ant-tabs-tab.ant-tabs-tab-active {
                    background: #ffffff !important;
                    border-bottom: 2px solid #20558A !important;
                }
                .coursera-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
                    color: #20558A !important;
                }
                .coursera-tabs .ant-tabs-ink-bar {
                    background: #20558A !important;
                    height: 3px !important;
                }
                .coursera-tabs .ant-tabs-content-holder {
                    background: #ffffff;
                    border-radius: 0 0 12px 12px;
                }
                .coursera-tabs .ant-tabs-nav {
                    margin-bottom: 0 !important;
                    background: #ffffff;
                    border-radius: 12px 12px 0 0;
                    padding: 0 16px;
                }
            `}</style>
        </Card>
    );
};

export default ProgramVideoTabs;