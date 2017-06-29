import Vue from 'vue';
import Router from 'vue-router';
import SongsList from 'components/SongsList';
import Song from 'components/Song';

Vue.use(Router);

export default new Router({
  routes: [
    {
      name: 'home',
      path: '/'
    },
    {
      name: 'songsList',
      path: '/songs/:keyword',
      component: SongsList
    },
    {
      name: 'song',
      path: '/song/:id',
      component: Song
    }
  ],
});
