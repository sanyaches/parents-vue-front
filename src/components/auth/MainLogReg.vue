<template lang="pug">
  .hero__auth
    .hero__auth-reg
      router-link.hero__auth-reg__button(to='/registration',  v-if="!token") Зарегистрироваться
    .hero__auth-login
      router-link.hero__auth-login__button(to='/client') {{ token ? 'Личный кабинет' : 'Войти' }}
      a.hero__auth-login__link(href="#", v-if="token", @click="logout") Выйти
</template>

<script>
export default {
    name: 'MainLogReg',
  data() {
      return {
        token: localStorage.getItem('user-token')
      }
  },
  methods: {
    logout () {
      localStorage.removeItem('user-token');
      this.token = localStorage.getItem('user-token');
      this.$router.push('/');
      history.go(0)
    },
  }
}
</script>

<style scoped lang="stylus">
.hero__auth
  margin-top: 4.4rem
  &-login
    font-family "Franklin Gothic"
    font-weight 400
    margin-left 0
    display flex
    align-items stretch
    
    @media (max-width: 900px)
      flex-direction column
      margin-left 0
      margin-top 2rem
      align-items center
      
    &__button
      font-weight normal
      font-size 1.11rem
      line-height 50px
      padding 0 3.7rem
      text-decoration none
      margin-top 0
      border: 3px solid #6D37F4;
      box-shadow: 0px 15px 30px rgba(109, 55, 244, 0.5);
      color #6D37F4
      text-transform capitalize
      transition .3s
      @media (max-width: 980px)
        padding 0 3rem
        font-size 1rem
    &:hover
      background rgba(#fff, .15)
      
    &__link
      display: flex
      align-items: center
      text-decoration: none
      text-transform: capitalize
      border 1px solid #6D37F4
      background-color: #6D37F4
      box-shadow: 0 15px 30px rgba(109, 55, 244, 0.5)
      color #fff
      margin-left: 1rem
      padding 0 3.6rem
      transition .3s
      @media (max-width: 980px)
        padding 0 2rem
        font-size 1rem
      &:hover
        -webkit-transform: translateY(2px)
        -moz-transform: translateY(2px)
        -ms-transform: translateY(2px)
        -o-transform: translateY(2px)
        transform: translateY(2px)
        background rgba(#fff, .15)
        color: #6D37F4
      
  &-reg
    margin-right: 1rem
    font-family "Franklin Gothic"
    font-weight 400
    margin-left 0
    display flex
    align-items stretch
    
    @media (max-width: 900px)

      flex-direction column
      margin-left 0
      margin-top 2rem
      align-items center
      
    &__button
      font-weight normal
      font-size 1.11rem
      line-height 50px
      padding 0 3.6rem
      text-decoration none
      margin-top 0
      border 1px solid #6D37F4
      background-color: #6D37F4
      box-shadow: 0 15px 30px rgba(109, 55, 244, 0.5)
      color #fff
      text-transform capitalize
      transition .3s
      @media (max-width: 980px)
        padding 0 2rem
        font-size 1rem
      
    &:hover
      background rgba(#fff, .15)

    @media (max-width: 900px)
      margin-left 0
      margin-top 1rem
      margin-bottom 1rem
    &:hover
      color rgba(#fff, .8)
</style>
