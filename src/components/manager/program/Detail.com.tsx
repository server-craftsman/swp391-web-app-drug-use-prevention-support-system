import React from "react";
import { Drawer, Descriptions, Image, Tag } from "antd";
import type { Program } from "../../../types/program/Program.type";
import { ProgramType } from "../../../app/enums/programType.enum";
import { helpers } from "../../../utils";
interface DetailProps {
    visible: boolean;
    onClose: () => void;
    program?: Program | null;
}

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
                </Descriptions>
            )}
        </Drawer>
    );
};

export default ProgramDetailDrawer;
