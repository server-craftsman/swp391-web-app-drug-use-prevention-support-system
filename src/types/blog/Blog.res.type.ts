export interface Blog {
  id: string;
  userId: string;
  content: string;
  blogImgUrl: string;
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
  isDeleted: boolean;
}
