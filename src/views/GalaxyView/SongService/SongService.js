import { playTrack, searchTracks } from "@/api/spotify/spotifyWebAPI/songs";
const catUrl = "https://www.argospetinsurance.co.uk/assets/uploads/2017/12/cat-pet-animal-domestic-104827.jpeg";
async function getSearchResults(accessToken, search) {
    let resp = await searchTracks(accessToken, search);
    resp = resp.tracks.items.map((track) => {
        return {
            name: track.name,
            uri: track.uri,
            img: track.album.images.length > 0 ? getAlbum(track) : catUrl,
            totalDuration: track.duration_ms,
        }
    })
    return resp;
}




function getAlbum(track) {
    return track.album.images.reduce((acc, cur) => {
        return acc.height < cur.height ? acc : cur;
    }).url;
}

async function setTrack(accessToken, track) {
    let resp = await playTrack(accessToken, [track]);
}

export {
    getSearchResults,
    setTrack,
}