import { User } from './user.model';

export interface Teacher {
  _id?: string;
  user: string | User;
  firstName: string;
  lastName: string;
  teacherCode: string;
  specialty: string;
  createdAt?: string;
  updatedAt?: string;
}

