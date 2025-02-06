<template>
    <v-btn v-if="isPaused" @click="play" color="transparent" icon class="pb-8">
        <v-icon>mdi-play</v-icon>
    </v-btn>
    <v-btn v-else @click="pause" color="transparent" icon class="pb-8">
        <v-icon>mdi-pause</v-icon>
    </v-btn>
</template>
<script>
export default {
    name: "PAUSEPLAY",
    props: {
        isPaused: {
            type: Boolean,
        },

    },
        methods: {
            play() {
                this.$emit('play');
            },
            pause() {
                this.$emit('pause');
            },
        }
}
</script>
