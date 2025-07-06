export interface Appointment {
  id: string;
  appointmentTime: string; // ISO string
  status: string;
  note: string;
  name: string;
  consultant: Consultant | null;
}

export interface Consultant {
  id?: string;
  name?: string;
}
