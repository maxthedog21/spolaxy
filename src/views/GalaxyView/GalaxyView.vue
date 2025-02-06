<template>
    <canvas widht="max" height="max" id="canvas"></canvas>
</template>
<<script type="text/javascript">
  export default {
      name: "GalaxyView",
      data(){
          return {
          canvas: null,
          ctx: null,
        player: null,
        planet: {
            x: 0,
            y: 0,
            size: 20,
            currentAngle: 0,
            orbitSize: 100,
        },
          };
      },
      mounted(){
          window.onSpotifyWebPlaybackSDKReady = () => {
              this.player = new Spotify.Player({
                  name: "Player",
                  getOAuthToken: cb => { cb(this.accessToken) },
                  volume: 0.5,
              });
         this.player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            this.player.togglePlay();
        });
          this.player.connect();
          }
          window.addEventListener("resize", this.updateCanvasSize);
          this.canvas = document.getElementById('canvas');
          this.ctx = this.canvas.getContext("2d");
          this.canvas.width = document.body.offsetWidth;
          this.canvas.height = document.body.offsetHeight;
          window.requestAnimationFrame(this.runOrbit);
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
          centerX(){
              return this.canvas.width / 2;
          },
          centerY(){
              return this.canvas.height / 2;
          },
      },
      methods: {
          playbackCallback(){
              this.player = new Spotify.Player({
                  name: "Player",
                  getOAuthToken: cb => { cb(this.accessToken) },
                  volume: 0.5,
              });
          },
      updateCanvasSize(){
         this.canvas.width = document.body.offsetWidth;
         this.canvas.height = document.body.offsetHeight;
      },
      clearRectangle(){
             this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
         },
      runOrbit(){
          this.clearRectangle();
          this.updatePlanetPos(this.planet);
          this.drawCircle(this.planet.orbitSize);
          this.drawPlanet(this.planet);
          window.requestAnimationFrame(this.runOrbit);
      },
      updatePlanetPos(planet){
          planet.x = this.centerX + Math.cos(planet.currentAngle) * planet.orbitSize;
          planet.y = this.centerY + Math.sin(planet.currentAngle) * planet.orbitSize;
          planet.currentAngle += 0.05;
      },
      drawPlanet(planet){
        this.ctx.beginPath();
        this.ctx.arc(planet.x, planet.y, planet.size, 0, 2 * Math.PI, false),
        this.ctx.strokeStyle = "white";
        this.ctx.stroke();
      },
      drawCircle(size){
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, size, 0, 2 * Math.PI, false),
        this.ctx.strokeStyle = "white";
        this.ctx.stroke();
      }
    }
  }
</script>
<style>
#canvas{
            margin: 0;
            padding: 0;
            position: fixed;
            touch-action: none;
            border: 1px dashed;
            top:0;
            left:0;
            border-style: solid;
            background: #0a004d;
}
</style>
