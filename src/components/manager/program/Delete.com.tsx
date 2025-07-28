import React, { useState } from "react";
import { Modal, Button } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { ProgramService } from "../../../services/program/program.service";
import { helpers } from "../../../utils";

interface DeleteProps {
    programId: string | number;
    onSuccess: () => void;
    visible?: boolean;
    onCancel?: () => void;
}

const DeleteProgramButton: React.FC<DeleteProps> = ({ programId, onSuccess, visible = false, onCancel }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    // Use external visible prop if provided, otherwise use internal state
    const modalVisible = visible !== undefined ? visible : isModalVisible;

    const showDeleteModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            setIsModalVisible(false);
        }
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            await ProgramService.deleteProgram(String(programId));
            helpers.notificationMessage("Chương trình đã được xóa thành công", 'success');
            onSuccess();
            if (onCancel) {
                onCancel();
            } else {
                setIsModalVisible(false);
            }
        } catch {
            helpers.notificationMessage("Xóa chương trình thất bại", 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Only render button if not controlled externally */}
            {visible === undefined && (
                <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={showDeleteModal}
                    className="h-10 px-4 rounded-lg border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400 transition-all duration-200 shadow-sm hover:shadow-md"
                    size="middle"
                />
            )}

            <Modal
                title={
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <ExclamationCircleOutlined className="text-red-500 text-xl" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-1">Xác nhận xóa chương trình</h2>
                            <p className="text-sm text-gray-500">Hành động này không thể hoàn tác</p>
                        </div>
                    </div>
                }
                open={modalVisible}
                onCancel={handleCancel}
                width={480}
                footer={null}
                destroyOnClose
                styles={{
                    body: {
                        padding: '24px 32px'
                    },
                    content: {
                        borderRadius: '12px',
                        background: 'white'
                    },
                    header: {
                        background: 'white',
                        borderBottom: 'none',
                        padding: '24px 32px 0'
                    }
                }}
                className="delete-program-modal"
            >
                <div className="text-center py-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Bạn có chắc chắn muốn xóa?</h3>
                    <p className="text-gray-600 mb-6">
                        Chương trình này sẽ bị xóa vĩnh viễn và không thể khôi phục.
                        Tất cả dữ liệu liên quan sẽ bị mất.
                    </p>

                    <div className="flex justify-center gap-4">
                        <Button
                            onClick={handleCancel}
                            className="h-12 px-8 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                            size="large"
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            danger
                            loading={loading}
                            onClick={handleDelete}
                            className="h-12 px-8 rounded-xl bg-red-500 border-0 hover:bg-red-600 shadow-lg hover:shadow-xl transition-all duration-200"
                            size="large"
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {loading ? 'Đang xóa...' : 'Xóa chương trình'}
                            </span>
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default DeleteProgramButton;
