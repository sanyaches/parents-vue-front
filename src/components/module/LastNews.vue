<template lang="pug">
  #lastnews
    .lastnews
      .new(v-for="item in query")
        .new__wrap
          .new__bg(:style="'background-image: url(https://stark-mountain-93246.herokuapp.com' + item.image.url + ')'")
          h3.new__title
            router-link.new__a(:to="'/new/' + item.id") {{ item.title }}
        .new__date {{ item.created_at }}
    .lastnews-all
      router-link.lastnews-all__button.button(to="/news/1") Читать все
</template>

<style lang="stylus">
.lastnews
  display grid
  grid-row-gap 3rem
  grid-column-gap 1rem
  grid-template-columns 1fr 1fr 1fr
  @media (max-width 768px)
    grid-template-columns 1fr 1fr
  &-all
    margin-top 4rem
    margin-bottom 4rem
    text-align center
    &__button
      display inline-block
      text-decoration none
.new
  position relative
  display flex
  flex-direction column
  &__bg
    position relative
    padding-top 80%
    background-size cover
    background-position center
  &__a
    color inherit
    text-decoration none
    &:hover
      color #6d37f4
  &__wrap
    flex 1
  &__date
    color rgba(#3C3C3C, .7)
    margin-top .7rem
    @media (max-width 768px)
      font-size .8rem
  &__title
    font-family 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif
    font-size 1.2rem
    margin-top 1.5rem
    @media (max-width 768px)
      font-size 1rem
      margin-top .5rem
</style>


<script>
import moment from 'moment'
const axios = require("axios")

export default {
  data() {
    return {
      query: ''
    }
  },
  created: function () {
    axios({
        url: 'https://stark-mountain-93246.herokuapp.com/graphql',
        method: 'post',
        data: {
          query: `
            query {
              messes(limit:6, sort: "created_at:desc") {
                id
                title
                created_at
                image {
                  url
                }
              }
            }
          `
        }
      }).then((result) => {
        this.query = result.data
        this.query = this.query.data.messes
        this.query.forEach((item, i) => {
          let a = moment(this.query[i].created_at)
          this.query[i].created_at = a.locale('ru').format('Do MMMM YYYY, h:mm')
        });
    })
  }
}
</script>
