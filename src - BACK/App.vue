<template lang="pug">
  .body
    HeaderBar
    router-view
    Header
</template>

<script>
import HeaderBar from './components/HeaderBar'
import Auth from './components/auth/Auth'
import Header from './components/Header'

export default {
  components: {
    HeaderBar,
    Auth,
    Header
  }
}
</script>

<style lang="stylus">
@import './assets/stylus/global.styl'
</style>
