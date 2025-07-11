// interface TranscriptSegment {
//     id?: string;
//     programId: string;
//     time: string;
//     text: string;
//     confidence?: number;
//     startTime: number;
//     endTime: number;
//     createdAt?: Date;
// }

// interface SpeechRecognitionConfig {
//     language: string;
//     continuous: boolean;
//     interimResults: boolean;
//     maxAlternatives: number;
// }

// export class TranscriptService {
//     private static baseUrl = '/api/transcripts';

//     // Save transcript segments to backend
//     static async saveTranscriptSegments(programId: string, segments: TranscriptSegment[]) {
//         try {
//             const response = await fetch(`${this.baseUrl}/${programId}`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ segments }),
//             });
//             return await response.json();
//         } catch (error) {
//             console.error('Error saving transcript:', error);
//             throw error;
//         }
//     }

//     // Get transcript segments for a program
//     static async getTranscriptSegments(programId: string): Promise<TranscriptSegment[]> {
//         try {
//             const response = await fetch(`${this.baseUrl}/${programId}`);
//             const data = await response.json();
//             return data.segments || [];
//         } catch (error) {
//             console.error('Error fetching transcript:', error);
//             return [];
//         }
//     }

//     // Delete transcript segments
//     static async deleteTranscriptSegments(programId: string) {
//         try {
//             const response = await fetch(`${this.baseUrl}/${programId}`, {
//                 method: 'DELETE',
//             });
//             return await response.json();
//         } catch (error) {
//             console.error('Error deleting transcript:', error);
//             throw error;
//         }
//     }

//     // Initialize Speech Recognition API
//     static initializeSpeechRecognition(config: SpeechRecognitionConfig = {
//         language: 'vi-VN',
//         continuous: true,
//         interimResults: true,
//         maxAlternatives: 1
//     }) {
//         if (typeof window === 'undefined') {
//             return null;
//         }

//         const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

//         if (!SpeechRecognition) {
//             throw new Error('Speech Recognition API is not supported in this browser');
//         }

//         const recognition = new SpeechRecognition();
//         recognition.lang = config.language;
//         recognition.continuous = config.continuous;
//         recognition.interimResults = config.interimResults;
//         recognition.maxAlternatives = config.maxAlternatives;

//         return recognition;
//     }

//     // Convert time to formatted string
//     static formatTime(seconds: number): string {
//         const hours = Math.floor(seconds / 3600);
//         const mins = Math.floor((seconds % 3600) / 60);
//         const secs = Math.floor(seconds % 60);

//         if (hours > 0) {
//             return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//         }
//         return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//     }

//     // Parse time string to seconds
//     static parseTimeToSeconds(timeString: string): number {
//         const parts = timeString.split(':').map(Number);
//         if (parts.length === 2) {
//             return parts[0] * 60 + parts[1];
//         } else if (parts.length === 3) {
//             return parts[0] * 3600 + parts[1] * 60 + parts[2];
//         }
//         return 0;
//     }

//     // Search transcript segments
//     static searchTranscript(segments: TranscriptSegment[], searchTerm: string): TranscriptSegment[] {
//         if (!searchTerm.trim()) {
//             return segments;
//         }

//         const term = searchTerm.toLowerCase();
//         return segments.filter(segment =>
//             segment.text.toLowerCase().includes(term)
//         );
//     }

//     // Extract audio from video for processing
//     static async extractAudioFromVideo(videoElement: HTMLVideoElement): Promise<AudioContext | null> {
//         try {
//             const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
//             const source = audioContext.createMediaElementSource(videoElement);

//             // Connect to destination to continue playing
//             source.connect(audioContext.destination);

//             return audioContext;
//         } catch (error) {
//             console.error('Error extracting audio from video:', error);
//             return null;
//         }
//     }

//     // Export transcript to different formats
//     static exportTranscript(segments: TranscriptSegment[], format: 'txt' | 'srt' | 'vtt' = 'txt'): string {
//         switch (format) {
//             case 'srt':
//                 return this.exportToSRT(segments);
//             case 'vtt':
//                 return this.exportToVTT(segments);
//             default:
//                 return this.exportToTXT(segments);
//         }
//     }

//     private static exportToTXT(segments: TranscriptSegment[]): string {
//         return segments.map(segment =>
//             `[${segment.time}] ${segment.text}`
//         ).join('\n');
//     }

//     private static exportToSRT(segments: TranscriptSegment[]): string {
//         return segments.map((segment, index) => {
//             const startTime = this.secondsToSRTTime(segment.startTime);
//             const endTime = this.secondsToSRTTime(segment.endTime);
//             return `${index + 1}\n${startTime} --> ${endTime}\n${segment.text}\n`;
//         }).join('\n');
//     }

//     private static exportToVTT(segments: TranscriptSegment[]): string {
//         const header = 'WEBVTT\n\n';
//         const content = segments.map(segment => {
//             const startTime = this.secondsToVTTTime(segment.startTime);
//             const endTime = this.secondsToVTTTime(segment.endTime);
//             return `${startTime} --> ${endTime}\n${segment.text}\n`;
//         }).join('\n');
//         return header + content;
//     }

//     private static secondsToSRTTime(seconds: number): string {
//         const hours = Math.floor(seconds / 3600);
//         const mins = Math.floor((seconds % 3600) / 60);
//         const secs = Math.floor(seconds % 60);
//         const ms = Math.floor((seconds % 1) * 1000);
//         return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
//     }

//     private static secondsToVTTTime(seconds: number): string {
//         const hours = Math.floor(seconds / 3600);
//         const mins = Math.floor((seconds % 3600) / 60);
//         const secs = Math.floor(seconds % 60);
//         const ms = Math.floor((seconds % 1) * 1000);
//         return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
//     }
// }

// export type { TranscriptSegment, SpeechRecognitionConfig }; 