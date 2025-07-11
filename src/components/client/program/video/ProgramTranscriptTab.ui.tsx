// import React, { useState, useRef, useEffect } from "react";
// import { Typography, Timeline, Button, Alert, Spin, Switch, Input } from "antd";
// import { FileTextOutlined, AudioOutlined, PlayCircleOutlined, PauseCircleOutlined, SearchOutlined } from "@ant-design/icons";
// import type { Program } from "../../../types/program/Program.type";

// const { Title } = Typography;
// const { Search } = Input;

// interface TranscriptSegment {
//     time: string;
//     text: string;
//     confidence?: number;
//     startTime: number; // seconds
//     endTime: number; // seconds
// }

// interface ProgramTranscriptTabProps {
//     program: Program;
//     videoRef?: React.RefObject<HTMLVideoElement | null>;
// }

// const ProgramTranscriptTab: React.FC<ProgramTranscriptTabProps> = ({ program, videoRef }) => {
//     const [transcriptSegments, setTranscriptSegments] = useState<TranscriptSegment[]>([]);
//     const [currentTranscriptTime, setCurrentTranscriptTime] = useState("00:00");
//     const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
//     const [isListening, setIsListening] = useState(false);
//     const [isAutoTranscribe, setIsAutoTranscribe] = useState(false);
//     const [transcriptionError, setTranscriptionError] = useState<string | null>(null);
//     const [searchTerm, setSearchTerm] = useState("");

//     const recognitionRef = useRef<any>(null);
//     const audioContextRef = useRef<AudioContext | null>(null);

//     // Initialize Speech Recognition
//     useEffect(() => {
//         if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
//             const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
//             recognitionRef.current = new SpeechRecognition();

//             recognitionRef.current.continuous = true;
//             recognitionRef.current.interimResults = true;
//             recognitionRef.current.lang = 'vi-VN'; // Vietnamese language

//             recognitionRef.current.onresult = (event: any) => {
//                 let interimTranscript = '';
//                 let finalTranscript = '';

//                 for (let i = event.resultIndex; i < event.results.length; i++) {
//                     const transcript = event.results[i][0].transcript;
//                     const confidence = event.results[i][0].confidence;

//                     if (event.results[i].isFinal) {
//                         finalTranscript += transcript;

//                         // Get current video time
//                         const currentTime = videoRef?.current?.currentTime || 0;
//                         const timeString = formatTime(currentTime);

//                         // Add new transcript segment
//                         const newSegment: TranscriptSegment = {
//                             time: timeString,
//                             text: transcript.trim(),
//                             confidence: confidence,
//                             startTime: currentTime,
//                             endTime: currentTime + 5 // Estimate 5 second duration
//                         };

//                         setTranscriptSegments(prev => [...prev, newSegment]);
//                     } else {
//                         interimTranscript += transcript;
//                     }
//                 }
//             };

//             recognitionRef.current.onerror = (event: any) => {
//                 setTranscriptionError(`Lỗi nhận diện giọng nói: ${event.error}`);
//                 setIsListening(false);
//             };

//             recognitionRef.current.onend = () => {
//                 setIsListening(false);
//                 if (isAutoTranscribe && videoRef?.current && !videoRef.current.paused) {
//                     // Restart recognition if auto-transcribe is on and video is playing
//                     setTimeout(() => startListening(), 100);
//                 }
//             };
//         } else {
//             setTranscriptionError("Trình duyệt không hỗ trợ nhận diện giọng nói");
//         }

//         return () => {
//             if (recognitionRef.current) {
//                 recognitionRef.current.stop();
//             }
//         };
//     }, [isAutoTranscribe, videoRef]);

//     // Format time in MM:SS format
//     const formatTime = (seconds: number): string => {
//         const mins = Math.floor(seconds / 60);
//         const secs = Math.floor(seconds % 60);
//         return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//     };

//     // Start listening for audio
//     const startListening = () => {
//         if (recognitionRef.current && !isListening) {
//             setTranscriptionError(null);
//             recognitionRef.current.start();
//             setIsListening(true);
//         }
//     };

//     // Stop listening
//     const stopListening = () => {
//         if (recognitionRef.current && isListening) {
//             recognitionRef.current.stop();
//             setIsListening(false);
//         }
//     };

//     // Handle transcript time click - seek video to specific time
//     const handleTranscriptTimeClick = (segment: TranscriptSegment, index: number) => {
//         setCurrentTranscriptTime(segment.time);
//         setCurrentSegmentIndex(index);

//         // Seek video to the timestamp
//         if (videoRef?.current) {
//             videoRef.current.currentTime = segment.startTime;
//         }
//     };

//     // Auto-transcribe toggle
//     const handleAutoTranscribeToggle = (checked: boolean) => {
//         setIsAutoTranscribe(checked);
//         if (checked) {
//             startListening();
//         } else {
//             stopListening();
//         }
//     };

//     // Search in transcript
//     const filteredSegments = transcriptSegments.filter(segment =>
//         segment.text.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     // Generate transcript from video audio automatically
//     const generateTranscriptFromVideo = async () => {
//         if (!program.programVidUrl || !videoRef?.current) return;

//         try {
//             setIsListening(true);

//             // Create audio context to analyze video audio
//             const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
//             audioContextRef.current = audioContext;

//             const video = videoRef.current;
//             const source = audioContext.createMediaElementSource(video);

//             // Connect to destination to continue playing
//             source.connect(audioContext.destination);

//             // Start speech recognition
//             startListening();

//         } catch (error) {
//             setTranscriptionError("Không thể phân tích audio từ video");
//             setIsListening(false);
//         }
//     };

//     return (
//         <div style={{ padding: '24px' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
//                 <Title level={3} style={{ color: '#2d3748', margin: 0 }}>Transcript video</Title>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//                     <div style={{ fontSize: '14px', color: '#718096' }}>
//                         Thời gian hiện tại: <span style={{ fontWeight: 500, color: '#1890ff' }}>{currentTranscriptTime}</span>
//                     </div>
//                 </div>
//             </div>

//             {/* Controls */}
//             <div style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
//                 <Switch
//                     checked={isAutoTranscribe}
//                     onChange={handleAutoTranscribeToggle}
//                     checkedChildren="Tự động"
//                     unCheckedChildren="Thủ công"
//                 />

//                 <Button
//                     type={isListening ? "default" : "primary"}
//                     icon={isListening ? <PauseCircleOutlined /> : <AudioOutlined />}
//                     onClick={isListening ? stopListening : startListening}
//                     loading={isListening}
//                 >
//                     {isListening ? 'Dừng nhận diện' : 'Bắt đầu nhận diện'}
//                 </Button>

//                 {program.programVidUrl && (
//                     <Button
//                         icon={<PlayCircleOutlined />}
//                         onClick={generateTranscriptFromVideo}
//                         disabled={isListening}
//                     >
//                         Transcript từ video
//                     </Button>
//                 )}

//                 <Search
//                     placeholder="Tìm kiếm trong transcript..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     style={{ width: 250 }}
//                     prefix={<SearchOutlined />}
//                 />
//             </div>

//             {/* Error Alert */}
//             {transcriptionError && (
//                 <Alert
//                     message="Lỗi nhận diện giọng nói"
//                     description={transcriptionError}
//                     type="error"
//                     closable
//                     onClose={() => setTranscriptionError(null)}
//                     style={{ marginBottom: '16px' }}
//                 />
//             )}

//             {/* Transcript Content */}
//             {program.programVidUrl ? (
//                 <div style={{ maxHeight: '500px', overflowY: 'auto', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
//                     {(searchTerm ? filteredSegments : transcriptSegments).length > 0 ? (
//                         <Timeline>
//                             {(searchTerm ? filteredSegments : transcriptSegments).map((segment, index) => (
//                                 <Timeline.Item
//                                     key={index}
//                                     color={currentSegmentIndex === index ? '#1890ff' : '#d9d9d9'}
//                                     dot={
//                                         <Button
//                                             type={currentSegmentIndex === index ? 'primary' : 'default'}
//                                             size="small"
//                                             onClick={() => handleTranscriptTimeClick(segment, index)}
//                                             style={{
//                                                 fontSize: '12px',
//                                                 minWidth: '60px',
//                                                 height: '24px'
//                                             }}
//                                         >
//                                             {segment.time}
//                                         </Button>
//                                     }
//                                 >
//                                     <div style={{
//                                         marginLeft: '12px',
//                                         padding: '12px 16px',
//                                         backgroundColor: currentSegmentIndex === index ? '#e6f7ff' : '#ffffff',
//                                         borderRadius: '6px',
//                                         border: currentSegmentIndex === index ? '1px solid #1890ff' : '1px solid #e8e8e8',
//                                         cursor: 'pointer',
//                                         transition: 'all 0.3s ease'
//                                     }}
//                                         onClick={() => handleTranscriptTimeClick(segment, index)}
//                                     >
//                                         <p style={{
//                                             margin: 0,
//                                             color: currentSegmentIndex === index ? '#1890ff' : '#4a5568',
//                                             fontWeight: currentSegmentIndex === index ? 500 : 400
//                                         }}>
//                                             {segment.text}
//                                         </p>
//                                         {segment.confidence && (
//                                             <small style={{ color: '#a0aec0', fontSize: '11px' }}>
//                                                 Độ tin cậy: {Math.round(segment.confidence * 100)}%
//                                             </small>
//                                         )}
//                                     </div>
//                                 </Timeline.Item>
//                             ))}
//                         </Timeline>
//                     ) : isListening ? (
//                         <div style={{ textAlign: 'center', padding: '48px', color: '#718096' }}>
//                             <Spin size="large" />
//                             <p style={{ marginTop: '16px', color: '#718096' }}>
//                                 Đang lắng nghe và nhận diện giọng nói...
//                             </p>
//                         </div>
//                     ) : (
//                         <div style={{ textAlign: 'center', padding: '48px', color: '#a0aec0' }}>
//                             <FileTextOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
//                             <p>Chưa có transcript. Bấm "Bắt đầu nhận diện" để tạo transcript tự động.</p>
//                         </div>
//                     )}
//                 </div>
//             ) : (
//                 <div style={{ textAlign: 'center', padding: '48px 24px', color: '#a0aec0' }}>
//                     <FileTextOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
//                     <Title level={4} style={{ color: '#718096', marginBottom: '8px' }}>
//                         Chưa có video
//                     </Title>
//                     <p style={{ color: '#a0aec0', margin: 0 }}>
//                         Transcript sẽ có sẵn khi video được upload.
//                     </p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ProgramTranscriptTab; 