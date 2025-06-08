export interface ResponseSuccess<T> {
    success: boolean;
    data: T;
    message?: string;
}
