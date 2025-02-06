async function getToken(codeVerifier, clientId, redirectUri, code, refreshToken){
  if(refreshToken){
    return await getRefreshToken(clientId, refreshToken);
  }
  return await getAccessToken(codeVerifier, clientId, redirectUri, code);
}

async function getAccessToken(codeVerifier, clientId, redirectUri, code){
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
    if(response.error && response.error === 'invalid_grant'){
      return 'REDO';
    }
    localStorage.setItem('refreshToken', response.refresh_token);
    return response.access_token;

}

  async function getRefreshToken(clientId, refreshToken){

   // refresh token that has been previously stored
   const url = "https://accounts.spotify.com/api/token";

    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId
      }),
    }
    const body = await fetch(url, payload);
    const response = await body.json();
    if(response.error){
      localStorage.removeItem('refreshToken');
      return 'REDO';
    }


    if (response.refresh_token) {
      localStorage.setItem('refreshToken', response.refresh_token);
    }

    return response.access_token;
  }


export {
  getToken,
}
