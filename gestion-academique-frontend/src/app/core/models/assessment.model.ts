import { Course } from './course.model';

export interface Assessment {
  _id?: string;
  course: string | Course;
  title: string;
  type: string;
  date: string;
  weight: number;
  createdAt?: string;
  updatedAt?: string;
}

