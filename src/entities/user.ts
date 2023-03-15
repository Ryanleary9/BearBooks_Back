import { Manga } from './manga';

export type Role = 'admin' | 'user';

export type User = {
  id: string;
  email: string;
  passwd: string;
  name: string;
  surname: string;
  pfp: string;
  role: Role;
  kart: Manga[];
};
