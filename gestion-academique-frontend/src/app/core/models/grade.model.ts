import { Student } from './student.model';
import { Assessment } from './assessment.model';

export interface Grade {
  _id?: string;
  student: string | Student;
  assessment: string | Assessment;
  value: number;
  attributionDate: string;
  createdAt?: string;
  updatedAt?: string;
}

