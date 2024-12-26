<template>
    <v-row align="center">
        <StartView
            v-if="isProjectReady"
            @updateCreds="updateCred"
        ></StartView>
    </v-row>
</template>
<script>
 import {  getAuthorization } from "@/spotifyConfig/spotifySetup.js";
 import { getAccessToken } from "@/spotifyConfig/spotifyToken.js";
 import { getProfile } from "@/api/spotify/spotifyWebAPI/songs.js";
 import StartView from "@/views/StartView/startView.vue";
 export default {
     name: "DataContainer",
         data(){
             return {
                 code: null,
                 accessToken: null,
                 profile: 'loading',
                 clientId: '89eb97f421a949e4b83714f8b1c4c2d9',
                 redirectUri: 'http://localhost:3001',
                 isFileRead: false,
             }
         },
    async mounted(){
        // this.start();
     let data =   await window.electronAPI.readConfig();
         console.log('window', data);
         console.log('mounted');
     },
     components: {
         StartView,
     },
     computed: {
         isProjectReady(){
             return true;//  this.isFileRead && this.clientId !== null && this.redirectUri !== null;
         },
     },
     methods: {
         async updateCred(){},
         async readFile(){

         },
        async searchTest(){
                this.profile = 'loading...';
                 this.profile = await getProfile(this.accessToken);
                 console.log('profile: ', this.profile);
         },
        async start(){
            const urlParams = new URLSearchParams(window.location.search);
            this.code = urlParams.get('code');
             if(this.code === null){
                getAuthorization(this.clientId, this.redirectUri);
             }else{
                 this.accessToken = await getAccessToken('89eb97f421a949e4b83714f8b1c4c2d9', 'http://localhost:3001', this.code);
             }
         },


     }
 }
</script>
