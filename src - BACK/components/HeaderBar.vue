<template lang="pug">
  header.header
    .header__line
      .header__line-mw.mw
        .header__col «Родители & Дети» – приложение для управления финансами в образовательной системе
        .header__col <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="envelope" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="header__icon"><path fill="currentColor" d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z" class=""></path></svg> mail@parents.ru
    .header__mw.mw
      img.header__logo(src='@/assets/image/logo.svg')
      nav.header__nav
        router-link.header__link(to='/') Главная
        router-link.header__link(to='/') Новости
        router-link.header__link(to='/') О нас
        HeaderLogin
</template>

<script>
import HeaderLogin from './auth/HeaderLogin'
export default {
  components: {
    HeaderLogin
  }
}
</script>

<style lang="stylus">
.header
  position relative
  &__icon
    height 18px
    margin-right 10px
  &__line
    padding-top 10px
    padding-bottom 10px
    background #222
    color rgba(#fff, .9)
    font-size .9rem
    &-mw
      display flex
      justify-content space-between
  &__col
    display flex
    align-items center
  &__mw
    height 100px
    display flex
    justify-content space-between
    align-items center
  &__logo
    height 80px
  &__nav
    display flex
    align-items center
  &__link
    text-decoration none
    text-transform uppercase
    color black
    font-weight 600
    transition .2s
    display inline-block
    position relative
    overflow hidden
    padding 10px 0
    &:before
      content ''
      position absolute
      width 100%
      height 2px
      top 0
      left 200%
      background #6D37F4
      transition .5s
      opacity 0
    &:after
      content ''
      position absolute
      width 100%
      height 2px
      bottom 0
      left -100%
      background #6D37F4
      transition .5s
      opacity 0
    &:hover
      color #6D37F4
      &:before, &:after
        left 0
        opacity 1
    & + &
      margin-left 3rem
</style>
