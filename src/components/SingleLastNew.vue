<template lang="pug">
  #singlelastnew
    router-link.singlelastnew(v-for="item in query", :to="'/new/' + item.id", :key="item.id")
      .singlelastnew__title {{ item.title }}
      .singlelastnew__date {{ item.created_at }}
    Social
</template>

<style lang="stylus">
  @import url('https://fonts.googleapis.com/css?family=Rubik&display=swap')
.singlelastnew
  border-left 1px solid #6d37f4
  padding-left 1rem
  padding-bottom 2rem
  margin-left 6px
  position relative
  display block
  color inherit
  text-decoration none
  &.router-link-exact-active
    .singlelastnew__title
      box-decoration-break clone
      background #6d37f4
      padding 0 5px
      color #fff
  &:not(.router-link-exact-active):hover
    color #6d37f4
  &:before
    content ''
    display block
    width 12px
    height 12px
    background #6d37f4
    position absolute
    top 0
    left -12px
    border 6px solid #fff
  &:last-child
    border-color #fff
  &__title
    font-family Rubik, sans-serif
    margin-bottom .5rem
    display inline
  &__date
    color rgba(#3C3C3C, .7)
    font-size .7rem
    margin-top: .8rem;
    font-family: Rubik, sans-serif
</style>

<script>
import moment from 'moment'
import Social from "./social/Social";
const axios = require("axios")

export default {
  components: {Social},
  data() {
    return {
      query: ''
    }
  },
  created: function () {
    axios({
      url: 'http://localhost:1337/graphql',
      method: 'post',
      data: {
        query: `
          query {
            messes(limit:6, sort: "created_at:desc") {
              id
              title
              created_at
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
