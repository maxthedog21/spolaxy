import { getToken } from "@/api/spotify/config/config.js";



async function getAccessToken(clientId, redirectUri, code, refreshToken){
  let codeVerifier = localStorage.getItem('code_verifier');
  let token = await getToken(codeVerifier, clientId, redirectUri, code, refreshToken);
  return token;
}

export {
  getAccessToken,
}
