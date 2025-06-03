export interface Blog {
  id: number;
  userId: number;
  author: string;
  title: string;
  content: string;
  summary: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  imageUrl: string;
  categoryId: number;
  targetAudience: "STUDENT" | "PARENT" | "COMMUNITY";
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}
