import { getToken } from "@/api/spotify/config/config.js";



async function getAccessToken(clientId, redirectUri, code){
  let codeVerifier = localStorage.getItem('code_verifier');
  let token = await getToken(codeVerifier, clientId, redirectUri, code);
  return token;
}

export {
  getAccessToken,
}
