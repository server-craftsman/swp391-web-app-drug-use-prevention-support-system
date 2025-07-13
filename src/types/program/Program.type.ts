import { ProgramType } from "../../app/enums/programType.enum";
import { RiskLevel } from "../../app/enums/riskLevel.enum";

export interface Program {
  success?: boolean;
  message?: string;
  id?: string;
  name?: string;
  description?: string;
  type?: ProgramType;
  programImgUrl?: string;
  programVidUrl?: string;
  location: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  riskLevel: RiskLevel;
}

export interface ProgramEnrollment {
  programId?: string; // Program Id from server
  id?: string; // Fallback, sometimes API may return id
  name?: string;
  description?: string;
  type?: ProgramType;
  programImgUrl?: string;
  programVidUrl?: string;
  location: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  riskLevel: RiskLevel;
  joinDate?: string; // Date when user joined the program
}
