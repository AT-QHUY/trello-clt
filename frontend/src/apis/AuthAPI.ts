import http from "../utils/http";
export type CreateNewUserParams = {
  email: string;
  password: string;
  username: string;
};

export type LoginParams = {
  email: string;
  password: string;
};

export type RegisterParams = {
  username: string;
  email: string;
  password: string;
};

export type RefreshTokenParams = {
  accessToken: string;
  refreshToken: string;
};

export const AuthAPI = {
  _createNewUser: async (params: CreateNewUserParams) => {
    const res = await http.post(`/api/users`, params);
    return res?.data;
  },

  _login: async (params: LoginParams) => {
    const res = await http.post(`/api/auths/login`, params);
    return res?.data;
  },
  _refreshToken: async (params: RefreshTokenParams) => {
    const res = await http.post(`/api/auths/refresh`, params);
    return res?.data;
  },
  _register: async (params: RegisterParams) => {
    const res = await http.post(`/api/auths/register`, params);
    return res?.data;
  },
};
