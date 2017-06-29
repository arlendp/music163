<template>
  <transition name="slide-up" @after-leave="afterLeave">
    <div class="welcome" v-show="show">
      <h2>{{appName}}</h2>
    </div>
  </transition>
</template>
<script>
import {
  mapState
} from 'vuex';

export default {
  name: 'welcome',
  data() {
    return {
      appName: '网易云音乐'
    }
  },
  computed: {
    ...mapState({
      show: state => state.showWelcome
    })
  },
  methods: {
    afterLeave() {
      this.$emit('hideWelcome');
    }
  }
};
</script>
<style lang="scss">
@import '~css/base';
.welcome {
  height: 15em;
  overflow: auto;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  h1 {
    color: $color-white;
    text-shadow: 0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0, 0, 0, 0.1), 0 0 5px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.3), 0 3px 5px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.25);
  }
  h2 {
    color: $color-white;
    text-shadow: 0 0 5px #CCCCCC, 0 0 10px #CCCCCC, 0 0 15px #CCCCCC, 0 0 20px #26a2ff, 0 0 25px #26a2ff, 0 0 30px #26a2ff, 0 0 50px #26a2ff, 0 0 80px #26a2ff, 0 0 100px #26a2ff, 0 0 150px #26a2ff
  }
}

.slide-up-enter-active {
  transition: all .5s ease;
}

.slide-up-leave-active {
  transition: all .8s ease;
}

.slide-up-enter,
.slide-up-leave-active {
  transform: scale(0, 0);
}
</style>
