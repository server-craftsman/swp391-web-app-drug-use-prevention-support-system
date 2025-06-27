export interface ConsultantRequest {
  PageNumber: number;
  PageSize: number;
  FilterByName?: string;
}
export interface CreateConsultantRequest {
  name: string;
  email: string;
  phone: string;
  imageUrl: string;
  description: string;
  createdAt: string;
  updatedAt: string;
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
