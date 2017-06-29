<template>
  <div id="app">
    <mt-header fixed :title="header.title" v-show="showHeader">
      <router-link :to="header.link" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <section class="content">
      <welcome @hideWelcome="getSongsList"></welcome>
      <div class="container" v-show="showSearch">
        <div class="search">
          <div class="search-input">
            <mt-field :placeholder="tip" v-model="searchValue"></mt-field>
          </div>
          <div class="btn-search">
            <mt-button type='primary' size="normal" v-tap="{methods: search}">搜索</mt-button>
          </div>
        </div>
      </div>
      <div class="badges-box" v-show="showBadges">
        <mt-badge @click.native="autoSearch(badge)" v-for="(badge, index) in badges" :key="index" size="large" type="primary">{{badge}}</mt-badge>
      </div>
      <router-view></router-view>
    </section>
  </div>
</template>
<script>
import {
  mapState
} from 'vuex';
import {
  Toast
} from 'mint-ui';
import Welcome from './components/Welcome';

export default {
  data() {
      return {
        tip: '输入歌曲名称或歌手姓名'
      }
    },
    name: 'app',
    components: {
      Welcome,
    },
    computed: {
      searchValue: {
        get() {
          return this.$store.state.searchValue;
        },
        set(value) {
          this.$store.commit('updateSearch', value);
        }
      },
      ...mapState({
        badges: state => state.searchList,
        showSearch: state => state.showSearch,
        showBadges: state => state.showBadges,
        showHeader: state => state.showHeader,
        header: state => state.headerInfo
      })
    },
    watch: {
      $route(to, from) {
        // if (to.name === 'home') {
        //   this.$store.commit('updateSearch', '');
        //   this.$store.commit('loadSongsList', {
        //     songs: []
        //   });
        //   this.$store.commit('toggleWelcome', true);
        // }
        // if (to.name === 'songsList') {
        //   this.$store.commit('toggleWelcome', false);
        // }
        // if (from.name === 'songsList') {
        //   this.$store.commit('toggleWelcome', true);
        //   this.$store.commit('toggleHeader', false);
        // }
        if ((from.name === 'songsList') && (to.name === 'home')) {
          this.$store.commit('updateSearch', '');
          this.$store.commit('loadSongsList', {
            songs: []
          });
          this.$store.commit('toggleWelcome', true);
          this.$store.commit('toggleHeader', false);
        } else if (to.name === 'song') {
          this.$store.commit('changeHeaderInfo', {
            title: '正在播放',
            link: from.path
          });
        } else if (from.name === 'song') {
          this.$store.commit('toggleSearch', true);
          this.$store.commit('toggleBadges', true);
        }
      }
    },
    methods: {
      search() {
        if (this.searchValue === '') {
          Toast({
            message: '请输入搜索内容',
            duration: 2000
          });
        } else if (this.$store.state.showWelcome) {
          this.$store.commit('toggleWelcome', false);
        } else {
          this.getSongsList();
        }
        // this.getSongsList();
      },
      getSongsList() {
        // 这里用于songsList部分刷新页面时hideWelcome之后不会跳转路由
        if (this.searchValue === '') return;
        this.$router.push({
          name: 'songsList',
          params: {
            keyword: this.searchValue
          }
        });
      },
      autoSearch(badge) {
        this.$store.commit('updateSearch', badge);
        this.search();
      }
    },
    // 实例创建时从localStorage中读取搜索关键字历史
    created() {
      const searchKeywords = localStorage.getItem('keywordList');
      if (searchKeywords) {
        this.$store.commit('addSearch', JSON.parse(searchKeywords));
      }
    }
};
</script>
<style lang="scss">
@import '~css/base';
#app {
  position: relative;
  font-family: $font-base;
  overflow: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  section.content {
    margin-top: 40px;
    padding: 10px;
    .container {
      margin: 2px 4px;
      .search {
        display: flex;
        .search-input {
          flex: 1;
        }
        .btn-search {
          margin-left: 10px;
          padding-top: 3px;
        }
      }
    }
    .badges-box {
      margin: 10px;
      .mint-badge {
        margin: 5px;
        cursor: pointer;
      }
    }
  }
}

@media (min-width: 1024px) {
  #app {
    width: 480px;
    min-height: 800px;
    margin: 0 auto;
    border: 1px solid #ccc;
    border-radius: 0.3em;
    header {
      position: absolute;
    }
  }
}
</style>
