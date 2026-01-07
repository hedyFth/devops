import { Student } from './student.model';
import { Course } from './course.model';

export interface Enrollment {
  _id?: string;
  student: string | Student;
  course: string | Course;
  status: string;
  enrollmentDate: string;
  createdAt?: string;
  updatedAt?: string;
}

