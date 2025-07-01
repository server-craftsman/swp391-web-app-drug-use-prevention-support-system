export interface ProgramRequest {
  pageNumber: number;
  pageSize: number;
  filterByName?: string; // optional
}

export interface CreateProgramRequest {
  name: string;
  description: string;
  location: string;
  type: string;
  startDate: string;
  endDate: string;
  programImgUrl: string;
}

