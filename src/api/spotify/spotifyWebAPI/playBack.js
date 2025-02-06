async function getAllPlayers(accessToken) {

  const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  });

  const data = await response.json();
  return data;
}

async function setPlayBackPlayers(accessToken, players) {
//device_ids: []
  const response = await fetch('https://api.spotify.com/v1/me/player', {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + accessToken
    },
    body: JSON.stringify({device_ids: players})
  });

  const data = await response.json();
  return data;
}
async function skipNextSong(accessToken) {
//device_ids: []
  const response = await fetch('https://api.spotify.com/v1/me/player/next', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + accessToken
    },
  });

  const data = await response.json();
  return data;
}

async function setPlayBackVolume(accessToken, volume) {
//device_ids: []
  const response = await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`, {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + accessToken
    },
  });

  const data = await response.json();
  return data;
}

async function play(accessToken) {
  const response = await fetch('https://api.spotify.com/v1/me/player/play', {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + accessToken
    },
  });

  const data = await response.json();
  return data;
}

async function pause(accessToken) {
  const response = await fetch('https://api.spotify.com/v1/me/player/pause', {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + accessToken
    },
  });
  const data = await response.json();
  console.log('data: ', data);
  return data;
}

export {
  getAllPlayers,
  setPlayBackPlayers,
  skipNextSong,
  setPlayBackVolume,
  play,
  pause,
}