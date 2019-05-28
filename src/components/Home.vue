<template lang="pug">
  #home
    .hero
      .mw
        h1.hero__title Система управления финансами
        .hero__ps для образовательных учреждений
    .content.mw
      h2.h2 Последние новости
      LastNews
</template>

<script>
import LastNews from './module/LastNews'

export default {
  components: {
    LastNews
  }
}
</script>

<style lang="stylus">
.hero
  background-image linear-gradient(to top, #fff, transparent 35%), url('../assets/image/hero.jpg')
  background-size cover
  background-position center
  padding-top 450px
  padding-bottom 2rem
  @media (max-width 1080px)
    padding-top 300px
  @media (max-width 768px)
    padding-top 200px
  &__title
    font-size 4rem
    font-weight 800
    text-transform uppercase
    @media (max-width 1080px)
      font-size 3rem
    @media (max-width 768px)
      font-size 2rem
  &__ps
    font-family 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif
    font-size 1.5rem
    color #f43737
.content
  padding-top 4rem
  padding-bottom 4rem
</style>
