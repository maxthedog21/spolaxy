<template>
    <canvas widht="max" height="max" id="canvas"></canvas>
<v-col align-self="center">
<v-card
    class="mx-auto"
    max-width="500"
    title="Spotify Config"
    color="blue-grey-lighten-3"
    elevation="20"
  >
    <v-container>
      <v-text-field
        v-model="clientId"
        color="primary"
        label="Client Id"
        variant="underlined"
      ></v-text-field>

      <v-text-field
        v-model="redirectURI"
        color="primary"
        label="Redirect URI"
        variant="underlined"
      ></v-text-field>

    </v-container>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn @click="updateCreds" color="white">
       Submit Config

        <v-icon icon="mdi-chevron-right" end></v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
    </v-col>
</template>
<script>
 import {  getAuthorization } from "@/spotifyConfig/spotifySetup.js";
 import { getAccessToken } from "@/spotifyConfig/spotifyToken.js";
 import { getProfile } from "@/api/spotify/spotifyWebAPI/songs.js";
 export default {
     name: "StartView",
         data(){
             return {
                 clientId: "",
                 redirectURI: "",
                 canvas: null,
                 ctx: null,
                 starList: [],
                 now: 0,
                 dt: 0,
                 last: 0,
                 elaspedTime: 0,
             };
         },
     mounted(){
       //  this.start();
          window.addEventListener("resize", this.updateCanvasSize);
         this.canvas = document.getElementById('canvas');
         this.ctx = this.canvas.getContext("2d");
         this.canvas.width = document.body.offsetWidth;
         this.canvas.height = document.body.offsetHeight;
         this.generateStars(128);

         this.last = this.timestamp();
         window.requestAnimationFrame(this.runStars);
     },
      unmounted() {
          window.removeEventListener("resize", this.updateCanvasSize);
      },
     methods: {
      updateCanvasSize(){
         this.canvas.width = document.body.offsetWidth;
         this.canvas.height = document.body.offsetHeight;
      },
         updateCreds(){
             let creds = {clientId: this.clientId, redirectURI: this.redirectURI};
             console.log('creds', creds);
             this.$emit('updateCreds', creds);
         },
         timestamp() {
            return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
        },
        async searchTest(){
                this.profile = 'loading...';
                 this.profile = await getProfile(this.accessToken);
         },
         clearRectangle(){
             this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
         },
         drawRectangle(){
             this.ctx.fillStyle = "black";
             this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
         },
         drawStars(){
             this.starList.forEach((star, index) => {
                 this.ctx.beginPath()
                 this.ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI, false)
                 this.ctx.fillStyle = "white";
                 this.ctx.shadowBlur = 8;
                 this.ctx.shadowColor = "white";
                 this.ctx.fill();
                 this.ctx.closePath();
             });
         },
         runStars(){
             this.now = this.timestamp();
             this.dt = (this.now - this.last) / 1000;
             this.elaspedTime += this.dt;
                 this.clearRectangle();
                 this.drawStars();
                 this.updateStars();
                 this.elaspedTime = 0;
             this.last = this.now;
             window.requestAnimationFrame(this.runStars);
         },
         updateStars(){
           this.starList = this.starList.map((star) => {
               if(star.growing){
                   star.size += 0.02;
                   star.growing = star.size < 2;
               }else{
                   if(star.size < 0.26){
                       star.growing = true;
                   }else{
                       star.size -= 0.02;
                   }

               }
               return star;
           });
         },
         generateStars(num){
             let i = 0;
             const mX = this.canvas.width;
             const mY = this.canvas.height
             while(i < num){
                 let star = {
                    x: Math.floor(Math.random() * mX),
                    y: Math.floor(Math.random() * mY),
                    size: Math.floor(Math.random() * 2),
                    shawdowSize: Math.floor(Math.random() * 11),
                    growing: Math.floor(Math.random() * 2) === 1 ? true : false,
                 };
                 this.starList.push(star);
                 i++;
             }
         },


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
    background: #2E3C63;
}
</style>
