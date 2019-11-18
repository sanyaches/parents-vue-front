<template lang="pug">
  .news-wrap.mw
    h1.h1-light Все новости
    .news
      .new(v-for="item in query")
        .new__date_image {{ item.create_date }}
        .new__wrap
          .new__wrap_finger
          router-link.new__link(:to="'/new/' + item.id")
            .new__bg(:style="'background-image: url(https://parents-children.herokuapp.com' + item.image.url + ')'")
          h3.new__title
            router-link.new__a(:to="'/new/' + item.id") {{ item.title }}
        .new__date {{ item.created_at }}
    .arrow
      router-link.arrow__link(:to="'/news/' + nextPage", v-if="next")  ← Новые
      .arrow__link.arrow__link--disable(v-else)  ← Новые
      router-link.arrow__link(:to="'/news/' + prevPage", v-if="prev") Старые →
      .arrow__link.arrow__link--disable(v-else) Старые →
</template>

<script>
import moment from 'moment'
const axios = require("axios");

export default {
  data () {
    return {
      query: '',
      page: '',
      newsInPage: 8,
      prev: '',
      next: '',
      prevPage: '',
      nextPage: ''
    }
  },
  metaInfo: {
    title: 'Новости – «Родители & Дети»',
  },
  created: function () {
    this.getPosts()
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
              messes(limit: ${this.newsInPage}, sort: "created_at:desc", start: ${(this.$route.params.id - 1) * this.newsInPage}) {
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
        this.query = result.data;
        this.query = this.query.data.messes;
        this.query.length < this.newsInPage ? this.prev = false : this.prev = true;
        this.nextPage < 1 ? this.next = false : this.next = true;
        this.query.forEach((item, i) => {
          let a = moment(this.query[i].created_at);
          this.query[i].created_at = a.locale('ru').format('Do MMMM YYYY, h:mm');
          this.query[i].create_date = a.locale('ru').format('D MMMM');
        });
      });
      this.page = this.$route.params.id;
      this.prevPage = +this.page + 1;
      this.nextPage = +this.page - 1
    }
  },
  computed: {
    searchPhraseFilter() {
      console.log(this.query);
      return this.query.filter(item => {
        // your logic here
        // of course you can use .map() or .reduce() depending on your business logic
        return item.title === this.searchPhrase
      })
    }
  },
}
</script>

<style lang="stylus">
@import url('https://fonts.googleapis.com/css?family=Rubik&display=swap')
.news
  display grid
  grid-row-gap 4rem
  grid-column-gap 1rem
  grid-template-columns 1fr 1fr 1fr
  @media (max-width 768px)
    grid-template-columns 1fr 1fr
  &-wrap
    padding-top 4rem
    padding-bottom 4rem
    @media (max-width 768px)
      padding-top 2rem
  .new
    position relative
    display flex
    flex-direction column
    &:first-child
      grid-column 1 / 3
      @media (max-width 768px)
        grid-column: 1/3;
        height: 250px;
      .new__bg
        padding-top 0
        height 100%
        &:before
          content ''
          position absolute
          background rgba(#171415, .7)
          top 0
          right 0
          bottom 0
          left 0
      .new__date_image
        display: none
      .new__title
        position absolute
        left 2rem
        right: 2rem;
        bottom 4rem
        color rgba(#fff, 1)
      .new__date
        position absolute
        left 2rem
        bottom 2rem
        color rgba(#fff, 1)
    &__bg
      position relative
      padding-top 80%
      background-size cover
      background-position center
      z-index: -2
      transition all 0.5s ease
    &__a
      color inherit
      text-decoration none
      &:hover
        color #6d37f4
    &__wrap
      flex 1
      position: relative;
      &_finger
        z-index: -1
        display: none
        position: absolute
    &__date
      color rgba(#3C3C3C, .7)
      margin-top .7rem
      font-family: Rubik, sans-serif
      font-size .9rem
      @media (max-width 768px)
        font-size .8rem
    &__date_image
      font-size: 1rem
      position: absolute;
      top: 5%;
      text-align: center
      padding: 3% 7%;
      font-weight: 600;
      background-color white;
      z-index: 10;
      @media (max-width 768px)
        font-size: .7rem
    &__title
      font-family 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif
      font-size 1.2rem
      margin-top 1.5rem
      @media (max-width 768px)
        font-size 1rem
        margin-top .5rem
    &__wrap:hover
      .new__wrap_finger
        display: block
        width: 100%
        height: 80%
        background: rgba(109, 55, 244, 0.5) url("../assets/icon/finger.png") no-repeat center
        @media (max-width:1200px)
          height: 75%
        @media (max-width:980px)
          background: url("../assets/icon/finger.png") no-repeat center
        @media (max-width: 768px)
          background: url("../assets/icon/finger.png") no-repeat 50% 35%
          background-size 60%
          height: 80%
        @media (max-width: 480px)
          height: 56%
      .new__bg
        filter blur(5px)


    &:first-child:hover
      .new__wrap_finger
        height: 100%



</style>
