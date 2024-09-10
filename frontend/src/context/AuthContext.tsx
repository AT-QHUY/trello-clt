import { createContext, useContext, useEffect } from "react";
import * as jwt from "../utils/jwt";
import { useNavigate } from "react-router-dom";
import http from "../utils/http";
import { AuthTokens } from "../models/Auth";
import { CommonConstant } from "../types/constant";
import { useStorageState } from "../hooks/useStorageState";

const AuthContext = createContext<{
  signIn: (params: AuthTokens) => void;
  signOut: () => void;
  isLoading: boolean;
} | null>(null);

export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}
export const getAccessToken = (): string | null => {
  const ACCESS_TOKEN = localStorage.getItem(CommonConstant.USER_ACCESS_TOKEN);
  return ACCESS_TOKEN;
};

export const getRefreshToken = (): string | null => {
  const REFRESH_TOKEN = localStorage.getItem(CommonConstant.USER_REFRESH_TOKEN);
  return REFRESH_TOKEN;
};

export function getUserId(): string | null {
  const accessToken: string | null = getAccessToken();

  if (accessToken) {
    const id: string = jwt.getIdFromToken(accessToken);
    return id;
  }

  return null;
}

export function getPayloadFromToken(): jwt.UserDetail | null {
  const accessToken: string | null = getAccessToken();

  if (accessToken) {
    const payload = jwt.getPayloadFromToken(accessToken);
    return payload;
  }

  return null;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isAccessTokenLoading], setAccessToken] = useStorageState(
    CommonConstant.USER_ACCESS_TOKEN
  );

  const [[isRefreshTokenLoading], setRefreshToken] = useStorageState(
    CommonConstant.USER_REFRESH_TOKEN
  );

  const navigate = useNavigate();

  useEffect(() => {
    http.interceptors.response.use(
      (res) => {
        return res;
      },
      (err) => {
        // notifications.show({
        //   title: err?.response?.status,
        //   message: err?.response?.data?.message,
        //   color: "red",
        // });

        if (err?.response?.status == 401) {
          if (err?.response?.headers.auto != "True") {
            localStorage.clear();
            navigate("/");
          }
        }
        throw err;
      }
    );
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn: async ({ accessToken, refreshToken }: AuthTokens) => {
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);
          navigate(0);
        },
        signOut: () => {
          localStorage.clear();
          navigate("/login");
        },
        isLoading: isAccessTokenLoading || isRefreshTokenLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
