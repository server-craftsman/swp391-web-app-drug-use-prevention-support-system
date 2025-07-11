export interface ResponseSuccess<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface ResponsePaged<T> {
    success: boolean;
    data: T;
    message?: string;
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

