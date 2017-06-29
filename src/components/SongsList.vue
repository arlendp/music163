<template>
  <div class="songs-list">
    <mt-cell v-for="song in songs" :title="song.name" :label="song.artists[0].name" is-link :value="'专辑 《' + song.album.name + '》'" :to="'/song/' + song.id" :key="song.id" v-if="show"></mt-cell>
  </div>
</template>
<script>
import {
  Indicator
} from 'mint-ui';
import {
  mapState
} from 'vuex';

export default {
  data() {
      return {
        show: false
      }
    },
    computed: {
      ...mapState([
        'songs'
      ])
    },
    watch: {
      $route() {
        this.getSongsList();
      }
    },
    methods: {
      getSongsList() {
        Indicator.open({
          text: '加载中...',
          spinnerType: 'fading-circle'
        });
        const keyword = this.$route.params.keyword || '周杰伦';
        // 这里重新赋值，用于刷新页面导致的keyword丢失
        this.$store.commit('updateSearch', keyword);
        this.$store.dispatch('getSongsList', {
          s: keyword
        }).then(() => {
          Indicator.close();
          this.show = true;
        });
      }
    },
    created() {
      // this.$store.commit('toggleWelcome', false);
      this.$store.commit('changeHeaderInfo', {
        title: '歌曲列表',
        link: '/'
      });
      this.$store.commit('toggleHeader', true);
      this.getSongsList();
    }
}
</script>
<style lang="scss">
/*.songs-list-enter-active,
.songs-list-leave-active {
  transition: width 2s;
}

.songs-list-enter,
.songs-list-leave-active {
  width: 0;
}*/

.songs-list {
  @for $i from 1 through 10 {
    .mint-cell:nth-child(10n + #{$i}) {
      // 这里需要加opacity: 0，否则会先显示出来再执行动画
      opacity: 0;
      animation-name: show-list;
      animation-duration: 1s;
      animation-timing-function: ease-in-out;
      animation-delay: 100ms * $i;
      animation-fill-mode: forwards;
    }
  }
}
@media (max-width: 425px) {
  .songs-list {
    .mint-cell-value {
      max-width: 10em;
    }
  }
}

@keyframes show-list {
  from {
    opacity: 0;
    transform: rotateY(-90deg) translate3d(0, 30px, 0);
  }
  to {
    opacity: 1;
    transform: rotateY(0deg) translate3d(0, 0, 0);
  }
}
</style>
