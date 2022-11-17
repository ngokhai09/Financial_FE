import {User} from "./user";

export interface Category {
  id: number;
  name: string;
  status: string;
  description: string;
  color: string;
  user: User;
}
