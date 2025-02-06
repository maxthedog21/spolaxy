//https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow

function generateRandomString(length){
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}


function sha256(plain){
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return window.crypto.subtle.digest('SHA-256', data);
}

function base64encode(input){
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}


async function getAuthorization(clientId, redirectUri){
  const scope = 'user-read-private user-read-email streaming user-read-playback-state user-modify-playback-state';
  const authUrl = new URL("https://accounts.spotify.com/authorize")
  let codeVerifier = generateRandomString(64);
  let hashed = await sha256(codeVerifier);
  let codeChallenge = base64encode(hashed);

    window.localStorage.setItem('code_verifier', codeVerifier);

  const params =  {
    response_type: 'code',
    client_id: clientId,
    scope,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  }

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();
}

export  {
  getAuthorization,
}
