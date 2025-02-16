import axios from "axios";
import querystring from "querystring";
import pkceChallenge from "pkce-challenge";
import { z } from "zod";

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

const generateCodeVerifierChallengePair = async (): Promise<
  Record<string, string>
> => {
  const { code_verifier, code_challenge } = await pkceChallenge();
  return { code_verifier, code_challenge };
};

const getAuthorizationUrl = (codeChallenge: string): string => {
  const params = {
    client_id: SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: SPOTIFY_REDIRECT_URI,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  };

  return `https://accounts.spotify.com/authorize?${querystring.stringify(params)}`;
};

const AccessToken = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  refresh_token: z.string(),
  scope: z.string(),
});
type AccessToken = z.infer<typeof AccessToken>;

const getAccessToken = async (
  code: string,
  codeVerifier: string,
): Promise<AccessToken> => {
  const params = {
    client_id: SPOTIFY_CLIENT_ID,
    grant_type: "authorization_code",
    code,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    code_verifier: codeVerifier,
  };

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    querystring.stringify(params),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  return response.data;
};

// This request seems to be returning a 500 error with the following message:
// {error: "server_error", error_description: "Failed to remove token"}
// TODO: Investigate
const refreshAccessToken = async (
  refreshToken: string,
): Promise<AccessToken> => {
  const params = {
    client_id: SPOTIFY_CLIENT_ID,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  };

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    querystring.stringify(params),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  return response.data;
};

const logout = () => {
  // This is not a real logout, but it clears the tokens from local storage
  // which will force the user to log in again
  // Good enough for what we need
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export {
  generateCodeVerifierChallengePair,
  getAuthorizationUrl,
  getAccessToken,
  refreshAccessToken,
  logout,
};
