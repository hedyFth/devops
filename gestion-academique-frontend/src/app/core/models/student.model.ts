import { Groupe } from './groupe.model';
import { User } from './user.model';

export interface Student {
  _id?: string;
  user: string | User;
  firstName: string;
  lastName: string;
  studentNumber: string;
  groupe: string | Groupe;
  createdAt?: string;
  updatedAt?: string;
}

