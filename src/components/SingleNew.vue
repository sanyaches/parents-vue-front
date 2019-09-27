<template lang="pug">
  main.singlenew.mw
    .singlenew__content
      h1.singlenew__title {{ query.title }}
      .singlenew__date <img src="@/assets/icon/clock.svg" class="singlenew__time"> {{ query.created_at }}
      img.singlenew__img(:src="'https://parents-children.herokuapp.com' + query.image.url")
      VueMarkdown.singlenew__desc.cnt(:source="desc") {{ desc }}
    aside.singlenew__aside
      .singlenew__aside-sticky
        .singlenew__aside-title Свежие новости
        SingleLastNew
</template>


<style lang="stylus">
@import url('https://fonts.googleapis.com/css?family=Rubik&display=swap')
.singlenew
  margin-top 4rem
  margin-bottom 8rem
  display grid
  grid-template-columns 3fr 1.5fr
  grid-gap 2rem
  @media (max-width 768px)
    grid-template-columns 1fr
    grid-gap 4rem
    margin-top 2rem
  &__title
    font-size 2rem
    font-family 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif
    border-left 3px solid #6d37f4
    padding-left 1.4rem
    padding-top 2px
    padding-bottom 10px
    @media (max-width 768px)
      padding-left 1.5rem
      font-size 1.4rem
  &__date
    font-size .9rem
    font-family: 'Rubik', sans-serif
    margin-top 2rem
    margin-bottom 2rem
    color rgba(#3C3C3C, .7)
  &__time
    vertical-align -30%
  &__img
    max-width 100%
    margin-bottom 2rem
  &__aside
    @media (max-width 768px)
      border-top 1px solid #f5f5f5
      padding-top 2rem
      position relative
    &-title
      font-size 1.5rem
      font-family 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif
      margin-bottom 2rem
    &-sticky
      position sticky
      top 1rem
  &__desc
    font-family: 'Rubik', sans-serif
    font-weight: 400
    line-height: 160%
    font-size: .9rem
</style>

<script>
import axios from 'axios'
import moment from 'moment'
import VueMarkdown from 'vue-markdown'
import SingleLastNew from './SingleLastNew'

export default {
  data() {
    return {
      query: '',
      desc: ''
    }
  },
  mounted: function () {
    this.getPosts()
  },
  components: {
    VueMarkdown,
    SingleLastNew
  },
  watch: {
    $route () {
      this.getPosts()
    }
  },
  methods: {
    getPosts () {
      axios({
        url: 'https://parents-children.herokuapp.com/graphql',
        method: 'post',
        data: {
          query: `
            query {
              mess(id: "${this.$route.params.id}") {
                title
                description
                created_at
                image {
                  url
                }
              }
            }
          `
        }
      }).then((result) => {
        this.query = result.data.data.mess
        let a = moment(this.query.created_at)
        this.query.created_at = a.locale('ru').format('Do MMMM YYYY, h:mm')
        this.desc = this.query.description
        window.document.title = this.query.title + '– «Родители & Дети»'
      })
    }
  }
}
</script>
