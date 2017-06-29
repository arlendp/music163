import Vue from 'vue';
import Vuex from 'vuex';
import { fetchSongsList, fetchSong, fetchLyric } from '../api';

// import _ from 'lodash';

Vue.use(Vuex);


function updateLocalStorage(data) {
  localStorage.setItem('keywordList', data);
}

const store = new Vuex.Store({
  state: {
    searchValue: '',
    showSearch: true,
    showBadges: true,
    showWelcome: true,
    showHeader: false,
    headerInfo: {
      title: '',
      link: ''
    },
    songs: [],
    searchList: [],
    playingSong: null,
    playingLyric: null,
    lyric: null,
    currentTime: 0,
    lyricRow: 0
  },
  getters: {
    parseLyric: (state) => {
      let lyricArray = [];
      if (state.lyric) {
        lyricArray = state.lyric.split('\n');
        if (lyricArray[0].indexOf('by') !== -1) {
          lyricArray.shift();
        }
        lyricArray = lyricArray.filter(l => l !== '');
        lyricArray = lyricArray.map((l) => {
          const reg = /^\[(\d+):(\d+)\.(\d+)]\s*(.*)/;
          const data = l.match(reg);
          return { m: data[1], s: data[2], ms: data[3], content: data[4] };
        });
      }
      console.log(lyricArray);
      return lyricArray;
    },
    topOffset: (state, getters) => {
      const time = state.currentTime;
      const lyricArray = getters.parseLyric;
      let flag = 0;
      for (let i = 0; i < lyricArray.length; i += 1) {
        const lyric = lyricArray[i];
        const lyricTime = (lyric.m * 60) + (+lyric.s) + '.' + lyric.ms;
        if (time < lyricTime) {
          flag = i - 1;
          break;
        }
      }
      if (flag < 0) {
        flag = 0;
      }
      state.lyricRow = flag;
      if (flag < 3) {
        return 0;
      }
      return ((flag - 2) * 2) * 16;
    }
  },
  mutations: {
    toggleWelcome(state, payload) {
      state.showWelcome = payload;
    },
    toggleSearch(state, payload) {
      state.showSearch = payload;
    },
    toggleBadges(state, payload) {
      state.showBadges = payload;
    },
    toggleHeader(state, payload) {
      state.showHeader = payload;
    },
    changeHeaderInfo(state, payload) {
      state.headerInfo = payload;
    },
    updateSearch(state, payload) {
      state.searchValue = payload;
    },
    loadSongsList(state, payload) {
      state.songs = payload.songs;
    },
    loadSong(state, payload) {
      state.playingSong = payload;
    },
    loadLyric(state, payload) {
      state.playingLyric = payload;
      state.lyric = payload.lrc.lyric;
    },
    addSearch(state, payload) {
      if (Array.isArray(payload)) {
        state.searchList = state.searchList.concat(payload);
      } else {
        if (!state.searchList.length || state.searchList.indexOf(payload) === -1) {
          state.searchList.push(payload);
        }
        if (state.searchList.length > 10) {
          state.searchList.shift();
        }
      }
      updateLocalStorage(JSON.stringify(state.searchList));
    },
    changeTime(state, payload) {
      state.currentTime = payload;
    }
  },
  actions: {
    getSongsList({ commit }, options) {
      const req = fetchSongsList(options);
      req.then((resp) => {
        commit('loadSongsList', {
          songs: resp.data.result.songs
        });
        if (resp.data.result.songCount) {
          commit('addSearch', options.s);
        }
      })
      return req;
    },
    getSong({ commit }, options) {
      const req = fetchSong(options.id);
      req.then((resp) => {
        commit('loadSong', resp.data.songs[0]);
      })
      return req;
    },
    getLyric({ commit }, options) {
      const req = fetchLyric(options.id);
      req.then((resp) => {
        commit('loadLyric', resp.data);
      })
      return req;
    }
  }
});


export default store;
