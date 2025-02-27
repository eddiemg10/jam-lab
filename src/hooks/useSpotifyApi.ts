/* Please don't judge me for this code */
/* eslint-disable  @typescript-eslint/no-explicit-any */

import { logout, refreshAccessToken } from "../auth/spotify";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
// Custom hook to wrap Spotify API calls with token refresh logic
// Don't actually know if this works and at this point Idk what the code is doing
// There's a chance that this works though *knock on wood*

export function useSpotifyAPI(
  apiFetchingFunction: (accessToken: string) => Promise<any>,
) {
  const navigate = useNavigate();

  return (async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) throw new Error("No access token found");

    try {
      // Attempt API call with current token
      const result = await apiFetchingFunction(accessToken);
      return result;
    } catch (e) {
      if (e instanceof AxiosError && e.status === 401) {
        try {
          // Refresh token
          const refreshToken = localStorage.getItem("refresh_token");
          if (refreshToken === null) {
            throw new Error("No refresh token found");
          }
          const { access_token, refresh_token } =
            await refreshAccessToken(refreshToken);
          if (!access_token) {
            throw new Error("Token refresh failed");
          }
          localStorage.setItem("access_token", access_token);
          if (refresh_token) {
            localStorage.setItem("refresh_token", refresh_token);
          }

          // Retry with new token
          const result = await apiFetchingFunction(access_token);
          return result;
        } catch (e) {
          if (e instanceof AxiosError && e.status === 401) {
            // We keep ending up here, to investigate
            console.error("Token refresh failed. Redirecting to login.");
            logout(); // Clear tokens
            navigate("/login");
            throw new Error("Token refresh failed. Redirecting to login.");
          } else {
            throw e;
          }
        }
      }
    }
  })();
}
