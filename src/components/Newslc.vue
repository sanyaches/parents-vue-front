<template lang="pug">
  .newws
    .neww(v-for="item in query")
      .neww__title-wrap
        .neww__date {{ item.create_date }}
        h3.neww__title
          router-link.neww__a(:to="'/new/' + item.id") {{ item.title }}
      .neww__desc {{ item.description }}
</template>

<script>
import moment from 'moment'
const axios = require("axios");

export default {
  name: "Newslc",
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
        url: 'http://localhost:1337/graphql',
        method: 'post',
        data: {
          query: `
          query {
            messes(limit:10, sort: "created_at:desc") {
              id
              title
              description
              created_at
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

<style scoped lang="stylus">
.newws
  padding-top: 1rem
  .neww
    padding-right: 4rem
    padding-left: .5rem
    &:not(:first-child)
      margin-top: 2rem
    &__title-wrap
      display: flex
      flex-direction: row
      justify-content: space-between
      align-items: center

    &__date
      background: #6D37F4
      color: white
      white-space: nowrap;
      padding: .55rem .65rem
      box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2)
      border-radius: 5px 5px 0 5px
      font-family: "Rubik";
      font-style: normal;
      font-weight: 600;
      font-size: .7rem;
      line-height: 150%;
    &__title
      font-family: 'Rubik';
      font-style: normal;
      font-weight: bold;
      font-size: 1rem;
      line-height: 120%;
      display: flex;
      align-items: center;
      color: #37445E;
      margin-left: 1rem
    &__a
      text-decoration: none
      color inherit

    &__desc
      margin-top: 5%
      padding-left: .1rem
      font-family: 'Rubik';
      font-style: normal;
      font-weight: normal;
      font-size: .75rem;
      line-height: 150%;
      display: flex;
      align-items: center;
      color: #909CB4;
</style>
