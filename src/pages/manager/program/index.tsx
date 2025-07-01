import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ProgramDisplay from "../../../components/manager/program/Display.com";
import CreateProgramModal from "../../../components/manager/program/Create.com";
import UpdateProgramModal from "../../../components/manager/program/Update.com";
import ProgramDetailDrawer from "../../../components/manager/program/Detail.com";
import { ProgramService } from "../../../services/program/program.service";
import type { Program } from "../../../types/program/Program.type";
import { helpers } from "../../../utils";

const ProgramManagementPage: React.FC = () => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState("");

    const [createVisible, setCreateVisible] = useState(false);
    const [detailVisible, setDetailVisible] = useState(false);
    const [updateVisible, setUpdateVisible] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
    const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);

    const fetchPrograms = async () => {
        setLoading(true);
        try {
            const res = await ProgramService.getAllPrograms({
                pageNumber,
                pageSize,
                filterByName: searchKeyword || undefined,
            });
            if (res?.data) {
                const { data: list, totalCount } = res.data;
                setPrograms(list);
                setTotal(totalCount ?? list.length);
            } else {
                message.error("Failed to fetch programs");
            }
        } catch {
            message.error("Failed to fetch programs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrograms();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumber, pageSize, searchKeyword]);

    const handleRefresh = () => {
        fetchPrograms();
    };

    const handlePaginationChange = (page: number, size: number): void => {
        setPageNumber(page);
        setPageSize(size);
    };

    const handleSearch = (keyword: string) => {
        // Reset to page 1 when searching
        setPageNumber(1);
        // If empty keyword, reset to show all programs (like initial fetch)
        const trimmedKeyword = keyword.trim() || '';
        setSearchKeyword(trimmedKeyword);

        // Force refresh even if keyword is the same
        setTimeout(() => {
            fetchPrograms();
        }, 0);
    };

    return (
        <div className="p-6 bg-white rounded-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Quản lý chương trình</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateVisible(true)} className="bg-[#20558A]">
                    Thêm chương trình
                </Button>
            </div>

            <ProgramDisplay
                programs={programs}
                loading={loading}
                total={total}
                currentPage={pageNumber}
                pageSize={pageSize}
                onPaginationChange={handlePaginationChange}
                onView={(p) => {
                    setSelectedProgram(p);
                    setDetailVisible(true);
                }}
                onEdit={(p) => {
                    setSelectedProgramId(p.id ?? null);
                    setUpdateVisible(true);
                }}
                onDelete={(p) => {
                    if (window.confirm("Bạn có chắc chắn muốn xóa chương trình này?")) {
                        ProgramService.deleteProgram(String(p.id))
                            .then(() => {
                                helpers.notificationMessage("Chương trình đã được xóa thành công", 'success')
                                handleRefresh();
                            })
                            .catch(() => helpers.notificationMessage("Xóa chương trình thất bại", 'error'))
                    }
                }}
                onSearch={handleSearch}
            />

            {/* Create Modal */}
            <CreateProgramModal
                visible={createVisible}
                onCancel={() => setCreateVisible(false)}
                onSuccess={() => {
                    setCreateVisible(false);
                    handleRefresh();
                }}
            />

            {/* Update Modal */}
            <UpdateProgramModal
                visible={updateVisible}
                onCancel={() => {
                    setUpdateVisible(false);
                    setSelectedProgramId(null);
                }}
                onSuccess={() => {
                    setUpdateVisible(false);
                    setSelectedProgramId(null);
                    handleRefresh();
                }}
                programId={selectedProgramId}
            />

            {/* Detail Drawer */}
            <ProgramDetailDrawer
                visible={detailVisible}
                onClose={() => {
                    setDetailVisible(false);
                    setSelectedProgram(null);
                }}
                program={selectedProgram}
            />
        </div>
    );
};

export default ProgramManagementPage;