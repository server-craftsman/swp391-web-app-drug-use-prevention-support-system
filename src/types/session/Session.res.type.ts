export interface Session {
  id: string;
  courseId: string;
  name: string;
  userId: string;
  slug: string;
  content: string;
  positionOrder: string;
}
export interface SessionPageInfo {
  pageNum: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface SessionListResponse {
  pageData: Session[];
  pageInfo: SessionPageInfo;
}
