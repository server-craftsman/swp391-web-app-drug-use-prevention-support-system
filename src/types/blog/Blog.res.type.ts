export interface Blog {
  id: string;
  userId: string;
  content: string;
  blogImgUrl: string;
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
  isDeleted: boolean;
  fullName: string;
  userAvatar: string;
}

export interface BlogPageInfo {
  pageNum: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface BlogListResponse {
  pageData: Blog[];
  pageInfo: BlogPageInfo;
}
