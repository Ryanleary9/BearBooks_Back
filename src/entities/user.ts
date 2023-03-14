import { Manga } from './manga';

export type LoginData = {
  email: string;
  passwd: string;
};

export type RegisterData = LoginData & {
  name: string;
  surname: string;
  pfp: string;
};

export type ProtoUser = RegisterData & {
  kart: Manga[];
};

export type User = { id: string } & ProtoUser;

export type LoginPassed = {
  token: string;
  user: User;
};
