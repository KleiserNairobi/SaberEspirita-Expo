export interface IBooklet {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  imageUrl?: string;
  pageCount?: number;
  courseId?: string;
  orderIndex?: number;
  isPremium?: boolean;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
