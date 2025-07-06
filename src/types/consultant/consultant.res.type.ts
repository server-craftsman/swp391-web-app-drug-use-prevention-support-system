export interface Consultant {
  id: string;
  userId: string;
  fullName: string;
  qualifications: string[];
  jobTitle: string;
  hireDate: string;
  salary: number;
  status: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  profilePicUrl: string;
  phoneNumber: string;
}

export type ConsultantPageInfo = {
  pageNum: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export interface ConsultantListResponse {
  pageData: Consultant[];
  pageInfo: ConsultantPageInfo;
}

export interface ConsultantDetailResponse {
  consultant: Consultant;
}
