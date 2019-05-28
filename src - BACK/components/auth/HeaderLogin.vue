<template lang="pug">
  .header-login
    router-link.header-login__button.button(to='/login') {{ username ? 'Личный кабинет' : 'Вход' }}
    a.header__link(v-if="username", @click="logout") Выйти
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  data () {
    return {}
  },
  computed: {
    username() {
      return this.$store.getters['auth/username']
    }
  },
  methods: {
    ...mapMutations({
      logout: 'auth/logout'
    })
  }
}
</script>

<style lang="stylus">
.header-login
  margin-left 3rem
  &__button
    font-weight normal
    line-height 50px
    display inline-block
    padding 0 1.2rem
    text-decoration none
    margin-top 0
</style>
