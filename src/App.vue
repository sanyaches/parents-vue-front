<template lang="pug">
  .body
    HeaderBar
    router-view
    Footer
</template>

<script>
import HeaderBar from './components/HeaderBar'
import Footer from './components/Footer'

export default {
  metaInfo: {
    title: '«Родители & Дети» – система управления финансами',
  },
  components: {
    HeaderBar,
    Footer
  }
}
</script>

<style lang="stylus">
  @import './assets/stylus/global.styl'
  @import url('https://fonts.googleapis.com/css?family=Rubik&display=swap')
</style>
