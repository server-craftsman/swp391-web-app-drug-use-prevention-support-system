export interface CourseRequest {
  PageNumber: number;
  PageSize: number;
  FilterByName?: string;
}
export interface CreateCourseRequest {
  name: string;
  categoryId: string;
  content: string;
  status: "draft" | "published" | "archived";
  targetAudience: string;
  videoUrls: string[];
  imageUrls: string[];
  price: number;
  discount: number;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export interface UpdateCourseRequest {
  id: string;
  name: string;
  categoryId: string;
  content: string;
  status: "draft" | "published" | "archived";
  targetAudience: string;
  videoUrls: string[];
  imageUrls: string[];
  price: number;
  discount: number;
  updatedAt: string;
  slug: string;
  userId: string;
}
export interface DeleteCourseRequest {
  id: string;
}

export interface CourseDetailRequest {
  id: string;
}
