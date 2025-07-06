import React, { useState, useEffect } from "react";
import { Row, Col, Spin, message, Button, Input } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { ConsultantService } from "../../../services/consultant/consultant.service";
import type { Consultant } from "../../../types/consultant/consultant.res.type";
import ConsultantCard from "./ConsultantCard.ui";

interface ConsultantShowcaseProps {
    onBookAppointment: () => void;
}

const ConsultantShowcase: React.FC<ConsultantShowcaseProps> = ({ onBookAppointment }) => {
    const [consultants, setConsultants] = useState<Consultant[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredConsultants, setFilteredConsultants] = useState<Consultant[]>([]);

    const fetchConsultants = async () => {
        setLoading(true);
        try {
            const res = await ConsultantService.getAllConsultants({
                PageNumber: 1,
                PageSize: 20
            });
            const data = res.data as any;
            const consultantList = Array.isArray(data?.data) ? data.data : [];
            setConsultants(consultantList);
            setFilteredConsultants(consultantList);
        } catch (err) {
            message.error("Không thể tải danh sách tư vấn viên!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConsultants();
    }, []);

    useEffect(() => {
        const filtered = consultants.filter(consultant =>
            (consultant.name && consultant.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (consultant.description && consultant.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (consultant.email && consultant.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredConsultants(filtered);
    }, [searchTerm, consultants]);

    return (
        <div className="consultant-showcase py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#20558A] mb-4">
                        Đội ngũ chuyên gia
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Gặp gỡ những chuyên gia hàng đầu của chúng tôi, sẵn sàng hỗ trợ bạn
                        với kinh nghiệm phong phú và chuyên môn sâu rộng.
                    </p>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-between items-center">
                    <Input
                        placeholder="Tìm kiếm chuyên gia theo tên, email hoặc mô tả..."
                        prefix={<SearchOutlined />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-md"
                        size="large"
                    />

                    <Button
                        icon={<ReloadOutlined />}
                        onClick={fetchConsultants}
                        loading={loading}
                        size="large"
                    >
                        Làm mới
                    </Button>
                </div>

                {/* Results Info */}
                <div className="mb-6">
                    <p className="text-gray-600">
                        Hiển thị {filteredConsultants.length} trên {consultants.length} chuyên gia
                    </p>
                </div>

                {/* Consultants Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <Spin size="large" />
                        <p className="mt-4 text-gray-600">Đang tải danh sách chuyên gia...</p>
                    </div>
                ) : filteredConsultants.length > 0 ? (
                    <Row gutter={[24, 24]}>
                        {filteredConsultants.map((consultant) => (
                            <Col xs={24} sm={12} lg={8} xl={6} key={consultant.id}>
                                <ConsultantCard
                                    consultant={consultant}
                                    onBookAppointment={onBookAppointment}
                                    className="h-full"
                                />
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            Không tìm thấy chuyên gia
                        </h3>
                        <p className="text-gray-500">
                            {searchTerm
                                ? `Không có chuyên gia nào phù hợp với từ khóa "${searchTerm}"`
                                : "Hiện tại chưa có chuyên gia nào có sẵn"
                            }
                        </p>
                        {searchTerm && (
                            <Button
                                type="link"
                                onClick={() => setSearchTerm("")}
                                className="mt-2"
                            >
                                Xóa bộ lọc
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConsultantShowcase; 