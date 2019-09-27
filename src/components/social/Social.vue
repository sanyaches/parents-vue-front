<template lang="pug">
    section.social
      span.social-text Мы в социальных сетях
      .social-items
        a.social-items__link(href="")
          img.header__i(src="@/assets/icon/vk.png")
        a.social-items__link(href="")
          img.header__i(src="@/assets/icon/instagram.png")
        a.social-items__link(href="")
          img.header__i(src="@/assets/icon/youtube.png")
        a.social-items__link(href="")
          img.header__i(src="@/assets/icon/facebook-f.png")
</template>

<script>
    export default {
        name: "Social"
    }
</script>

<style scoped lang="stylus">
  @import url('https://fonts.googleapis.com/css?family=Rubik&display=swap')
  .social
    display: flex
    flex-direction: column
    align-items: center
    justify-content: space-between
    position: relative
    width: 84%
    text-align: center
    padding-top: 5%
    margin-top: 5%
    border-top: 1px solid rgba(109,55,244,0.2)
    margin-left: 7%

    &-text
      font-size: 1rem
      color: rgba(37, 37, 37, 0.3)
      font-family: Rubik, sans-serif
      margin-bottom: 20px
    &-items
      display: flex
      flex-direction: row
      width: 45%
      justify-content: space-between
      align-items: center
      &__link
        cursor: pointer;



</style>
