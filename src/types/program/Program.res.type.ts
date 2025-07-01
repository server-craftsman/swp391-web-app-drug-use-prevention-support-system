export type { Program } from "./Program.type";
import type { ResponseSuccess } from "../../app/interface";
import type { Program } from "./Program.type";

export interface PaginatedProgramResponse extends ResponseSuccess<Program[]> {
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}
