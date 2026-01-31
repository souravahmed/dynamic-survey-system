import { FieldType } from "@/enums/fieldType";
import { UserRole } from "@/enums/userRole";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  accessToken: string;
  refreshToken: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export interface SurveyPayload {
  title: string;
  description?: string;
  fields: SurveyFieldPayload[];
}

export interface SurveyFieldPayload {
  label: string;
  fieldType: FieldType;
  isRequired: boolean;
  options?: string[];
}

export interface Survey {
  id: string;
  title: string;
  description?: string;
  isActive: boolean;
  createdById: string;
  createdBy?: User;
  createdAt: string;
  updatedAt: string;
  fields: SurveyField[];
}

export interface SurveyField {
  id?: string;
  label: string;
  fieldType: FieldType;
  isRequired: boolean;
  options?: string[];
  order: number;
}

export interface Stats {
  activeSurveys: number;
  totalOfficers: number;
  totalSurveySubmissionToday: number;
}
