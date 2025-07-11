import React, { useRef, useState, useEffect } from 'react';
import { Button, Slider, Tooltip, Progress } from 'antd';
import {
    PlayCircleOutlined,
    PauseCircleOutlined,
    SoundOutlined,
    FullscreenOutlined,
    FullscreenExitOutlined,
    SettingOutlined,
    BackwardOutlined,
    ForwardOutlined,
    RetweetOutlined,
    PictureOutlined
} from '@ant-design/icons';
import type { Program } from '../../../../types/program/Program.type';

/**
 * CÁCH HOẠT ĐỘNG CỦA COURSERA VIDEO PLAYER:
 * 
 * 1. KIẾN TRÚC COMPONENT:
 *    - Component nhận vào một Program object chứa thông tin video
 *    - Có thể nhận videoRef từ bên ngoài hoặc tạo ref nội bộ
 *    - Callback onTimeUpdate để thông báo thời gian hiện tại cho component cha
 * 
 * 2. QUẢN LÝ STATE:
 *    - isPlaying: trạng thái đang phát/dừng
 *    - currentTime/duration: thời gian hiện tại và tổng thời gian
 *    - volume/isMuted: âm lượng và trạng thái tắt tiếng
 *    - isFullscreen: chế độ toàn màn hình
 *    - showControls: hiển thị/ẩn điều khiển
 *    - playbackRate: tốc độ phát (0.5x, 1x, 2x...)
 *    - isLooping: chế độ lặp video
 *    - isMiniPlayer: chế độ picture-in-picture
 * 
 * 3. TƯƠNG TẤC VỚI VIDEO:
 *    - Lắng nghe các sự kiện từ HTML video element
 *    - Đồng bộ state với trạng thái thực tế của video
 *    - Cập nhật progress bar theo thời gian phát
 * 
 * 4. ĐIỀU KHIỂN TỰ ĐỘNG ẨN:
 *    - Hiển thị controls khi di chuột
 *    - Tự động ẩn sau 3 giây nếu đang phát video
 *    - Luôn hiển thị khi video đang dừng
 * 
 * 5. TÍNH NĂNG NÂNG CAO:
 *    - Picture-in-Picture cho mini player
 *    - Fullscreen mode
 *    - Buffer progress indicator
 *    - Keyboard shortcuts (space, arrow keys)
 *    - Double click để fullscreen
 */

interface CourseraVideoPlayerProps {
    program: Program;
    videoRef?: React.RefObject<HTMLVideoElement | null>;
    onTimeUpdate?: (currentTime: number) => void;
}

const CourseraVideoPlayer: React.FC<CourseraVideoPlayerProps> = ({
    program,
    videoRef: externalVideoRef,
    onTimeUpdate
}) => {
    // Tạo refs để tham chiếu DOM elements
    const internalVideoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sử dụng external ref nếu có, ngược lại dùng internal ref
    const videoRef = externalVideoRef || internalVideoRef;

    // States quản lý trạng thái video player
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [buffered, setBuffered] = useState(0);
    // States cho tính năng loop và mini-player
    const [isLooping, setIsLooping] = useState(false);
    const [isMiniPlayer, setIsMiniPlayer] = useState(false);

    // Kiểm tra khả năng hỗ trợ Picture-in-Picture
    const isPiPAvailable = typeof document !== 'undefined' && (document as any).pictureInPictureEnabled;

    // Hàm format thời gian thành định dạng HH:MM:SS hoặc MM:SS
    const formatTime = (time: number): string => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Effect lắng nghe các sự kiện từ video element
    useEffect(() => {
        const video = videoRef?.current;
        if (!video) return;

        // Khi metadata được tải xong (biết được thời lượng video)
        const handleLoadedMetadata = () => {
            setDuration(video.duration);
            setIsVideoLoaded(true);
        };

        // Cập nhật thời gian hiện tại và progress buffer
        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime);
            onTimeUpdate?.(video.currentTime);

            // Cập nhật thanh progress buffer (phần video đã tải)
            if (video.buffered.length > 0) {
                const bufferedEnd = video.buffered.end(video.buffered.length - 1);
                setBuffered((bufferedEnd / video.duration) * 100);
            }
        };

        // Xử lý sự kiện play/pause
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        // Xử lý thay đổi âm lượng
        const handleVolumeChange = () => {
            setVolume(video.volume);
            setIsMuted(video.muted);
        };

        // Đăng ký các event listeners
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        video.addEventListener('volumechange', handleVolumeChange);

        // Cleanup khi component unmount
        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
            video.removeEventListener('volumechange', handleVolumeChange);
        };
    }, [videoRef, onTimeUpdate]);

    // Effect xử lý fullscreen mode
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Effect xử lý tự động ẩn/hiện controls
    useEffect(() => {
        const resetControlsTimeout = () => {
            // Clear timeout cũ nếu có
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
            // Hiển thị controls
            setShowControls(true);
            // Đặt timeout mới để ẩn controls sau 3 giây (chỉ khi đang phát)
            controlsTimeoutRef.current = setTimeout(() => {
                if (isPlaying) setShowControls(false);
            }, 3000);
        };

        const container = containerRef.current;
        if (container) {
            // Hiển thị controls khi di chuột
            container.addEventListener('mousemove', resetControlsTimeout);
            container.addEventListener('mouseenter', resetControlsTimeout);
            // Ẩn controls khi rời chuột (nếu đang phát)
            container.addEventListener('mouseleave', () => {
                if (isPlaying) setShowControls(false);
            });
        }

        return () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
            if (container) {
                container.removeEventListener('mousemove', resetControlsTimeout);
                container.removeEventListener('mouseenter', resetControlsTimeout);
                container.removeEventListener('mouseleave', () => {
                    if (isPlaying) setShowControls(false);
                });
            }
        };
    }, [isPlaying]);

    // Hàm toggle play/pause
    const togglePlay = () => {
        const video = videoRef?.current;
        if (!video) return;

        if (isPlaying) {
            video.pause();
        } else {
            video.play();
        }
    };

    // Hàm xử lý seek (tua video)
    const handleSeek = (value: number) => {
        const video = videoRef?.current;
        if (!video) return;
        video.currentTime = (value / 100) * duration;
    };

    // Hàm thay đổi âm lượng
    const handleVolumeChange = (value: number) => {
        const video = videoRef?.current;
        if (!video) return;
        video.volume = value / 100;
        setVolume(value / 100);
    };

    // Hàm toggle mute/unmute
    const toggleMute = () => {
        const video = videoRef?.current;
        if (!video) return;
        video.muted = !video.muted;
    };

    // Hàm toggle fullscreen
    const toggleFullscreen = () => {
        const container = containerRef.current;
        if (!container) return;

        if (!isFullscreen) {
            container.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    // Hàm skip thời gian (tua tới/lùi)
    const skipTime = (seconds: number) => {
        const video = videoRef?.current;
        if (!video) return;
        video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
    };

    // Hàm thay đổi tốc độ phát
    const changePlaybackRate = (rate: number) => {
        const video = videoRef?.current;
        if (!video) return;
        video.playbackRate = rate;
        setPlaybackRate(rate);
    };

    // Hàm toggle loop (lặp video)
    const toggleLoop = () => {
        const video = videoRef?.current;
        if (!video) return;
        const next = !isLooping;
        video.loop = next;
        setIsLooping(next);
    };

    // Hàm toggle Picture-in-Picture (mini player)
    const toggleMiniPlayer = async () => {
        const video = videoRef?.current;
        if (!video || !isPiPAvailable) return;

        try {
            if (document.pictureInPictureElement) {
                // Thoát PiP mode
                // @ts-ignore – standard API
                await document.exitPictureInPicture();
            } else {
                // Vào PiP mode
                // @ts-ignore – standard API
                await video.requestPictureInPicture();
            }
        } catch (err) {
            console.error('Picture-in-Picture error', err);
        }
    };

    // Effect đồng bộ state với PiP events
    useEffect(() => {
        const video = videoRef?.current;
        if (!video || !isPiPAvailable) return;

        const handleEnter = () => setIsMiniPlayer(true);
        const handleLeave = () => setIsMiniPlayer(false);

        video.addEventListener('enterpictureinpicture', handleEnter);
        video.addEventListener('leavepictureinpicture', handleLeave);

        return () => {
            video.removeEventListener('enterpictureinpicture', handleEnter);
            video.removeEventListener('leavepictureinpicture', handleLeave);
        };
    }, [videoRef, isPiPAvailable]);

    // Render placeholder nếu không có video URL
    if (!program.programVidUrl) {
        return (
            <div
                ref={containerRef}
                style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16/9',
                    backgroundColor: '#000',
                    borderRadius: isFullscreen ? '0' : '12px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <img
                    src={program.programImgUrl}
                    alt={program.name}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#fff',
                    textAlign: 'center'
                }}>
                    <PlayCircleOutlined style={{ fontSize: '64px', marginBottom: '16px' }} />
                    <p style={{ fontSize: '18px', margin: 0 }}>Video chưa có sẵn</p>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width: '100%',
                backgroundColor: '#000',
                borderRadius: isFullscreen ? '0' : '12px',
                overflow: 'hidden',
                cursor: showControls ? 'default' : 'none'
            }}
        >
            {/* Video Element */}
            <video
                ref={videoRef}
                src={program.programVidUrl}
                poster={program.programImgUrl}
                loop={isLooping}
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    objectFit: 'contain', // Sử dụng contain để hiển thị thanh đen cho video dọc
                    aspectRatio: '16/9'
                }}
                onClick={togglePlay}
                onDoubleClick={toggleFullscreen}
            />

            {/* Loading Overlay - hiển thị khi video đang tải */}
            {!isVideoLoaded && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: '#fff'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <Progress type="circle" percent={50} size={80} strokeColor="#1890ff" />
                        <p style={{ marginTop: '16px', color: '#fff' }}>Đang tải video...</p>
                    </div>
                </div>
            )}

            {/* Custom Controls - thanh điều khiển tùy chỉnh */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                    padding: '24px 16px 16px',
                    transform: showControls ? 'translateY(0)' : 'translateY(100%)',
                    transition: 'transform 0.3s ease',
                    zIndex: 10
                }}
            >
                {/* Progress bar wrapper */}
                <div style={{ position: 'relative' }}>
                    {/* Buffer Progress Background - thanh hiển thị phần video đã buffer */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        right: 0,
                        height: '4px',
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        borderRadius: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        zIndex: 1
                    }}>
                        <div style={{
                            width: `${buffered}%`,
                            height: '100%',
                            backgroundColor: 'rgba(255,255,255,0.5)',
                            borderRadius: '2px'
                        }} />
                    </div>
                    {/* Thanh progress chính */}
                    <Slider
                        value={(currentTime / duration) * 100 || 0}
                        onChange={handleSeek}
                        tooltip={{
                            formatter: (value) => formatTime((value! / 100) * duration)
                        }}
                        trackStyle={{ backgroundColor: '#1890ff', height: '4px' }}
                        railStyle={{ backgroundColor: 'transparent', height: '4px' }}
                        handleStyle={{
                            backgroundColor: '#1890ff',
                            borderColor: '#1890ff',
                            width: '10px',
                            height: '10px',
                        }}
                        style={{ position: 'relative', zIndex: 5, marginTop: '8px' }}
                    />
                </div>

                {/* Control Buttons - các nút điều khiển */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: '#fff'
                }}>
                    {/* Nhóm controls bên trái */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Nút Play/Pause */}
                        <Button
                            type="text"
                            icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                            onClick={togglePlay}
                            style={{ color: '#fff', fontSize: '24px', padding: '4px' }}
                        />

                        {/* Nút Skip Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {/* Backward 10s button */}
                            <Tooltip title="Tua lùi 10 giây">
                                <Button
                                    type="text"
                                    onClick={() => skipTime(-10)}
                                    style={{
                                        color: '#fff',
                                        fontSize: '18px',
                                        padding: '6px',
                                        borderRadius: '6px',
                                        width: '36px',
                                        height: '36px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'rgba(0,0,0,0.4)',
                                        // border: '1px solid rgba(255,255,255,0.2)',
                                        transition: 'all 0.2s',
                                        position: 'relative'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.7)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.4)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                        <path fillRule="evenodd" d="M7.793 2.232a.75.75 0 0 1-.025 1.06L3.622 7.25h10.003a5.375 5.375 0 0 1 0 10.75H10.75a.75.75 0 0 1 0-1.5h2.875a3.875 3.875 0 0 0 0-7.75H3.622l4.146 3.957a.75.75 0 0 1-1.036 1.085l-5.5-5.25a.75.75 0 0 1 0-1.085l5.5-5.25a.75.75 0 0 1 1.06.025Z" clipRule="evenodd" />
                                    </svg>

                                    <span style={{
                                        position: 'absolute',
                                        bottom: '0px',
                                        fontSize: '8px',
                                        fontWeight: '600',
                                        lineHeight: '1'
                                    }}>
                                        10
                                </span>
                            </Button>
                        </Tooltip>

                        {/* Forward 10s button */}
                        <Tooltip title="Tua tới 10 giây">
                            <Button
                                type="text"
                                onClick={() => skipTime(10)}
                                style={{
                                    color: '#fff',
                                    fontSize: '18px',
                                    padding: '6px',
                                    borderRadius: '6px',
                                    width: '36px',
                                    height: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'rgba(0,0,0,0.4)',
                                    // border: '1px solid rgba(255,255,255,0.2)',
                                    transition: 'all 0.2s',
                                    position: 'relative'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.7)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.4)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                    <path fillRule="evenodd" d="M12.207 2.232a.75.75 0 0 0 .025 1.06l4.146 3.958H6.375a5.375 5.375 0 0 0 0 10.75H9.25a.75.75 0 0 0 0-1.5H6.375a3.875 3.875 0 0 1 0-7.75h10.003l-4.146 3.957a.75.75 0 0 0 1.036 1.085l5.5-5.25a.75.75 0 0 0 0-1.085l-5.5-5.25a.75.75 0 0 0-1.06.025Z" clipRule="evenodd" />
                                </svg>

                                <span style={{
                                    position: 'absolute',
                                    bottom: '0px',
                                    fontSize: '8px',
                                    fontWeight: '600',
                                    lineHeight: '1'
                                }}>
                                    10
                                </span>
                            </Button>
                        </Tooltip>
                    </div>

                    {/* Volume Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Button
                            type="text"
                            icon={<SoundOutlined />}
                            onClick={toggleMute}
                            style={{ color: '#fff', fontSize: '18px', padding: '4px' }}
                        />
                        <div style={{ width: '80px' }}>
                            <Slider
                                value={isMuted ? 0 : volume * 100}
                                onChange={handleVolumeChange}
                                tooltip={{
                                    formatter: (value) => `${value}%`
                                }}
                                trackStyle={{ backgroundColor: '#1890ff', height: '3px' }}
                                railStyle={{ backgroundColor: 'rgba(255,255,255,0.3)', height: '3px' }}
                                handleStyle={{
                                    backgroundColor: '#1890ff',
                                    borderColor: '#1890ff',
                                    width: '10px',
                                    height: '10px',
                                    marginTop: '-1px'
                                }}
                            />
                        </div>
                    </div>

                    {/* Time Display */}
                    <span style={{ fontSize: '14px', color: '#fff', whiteSpace: 'nowrap' }}>
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                </div>

                {/* Nhóm controls bên phải */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Playback Speed */}
                    <Tooltip title="Tốc độ phát">
                        <select
                            value={playbackRate}
                            onChange={(e) => changePlaybackRate(Number(e.target.value))}
                            style={{
                                backgroundColor: 'transparent',
                                color: '#fff',
                                border: '1px solid rgba(255,255,255,0.3)',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                fontSize: '14px'
                            }}
                        >
                            <option value={0.5} style={{ color: '#000' }}>0.5x</option>
                            <option value={0.75} style={{ color: '#000' }}>0.75x</option>
                            <option value={1} style={{ color: '#000' }}>1x</option>
                            <option value={1.25} style={{ color: '#000' }}>1.25x</option>
                            <option value={1.5} style={{ color: '#000' }}>1.5x</option>
                            <option value={2} style={{ color: '#000' }}>2x</option>
                        </select>
                    </Tooltip>

                    {/* Loop Button */}
                    <Tooltip title={isLooping ? 'Tắt vòng lặp' : 'Bật vòng lặp'}>
                        <Button
                            type="text"
                            icon={<RetweetOutlined style={{ color: isLooping ? '#1890ff' : undefined }} />}
                            onClick={toggleLoop}
                            style={{ color: '#fff', fontSize: '18px', padding: '4px' }}
                        />
                    </Tooltip>

                    {/* Mini player (PiP) - chỉ hiển thị nếu browser hỗ trợ */}
                    {isPiPAvailable && (
                        <Tooltip title={isMiniPlayer ? 'Thoát màn hình thu nhỏ' : 'Màn hình thu nhỏ'}>
                            <Button
                                type="text"
                                icon={
                                    <svg 
                                        width="16" 
                                        height="16" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        xmlns="http://www.w3.org/2000/svg"
                                        style={{ color: isMiniPlayer ? '#1890ff' : '#fff' }}
                                    >
                                        <rect x="3" y="3" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                                        <rect x="15" y="17" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
                                    </svg>
                                }
                                onClick={toggleMiniPlayer}
                                style={{ color: '#fff', fontSize: '18px', padding: '4px' }}
                            />
                        </Tooltip>
                    )}

                    {/* Settings Button */}
                    <Tooltip title="Cài đặt">
                        <Button
                            type="text"
                            icon={<SettingOutlined />}
                            style={{ color: '#fff', fontSize: '18px', padding: '4px' }}
                        />
                    </Tooltip>

                    {/* Fullscreen Button */}
                    <Tooltip title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}>
                        <Button
                            type="text"
                            icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                            onClick={toggleFullscreen}
                            style={{ color: '#fff', fontSize: '18px', padding: '4px' }}
                        />
                    </Tooltip>
                </div>
            </div>
        </div>

            {/* Click overlay cho play/pause - vùng click trong suốt */ }
    {
        showControls && (
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: '100px',
                    zIndex: 5
                }}
                onClick={togglePlay}
                onDoubleClick={toggleFullscreen}
            />
        )
    }
        </div >
    );
};

export default CourseraVideoPlayer; 