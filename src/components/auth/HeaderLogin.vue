<template lang="pug">
  .header-login
    router-link.header-login__button(to='/client') {{ token ? 'Личный кабинет' : 'Вход' }}
    a.header-login__link(href="#", v-if="token", @click="logout") Выйти
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      token: localStorage.getItem('user-token')
    }
  },
  methods: {
    logout () {
      localStorage.removeItem('user-token')
      this.token = localStorage.getItem('user-token');
      this.$router.push('/client');
      history.go(0)
    }
  }
}
</script>

<style lang="stylus">
.header-login
  margin-left 3rem
  display flex
  align-items stretch
  @media (max-width: 900px)
    flex-direction column
    margin-left 0
    margin-top 2rem
    align-items center
  &__button
    font-weight normal
    line-height 50px
    padding 0 1.2rem
    text-decoration none
    margin-top 0
    border 1px solid #fff
    color #ffffff
    text-transform uppercase
    font-weight 600
    transition .3s
    &:hover
      background rgba(#fff, .15)
  &__link
    text-decoration: none
    text-transform: uppercase
    color: #fff
    font-size .8rem
    -webkit-transition: 0.2s
    transition: 0.2s
    position: relative
    display flex
    align-items center
    margin-left 1rem
    @media (max-width: 900px)
      margin-left 0
      margin-top 1rem
      margin-bottom 1rem
    &:hover
      color rgba(#fff, .8)
</style>
