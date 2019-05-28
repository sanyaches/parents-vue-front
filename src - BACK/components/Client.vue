<template lang="pug">
  .top
      .top__mw.mw
        .top__title Здравствуйте, <span class="top__name">Дмитрий Николаевич</span>
        .top__dlg
          img.top__dlg-img(src='@/assets/image/dlg.svg')
          .top__dlg-price 1.000
          .top__dlg-rub ₽
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>

<style lang="stylus">
.top
  background-color #f9f9f9
  padding-top 10px
  padding-bottom 10px
  &__mw
    background-image url(./assets/image/dots.png)
    background-repeat no-repeat
    background-position left center
    padding-top 20px
    padding-bottom 20px
    display flex
    justify-content space-between
    align-items stretch
  &__title
    font-size 2rem
    font-weight 600
  &__name
    color blue
  &__dlg
    background #fff
    border-radius: 50px
    padding 15px 3rem
    margin -15px 0
    display flex
    align-items center
    &-img 
      height 1.5rem
      margin-right 2rem
    &-price
      font-size 1.2rem
      font-weight 600
    &-rub
      color blue
      font-size 1.2rem
      font-weight 600
      margin-left 5px
</style>
