export interface ConsultantRequest {
  PageNumber: number;
  PageSize: number;
  FilterByName?: string;
}
export interface CreateConsultantRequest {
  userId: string;
  qualifications: string[];
  jobTitle: string;
  hireDate: string;
  salary: number;
  status: string;
}

export interface UpdateConsultantRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  imageUrl: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
export interface DeleteConsultantRequest {
  id: string;
}

export interface ConsultantDetailRequest {
  id: string;
}
