import React from "react";
import CourseraVideoPlayer from "./video/CourseraVideoPlayer.ui";
import type { Program } from "../../../types/program/Program.type";

interface ProgramMediaBannerProps {
    program: Program;
    videoRef?: React.RefObject<HTMLVideoElement | null>;
    onTimeUpdate?: (currentTime: number) => void;
}

const ProgramMediaBanner: React.FC<ProgramMediaBannerProps> = ({
    program,
    videoRef,
    onTimeUpdate
}) => {
    return (
        <div style={{
            marginBottom: '32px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
            <CourseraVideoPlayer
                program={program}
                videoRef={videoRef}
                onTimeUpdate={onTimeUpdate}
            />

            {/* Program name below video */}
            {/* <div style={{ padding: '16px 8px 0 8px' }}>
                <Title level={2} style={{ margin: 0, color: '#1a202c', fontWeight: 700 }}>
                    {program.name}
                </Title>
            </div> */}
        </div>
    );
};

export default ProgramMediaBanner; 