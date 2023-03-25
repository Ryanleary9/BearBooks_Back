export type Role = 'admin' | 'user';

export type ProtoUser = {
  email: string;
  passwd: string;
  name: string;
  surname: string;
  pfp: string;
  role: Role;
  kart: string[];
};
export type User = {
  id: string;
  email: string;
  passwd: string;
  name: string;
  surname: string;
  pfp: string;
  role: Role;
  kart: string[];
};
