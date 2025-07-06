import React from "react";
import { Drawer, Descriptions, Image, Tag } from "antd";
import type { Program } from "../../../types/program/Program.type";
import { ProgramType } from "../../../app/enums/programType.enum";
import { helpers } from "../../../utils";
import { RiskLevel } from "../../../app/enums/riskLevel.enum";

interface DetailProps {
    visible: boolean;
    onClose: () => void;
    program?: Program | null;
}

const riskLabels: Record<RiskLevel, string> = {
    [RiskLevel.NONE]: "Không",
    [RiskLevel.LOW]: "Thấp",
    [RiskLevel.MEDIUM]: "Trung bình",
    [RiskLevel.HIGH]: "Cao",
    [RiskLevel.VERY_HIGH]: "Rất cao",
};

const ProgramDetailDrawer: React.FC<DetailProps> = ({ visible, onClose, program }) => {
    return (
        <Drawer title="Chi tiết chương trình" width={680} open={visible} onClose={onClose} destroyOnClose>
            {program && (
                <Descriptions column={1} bordered>
                    <Descriptions.Item label="Ảnh">
                        <Image src={program.programImgUrl} width={200} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Tên">{program.name}</Descriptions.Item>
                    <Descriptions.Item label="Mô tả">
                        <div dangerouslySetInnerHTML={{ __html: program.description || '' }} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Địa điểm">{program.location}</Descriptions.Item>
                    <Descriptions.Item label="Loại">
                        <Tag color={program.type === ProgramType.COMMUNICATION ? "green" : program.type === ProgramType.TRAINING ? "blue" : "purple"}>
                            {program.type}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày bắt đầu">{helpers.formatDate(new Date(program.startDate))}</Descriptions.Item>
                    <Descriptions.Item label="Ngày kết thúc">{helpers.formatDate(new Date(program.endDate))}</Descriptions.Item>
                    <Descriptions.Item label="Video">
                        {program.programVidUrl ? (
                            <video src={program.programVidUrl} controls width={250} />
                        ) : (
                            <span className="text-gray-500 italic">Không có video</span>
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Mức độ rủi ro">
                        <Tag color={program.riskLevel === RiskLevel.VERY_HIGH ? 'red' : program.riskLevel === RiskLevel.HIGH ? 'orange' : program.riskLevel === RiskLevel.MEDIUM ? 'gold' : program.riskLevel === RiskLevel.LOW ? 'blue' : 'green'}>
                            {riskLabels[program.riskLevel as RiskLevel]}
                        </Tag>
                    </Descriptions.Item>
                </Descriptions>
            )}
        </Drawer>
    );
};

export default ProgramDetailDrawer;
