// rewrite and split code by spotify functions

<template>
    <canvas width="max" height="max" id="canvas"></canvas>
    <v-row class="flex-1-1-100">
        <v-col cols="2"></v-col>
        <v-col cols="8">
            <div>
                <v-autocomplete clearable no-filter v-model="selectedSong" item-color="transparent" class="pt-5"
                    :items="trackList" item-title="name" item-value="" variant="outlined"
                    @update:search="updateSearch" @update:model-value="updateTrackPlayed" return-object>
                </v-autocomplete>
            </div>
            <v-row style="margin-top: 60%">
                <v-col align="center" cols="2">
                    <v-btn @click="skipPrev" color="transparent" icon class="pb-5">
                        <v-icon>mdi-skip-previous</v-icon>
                    </v-btn>
                </v-col>
                <v-col align="center" cols="8">
                    <v-slider v-model="playBack" @update:model-value="slideChange" @end="slideEndEvent">
                    </v-slider>
                <PausePlay 
                :isPaused="isPaused"
                @play="playClicked"
                @pause="pauseClicked"
                ></PausePlay>
                </v-col>
                <v-col align="center" cols="2">
                    <v-btn @click="skipNext" color="transparent" icon class="pb-5">
                        <v-icon>mdi-skip-next</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-col>
        <v-col cols="2" class="d-flex justify-center align-center">
            <v-slider v-model="volumeSlider" @update:model-value="volumeChange" @end="volumeSetEvent"
                direction="vertical"></v-slider>
        </v-col>
    </v-row>
    <v-snackbar v-model="snackbar">
        Feature coming soon
        <v-btn color="red" variant="text" @click="snackbar = false">
            Close
        </v-btn>
    </v-snackbar>

</template>
<script type="text/javascript">
import { getAllPlayers, pause, play, setPlayBackPlayers, setPlayBackVolume, skipNextSong } from '@/api/spotify/spotifyWebAPI/playBack';
import { getSearchResults, setTrack } from './SongService/SongService';
import { getOrbitSize, getPlayBackSliderTime, getRadianBasedonSlider, getRadianBasedOnTime, getSongTime } from './mathHelper';
import PausePlay from './components/PausePlay.vue';
import starMixin from '@/mixins/starMixin';
import sunUrl from '/Sun_Pixel.png';

const PLAYER_NAME = "Spolaxy-Player";
export default {
    name: "GalaxyView",
    mixins: [starMixin],
    components: {
        PausePlay,
    },
    data() {
        return {
            isPaused: true,
            volumeSlider: 50,
            snackbar: false,
            isSliderSliding: false,
            totalSongTime: 0,
            playBack: 0,
            sunUrl: sunUrl,
            canvas: null,
            ctx: null,
            iterations: 0,
            player: null,
            trackList: [],
            searchValue: "",
            selectedSong: null,
            planet: {
                x: 0,
                y: 0,
                size: 50,
                currentAngle: 0,
                orbitSize: 200,
                rotation: 0,
                img: null,
            },
        };
    },
    mounted() {
        window.onSpotifyWebPlaybackSDKReady = () => {
            this.player = new Spotify.Player({
                name: PLAYER_NAME,
                getOAuthToken: cb => { cb(this.accessToken) },
                volume: 0.5,
            });
            this.player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                this.setupWebPlayer();
                this.setupPage();
            });
            this.player.connect();
        }

    },
    unmounted() {
        window.removeEventListener("resize", this.updateCanvasSize);
    },
    props: {
        accessToken: {
            required: true,
        },
    },
    computed: {
        centerX() {
            return this.canvas.width / 2;
        },
        centerY() {
            return this.canvas.height / 2;
        },
        correctTrackList() {
            return this.trackList;
        },
    },
    methods: {
       async playClicked(){
            play(this.accessToken);
        },
       async pauseClicked(){
            pause(this.accessToken);
        },
        volumeChange(newVolume) {
            this.planet.orbitSize = getOrbitSize(newVolume);
        },
        volumeSetEvent(newVolume) {
            this.setVolume(newVolume);
        },
        async setVolume(volume) {
            let roundedVolume = Math.round(volume);
            setPlayBackVolume(this.accessToken, roundedVolume);
        },
        skipNext() {
            // skipNextSong(this.accessToken);
            /*  this.player.nextTrack().then(() => {
                  console.log('Skipped to next track!');
      }); */
            this.logState();
            this.snackbar = true;
        },
        skipPrev() {

            this.snackbar = true;
        },
        slideEndEvent(newSlideTime) {
            this.player.seek(getSongTime(newSlideTime, this.totalSongTime)).then(() => {
                this.isSliderSliding = false;
            });
        },
        slideChange(newChange) {
            this.isSliderSliding = true;
            this.planet.currentAngle = getRadianBasedonSlider(newChange);
        },
        setupPage() {
            window.addEventListener("resize", this.updateCanvasSize);
            this.canvas = document.getElementById('canvas');
            this.ctx = this.canvas.getContext("2d");
            this.canvas.width = document.body.offsetWidth;
            this.canvas.height = document.body.offsetHeight;
            this.generateStars(128);
            window.requestAnimationFrame(this.runOrbit);
        },
        async updateTrackPlayed(newTrack) {
            this.selectedSong = newTrack;
            let newImage = new Image();
            newImage.src = newTrack.img;
            this.planet.img = newImage;
            this.totalSongTime = newTrack.totalDuration;
            setTrack(this.accessToken, newTrack.uri);
        },
        async updateSearch(v) {
            if (v !== "") {
                getSearchResults(this.accessToken, v).then((resp) => {
                    this.trackList = [];
                    this.trackList = resp;
                });
            } else {
                this.trackList = [];
            }
        },

        async setupWebPlayer() {
            let data = await getAllPlayers(this.accessToken);
            let deviceIds = data.devices.filter((device) => {
                return device.name === PLAYER_NAME;
            }).map((device) => { return device.id });

            if (deviceIds.length > 0) {
                let temp = await setPlayBackPlayers(this.accessToken, deviceIds);
            }
        },
        play() {
            this.player.togglePlay();
        },
        async logState() {
            let state = await this.player.getCurrentState()
            console.log('state: ', state);
        },
        async setState() {
            this.player.getCurrentState().then((state) => {
                if (state !== null) {
                    this.isPaused = state.paused;
                    this.planet.currentAngle = getRadianBasedOnTime(state.position, state.duration);
                    this.playBack = getPlayBackSliderTime(state.position, state.duration);
                }
            });
        },
        playbackCallback() {
            this.player = new Spotify.Player({
                name: "Player",
                getOAuthToken: cb => { cb(this.accessToken) },
                volume: 0.5,
            });
        },
        updateCanvasSize() {
            this.canvas.width = document.body.offsetWidth;
            this.canvas.height = document.body.offsetHeight;
        },
        clearRectangle() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
        runOrbit() {
            this.updateCanvasSize();
            this.clearRectangle();
            this.runStarsMixin();
            this.updatePlanetPos(this.planet);
            this.drawCircle(this.planet.orbitSize);
            this.drawPlanet(this.planet);
            this.drawSun(50);
            window.requestAnimationFrame(this.runOrbit);
        },
        updatePlanetPos(planet) {
            planet.x = this.centerX + Math.cos(planet.currentAngle) * planet.orbitSize;
            planet.y = this.centerY + Math.sin(planet.currentAngle) * planet.orbitSize;
            if (this.iterations >= 10) {

                if (!this.isSliderSliding) {
                    this.setState()
                }
                this.iterations = 0;
                if (this.planet.rotation >= 360) {
                    this.planet.rotation = 0;
                }
            }
            this.iterations++;
            this.planet.rotation++;

            // planet.currentAngle = getRadianBasedOnTime();
        },
        drawPlanet(planet) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(planet.x, planet.y, planet.size, 0, 2 * Math.PI, false),
                this.ctx.strokeStyle = "white";
            this.ctx.clip();
            if (this.planet.img !== null) {
                this.ctx.drawImage(this.planet.img, this.planet.x - planet.size, this.planet.y - planet.size, this.planet.size * 2, this.planet.size * 2);
            }
            this.ctx.restore();
        },
        drawSun(size) {
            let url = sunUrl;
            let img = new Image();
            img.src = url;
            this.ctx.save()
            //add rotation
            // this.ctx.rotate(this.planet.rotation * Math.PI / 180);
            this.ctx.drawImage(img, this.centerX - size, this.centerY - size, size * 2, size * 2);
            this.ctx.restore();
        },
        drawCircle(size) {
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, size, 0, 2 * Math.PI, false);
            const gradient = this.ctx.createLinearGradient(0, 0, 170, 0);
            gradient.addColorStop("0", "magenta");
            gradient.addColorStop("0.5", "blue");
            gradient.addColorStop("1.0", "green");
            this.ctx.strokeStyle = gradient;
            this.ctx.stroke();
        }
    }
}
</script>
<style>
#canvas {
    margin: 0;
    padding: 0;
    position: fixed;
    touch-action: none;
    border: 1px dashed;
    top: 0;
    left: 0;
    border-style: solid;
    background: #0a004d;
    z-index: 0;
}
</style>
