import { Teacher } from './teacher.model';

export interface Course {
  _id?: string;
  title: string;
  description: string;
  credits: number;
  teacher: string | Teacher;
  createdAt?: string;
  updatedAt?: string;
}

