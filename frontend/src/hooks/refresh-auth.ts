import { AuthAPI } from "../apis/AuthAPI";
import { getAccessToken, getRefreshToken } from "../context/AuthContext";
import { CommonConstant } from "../types/constant";

export const refreshAuth = async (failedRequest: any) => {
  const currentAccessTokens = getAccessToken();
  const currentRefreshTokens = getRefreshToken();

  if (!currentAccessTokens || !currentRefreshTokens) {
    // TODO: notify when no token available
    return;
  }

  const newToken = await AuthAPI._refreshToken({
    accessToken: currentAccessTokens,
    refreshToken: currentRefreshTokens,
  });

  if (newToken) {
    failedRequest.response.config.headers.Authorization = "Bearer " + newToken;
    localStorage.setItem(CommonConstant.USER_ACCESS_TOKEN, newToken);
    return Promise.resolve(newToken);
  } else {
    // console.log("clear tokens refresh-auth");
    localStorage.clear();
    location.reload();

    return Promise.reject();
  }
};
