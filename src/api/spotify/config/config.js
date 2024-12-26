async function getToken(codeVerifier, clientId, redirectUri, code){
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  }
  const body = await fetch("https://accounts.spotify.com/api/token", payload);
  const response =await body.json();
  return response.access_token;
}

export {
  getToken,
}
