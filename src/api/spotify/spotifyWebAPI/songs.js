async function getProfile(accessToken) {

  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  });

  const data = await response.json();
  return data;
}

async function getLikedMusic(accessToken) {

  const response = await fetch('https://api.spotify.com/v1/me/tracks', {
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  });

  const data = await response.json();
  return data;
}

async function searchTracks(accessToken, searchString) {

  const response = await fetch(`https://api.spotify.com/v1/search?q=${searchString}&type=track`, {
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  });

  const data = await response.json();
  return data;
}

async function playTrack(accessToken, tracks) {
  const response = await fetch('https://api.spotify.com/v1/me/player/play', {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + accessToken
    },
    body: JSON.stringify({uris: tracks})
  });

  const data = await response.json();
  return data;
}

export {
  getProfile,
  getLikedMusic,
  searchTracks,
  playTrack,
}
