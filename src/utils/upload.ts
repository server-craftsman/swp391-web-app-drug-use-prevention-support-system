import {
    S3Client, PutObjectCommand, DeleteObjectCommand,
    type PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { notificationMessage } from './helper';

// Configure AWS S3
const getS3Client = () => {
    return new S3Client({
        region: import.meta.env.VITE_AWS_REGION,
        credentials: {
            accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
            secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
        }
    });
};

/**
 * Convert File to Uint8Array
 * @param file File to convert
 * @returns Promise with Uint8Array data
 */
const fileToUint8Array = (file: File): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result instanceof ArrayBuffer) {
                resolve(new Uint8Array(reader.result));
            } else {
                reject(new Error('Failed to read file'));
            }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
    });
};

/**
 * Upload file to AWS S3
 * @param file File to upload
 * @param folder Folder path in S3 bucket (optional)
 * @returns Promise with the uploaded file URL
 */
export const uploadFileToS3 = async (file: File, folder: string = 'profile-pictures'): Promise<string> => {
    try {
        const s3Client = getS3Client();
        const fileExtension = file.name.split('.').pop();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;

        // Use FileReader instead of arrayBuffer
        const fileData = await fileToUint8Array(file);

        const params: PutObjectCommandInput = {
            Bucket: import.meta.env.VITE_S3_BUCKET_NAME as string,
            Key: fileName,
            Body: fileData,
            ContentType: file.type,
            ACL: "public-read"
        };

        await s3Client.send(new PutObjectCommand(params));

        // Construct the URL
        const bucketRegion = import.meta.env.VITE_AWS_REGION;
        const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
        const fileUrl = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${fileName}`;

        return fileUrl;
    } catch (error) {
        console.error('Error uploading file to S3:', error);
        notificationMessage('Failed to upload file. Please try again.', 'error');
        throw error;
    }
};

/**
 * Delete file from AWS S3
 * @param fileUrl Full URL of the file to delete
 * @returns Promise with deletion status
 */
export const deleteFileFromS3 = async (fileUrl: string): Promise<boolean> => {
    try {
        const s3Client = getS3Client();
        // Extract key from URL
        const urlParts = fileUrl.split('/');
        const key = urlParts.slice(3).join('/');

        const params = {
            Bucket: import.meta.env.VITE_S3_BUCKET_NAME as string,
            Key: key
        };

        await s3Client.send(new DeleteObjectCommand(params));
        return true;
    } catch (error) {
        console.error('Error deleting file from S3:', error);
        notificationMessage('Failed to delete file. Please try again.', 'error');
        return false;
    }
};
