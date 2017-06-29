import Vue from 'vue';
import VueResource from 'vue-resource';
import _ from 'lodash';

Vue.use(VueResource);

Vue.http.options.root = '/api';
Vue.http.options.emulateJSON = true;
Vue.http.options.emulateHTTP = true;

function fetchSongsList(options) {
  const otherParams = {
    csrf_token: '',
    type: 1,
    offset: 0,
    limit: 10,
    total: true
  };
  _.assign(options, otherParams);
  return Vue.http.post('search/get/web', options);
}

function fetchSong(id) {
  return Vue.http.get('/api/song/detail?id=' + id + '&ids=%5B' + id + '%5D');
}

function fetchLyric(id) {
  return Vue.http.get('/api/song/lyric?os=pc&id=' + id + '&lv=-1&kv=-1&tv=-1');
}

export default fetchSongsList

export { fetchSongsList, fetchSong, fetchLyric }
