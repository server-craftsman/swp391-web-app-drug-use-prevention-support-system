import { AppointmentStatus } from "../../app/enums/appointmentStatus.enum";

export interface CreateAppointmentRequest {
  appointmentTime: string;
  note: string;
  name: string;
  phone: string;
  address: string;
}

export interface SearchAppointmentRequest {
  status: AppointmentStatus;
  fromDate: string;
  toDate: string;
  pageNumber: number;
  pageSize: number;
}

export interface ChangeStatusRequest {
  appointmentId: string;
  newStatus: AppointmentStatus;
}

export interface AssignConsultantRequest {
  appointmentId: string;
  consultantUserId: string;
}

export interface CancelAppointmentRequest {
  appointmentId: string;
}
