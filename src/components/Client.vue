<template lang="pug">
  #cp
    Cp(v-if="token")
    Auth(v-else)
</template>

<script>
import Auth from './auth/Auth'
import Cp from './cp'

export default {
  data () {
    return {
      token: localStorage.getItem('user-token')
    }
  },
  components: {
    Auth,
    Cp
  }
}
</script>

<style lang="stylus">
#cp
  flex 1
  background #f9f9f9
</style>
