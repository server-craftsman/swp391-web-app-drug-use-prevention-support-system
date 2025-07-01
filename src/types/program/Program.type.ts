import { ProgramType } from "../../app/enums/programType.enum";

export interface Program {
  success?: boolean;
  message?: string;
  id?: string;
  name?: string;
  description?: string;
  type?: ProgramType;
  programImgUrl?: string;
  location: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}
