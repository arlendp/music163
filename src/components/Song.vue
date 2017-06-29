<template>
  <div class="song-info">
    <div class="song-container">
      <div class="album-cover" :class="animation" v-if="showSongInfo">
        <img :src="song.album.picUrl">
      </div>
    </div>
    <div class="lyric-container">
      <h2 class="song-name" v-if="showSongInfo">{{song.name}}</h2>
      <p class="singer" v-if="showSongInfo">{{song.artists[0].name}}</p>
      <div class="lyric-box" v-if="showLyric">
        <ul class="lyric">
          <li v-for="(lyric, index) in lyricArray" :class="{highlight: index === lyricRow}">{{lyric.m}}:{{lyric.s}}:{{lyric.ms}} {{lyric.content}}</li>
        </ul>
      </div>
    </div>
    <div class="audio-box">
      <audio autobuffer controls v-if="showSongInfo" @timeupdate="transformLyric" @playing="play" @pause="pause" @ended="stop">
        <source :src="song.mp3Url" type="audio/mp4"> Your browser does not support the audio tag.
      </audio>
    </div>
  </div>
</template>
<script>
import {
  mapState,
  mapGetters
} from 'vuex';
import $ from 'jquery';

export default {
  data() {
      return {
        showSongInfo: false,
        showLyric: false,
        playing: false,
        paused: false
      }
    },
    computed: {
      ...mapState({
        song: state => state.playingSong,
        lyric: state => state.playingLyric,
        lyricRow: state => state.lyricRow
      }),
      ...mapGetters({
        lyricArray: 'parseLyric',
        scrollToTop: 'topOffset'
      }),
      animation() {
        return {
          spinner: this.playing,
          paused: this.paused
        }
      }
    },
    watch: {
      scrollToTop: (val) => {
        $('.lyric-box').animate({
          scrollTop: val
        }, {
          duration: 500,
          easing: 'linear',
          queue: false
        });
      }
    },
    created() {
      this.hideComponents();
      this.fetchSongInfo(this.$route.params.id);
    },
    methods: {
      hideComponents() {
        this.$store.commit('toggleSearch', false);
        this.$store.commit('toggleBadges', false);
      },
      fetchSongInfo(id) {
        this.$store.dispatch('getSong', {
          id
        }).then(() => {
          this.showSongInfo = true;
        });
        this.$store.dispatch('getLyric', {
          id
        }).then(() => {
          console.log(this);
          this.showLyric = true;
        });
      },
      transformLyric(e) {
        const time = e.srcElement.currentTime;
        this.$store.commit('changeTime', time);
      },
      play() {
        this.playing = true;
        this.paused = false;
      },
      pause() {
        this.paused = true;
      },
      stop() {
        this.playing = false;
      }
    }
}
</script>
<style lang="scss">
.song-info {
  text-align: center;
  .song-container {
    .album-cover {
      display: inline-block;
      border-radius: 4em;
      overflow: hidden;
      img {
        width: 8em;
        height: 8em;
        vertical-align: middle;
      }
    }
  }
  .lyric-container {
    margin-top: 2em;
    .lyric-box {
      padding-left: 2em;
      height: 10em;
      overflow-y: scroll;
      .lyric {
        list-style: none;
        padding: 0;
        margin: 0;
        text-align: left;
        li {
          margin: 0.5em 0;
          line-height: 1.5em;
        }
      }
      .highlight {
        color: lightblue;
      }
    }
  }
  .audio-box {
    position: absolute;
    bottom: 5em;
    left: 50%;
    transform: translateX(-50%);
  }
}
.spinner {
  animation: ani-spin 8s linear 0s infinite;
}

.paused {
  animation-play-state: paused;
}

@keyframes ani-spin {
  from {
    transform: rotateY(0);
  }
  to {
    transform: rotateY(360deg);
  }
}

</style>
