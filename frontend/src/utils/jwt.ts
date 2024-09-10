import { jwtDecode } from "jwt-decode";

export type UserDetail = {
  sub: string;
  jti: string;
  iat: number;
  exp: number;
};

export const getPayloadFromToken = (token: string): UserDetail => {
  const user_detail: UserDetail = jwtDecode(token);
  return user_detail;
};

export const getIdFromToken = (token: string): string => {
  const id: string = getPayloadFromToken(token).jti;
  return id;
};

export const getSubFromToken = (token: string): string => {
  const sub: string = getPayloadFromToken(token).sub;
  return sub;
};
