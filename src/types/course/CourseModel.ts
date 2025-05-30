export interface Course {
  id: number;
  name: string;
  userId: number;
  categoryId: number;
  content: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  targetAudience: "STUDENT" | "TEACHER" | "PARENT" | "COMMUNITY";
  videoUrl: string;
  imageUrl: string;
  price: number;
  discount: number;
  createdAt: string;
}
