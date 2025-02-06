<template>
    <v-row align="center">
        <StartView
            v-if="isProjectReady"
            @updateCreds="updateCreds"
        ></StartView>
        <GalaxyView
            v-else
            :accessToken="accessToken"
        ></GalaxyView>
    </v-row>
</template>
<script>
 import {  getAuthorization } from "@/spotifyConfig/spotifySetup.js";
 import { getAccessToken } from "@/spotifyConfig/spotifyToken.js";
 import { getProfile } from "@/api/spotify/spotifyWebAPI/songs.js";
 import StartView from "@/views/StartView/startView.vue";
 import GalaxyView from "@/views/GalaxyView/GalaxyView.vue"
 export default {
     name: "DataContainer",
         data(){
             return {
                 code: null,
                 accessToken: null,
                 profile: 'loading',
                 clientId: null,
                 redirectUri: null,
                 isFileRead: false,
             }
         },
    async mounted(){
     let data =   await window.electronAPI.readConfig();
        if(data){
            this.clientId = data.clientId;
            this.redirectUri = data.redirectUri;
            this.start();
        }else{
            this.isFileRead = true;
        }

     },
     components: {
         StartView,
         GalaxyView,
     },
     computed: {
         isProjectReady(){
             return   this.isFileRead && this.clientId === null && this.redirectUri === null;
         },
     },
     methods: {
         async updateCreds(creds){
           let ifWrote =   await window.electronAPI.writeConfig(creds);
             if(ifWrote){
                 this.clientId = creds.clientId;
                 this.redirectUri = creds.redirectURI;
                 this.start();
             }
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
                 this.accessToken = await getAccessToken(this.clientId, this.redirectUri, this.code);
             }
         },


     }
 }
</script>
