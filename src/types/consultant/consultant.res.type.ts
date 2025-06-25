export interface Consultant {
  id: number;
  name: string;
  email: string;
  phone: string;
  imageUrl: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type ConsultantListResponse = Consultant[];

export interface ConsultantDetailResponse {
  consultant: Consultant;
}
