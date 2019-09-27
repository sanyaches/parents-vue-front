<template lang="pug">
  header.header
    .header__line
      .header__line-mw.mw
        .header__col
          img.header__i(src="@/assets/icon/instagram.svg")
          img.header__i(src="@/assets/icon/youtube.svg")
          img.header__i(src="@/assets/icon/vk.svg")
          img.header__i(src="@/assets/icon/facebook.svg")
          img.header__i(src="@/assets/icon/twitter.svg")
        .header__col <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="envelope" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="header__icon"><path fill="currentColor" d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z" class=""></path></svg><a href="mailto:mail@parents.ru">mail@parents.ru</a>
    .header__mw.mw
      router-link(to="/")
        img.header__logo(src='@/assets/image/logo-white.svg')
      .burger(:class="{ 'burger--active': isActive }", @click="burger") 
        .burger__i
        .burger__i
        .burger__i
      nav.header__nav(:class="{ 'header__nav--active': isActive }", @click="burger")
        router-link.header__link(to='/news/1') Новости
        router-link.header__link(to='/about') О нас
        router-link.header__link(to='/suppliers') Поставщики
      .header__components
        Search(v-if="$route.path !== '/searched'")
        HeaderLogin
</template>

<script>
import HeaderLogin from './auth/HeaderLogin'
import Search from './Search'

export default {
  data () {
    return {
      isActive: false
    }
  },
  methods: {
    burger: function () {
      this.isActive = !this.isActive
    }
  },
  components: {
    HeaderLogin,
    Search
  }
}
</script>

<style lang="stylus">
.burger
  width 30px
  height 30px
  display flex
  flex-direction column
  justify-content center
  cursor pointer
  display none
  position relative
  z-index 3
  @media (max-width: 900px)
    display block
    position: absolute;
    left: 85%;
  &:not(.burger--active):hover
    > .burger__i:nth-child(1)
      transform translateY(-2px)
    > .burger__i:nth-child(3)
      transform translateY(2px)
  &--active
    > .burger__i:nth-child(1)
      transform translateY(11px) rotate(45deg)
    > .burger__i:nth-child(2)
      opacity 0
    > .burger__i:nth-child(3)
      transform translateY(-11px) rotate(-45deg)
  &__i
    width 30px
    height 4px
    background #fff
    transition .3s
    & + &
      margin-top 7px
.header
  position relative
  background #6d37f4
  &__icon
    height 18px
    margin-right 10px
  &__i
    height 22px
    border-radius 3px
    & + &
      margin-left 0.5rem
  &__line
    padding-top 15px
    padding-bottom 15px
    color rgba(#fff, .9)
    font-size .9rem
    background #6d37f4
    position relative
    z-index 2
    border-bottom 1px solid rgba(#fff, .2)
    &-mw
      display flex
      justify-content space-between
  &__col
    display flex
    align-items center
    a
      color #fff
      text-decoration none
  &__mw
    height 130px
    display flex
    justify-content space-between
    align-items center
    background #6d37f4
    position relative
    z-index 1
    @media (max-width: 900px)
      height 60px
      &:before
        content ''
        position absolute
        top 0
        right 0
        bottom 0
        left 0
        background #6d37f4
        z-index 2
  &__logo
    height 80px
    position relative
    z-index 3
    @media (max-width: 900px)
      height 40px
  &__nav
    display flex
    align-items center
    transition .3s
    @media (max-width: 900px)
      position absolute
      padding 1rem
      bottom 0
      right 0
      left 0
      background #6d37f4
      flex-direction column
      border-top 1px solid rgba(#fff, .2)
      z-index 1
      &--active
        transform translateY(100%)
  &__link
    font-family "Franklin Gothic"
    text-decoration none
    text-transform uppercase
    color #fff
    font-weight 400
    font-style normal
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
      background #fff
      transition .5s
      opacity 0
    &:after
      content ''
      position absolute
      width 100%
      height 2px
      bottom 0
      left -100%
      background #fff
      transition .5s
      opacity 0
    &.router-link-exact-active
      cursor default
    &:hover, &.router-link-exact-active
      color #fff
      &:before, &:after
        left 0
        opacity 1
    & + &
      margin-left 1.7rem
      @media (max-width: 900px)
          margin-left 0
  &__components
    display: flex
    flex-direction: row
    @media (max-width:900px)
      display: none
</style>
