<template>
        isProjectReady {{ isProjectReady }}
        <StartView
            v-if="isProjectReady"
            @updateCreds="updateCreds"
        ></StartView>
        <GalaxyView
            v-else
            :accessToken="accessToken"
        ></GalaxyView>
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
     let data =  this.getCreds();
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
        getCreds(){
           let clientId = localStorage.getItem("clientId");
           let redirectUri = localStorage.getItem("redirectURI");
           if(!!clientId && !!redirectUri){
            return {
                "clientId": clientId,
                "redirectUri": redirectUri,
            }
           }
           return null;

        },
         async updateCreds(creds){
                 this.clientId = creds.clientId;
                 this.redirectUri = creds.redirectURI;
                 localStorage.setItem("clientId", creds.clientId);
                 localStorage.setItem("redirectURI", creds.redirectURI);
                 this.start();
         },
        async searchTest(){
                this.profile = 'loading...';
                 this.profile = await getProfile(this.accessToken);
         },
        async start(){
            const urlParams = new URLSearchParams(window.location.search);
            this.code = urlParams.get('code');
            let refreshToken = localStorage.getItem('refreshToken');
             if(this.code === null){
                getAuthorization(this.clientId, this.redirectUri);
             }else{
                let tempCode = await getAccessToken(this.clientId, this.redirectUri, this.code, refreshToken);
                if(tempCode === 'REDO'){
                    getAuthorization(this.clientId, this.redirectUri);
                }else{
                    this.accessToken = tempCode;
                }
             }
         },


     }
 }
</script>
