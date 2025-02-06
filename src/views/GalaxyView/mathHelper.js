const COMPLETEDCIRCLE = Math.PI * 2;
const SLIDERTOTAL = 100;
const MAXVOLUME = 100;
const MAXORBIT = 300;

function getRadianBasedOnTime(currentSongTime, totalSongTime) {
    return (currentSongTime / totalSongTime) * COMPLETEDCIRCLE;
}

function getRadianBasedonSlider(sliderTime) {
    return (sliderTime / SLIDERTOTAL) * COMPLETEDCIRCLE;
}

function getPlayBackSliderTime(currentSongTime, totalSongTime) {
    return SLIDERTOTAL * (currentSongTime / totalSongTime);
}

function getSongTime(sliderTime, totalSongTime) {
    return totalSongTime * (sliderTime / SLIDERTOTAL);
}

function getOrbitSize(volume) {
    return MAXORBIT * (volume / MAXVOLUME);
}


export {
    getRadianBasedOnTime,
    getPlayBackSliderTime,
    getSongTime,
    getRadianBasedonSlider,
    getOrbitSize
}
