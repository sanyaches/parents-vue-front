<template lang="pug">
  #lastnews
    .lastnews
      .new(v-for="item in query")
        .new__date_image {{ item.create_date }}
        .new__wrap
          .new__wrap_finger
          router-link.new__link(:to="'/new/' + item.id")
            .new__bg(:style="'background-image: url(https://parents-children.herokuapp.com' + item.image.url + ')'")
          h3.new__title
            router-link.new__a(:to="'/new/' + item.id") {{ item.title }}
        .new__date {{ item.created_at }}
    .lastnews-all
      router-link.lastnews-all__button.button(to="/news/1") Читать все
</template>

<style lang="stylus">
@import url('https://fonts.googleapis.com/css?family=Rubik&display=swap')
.lastnews
  display grid
  grid-row-gap 4rem
  grid-column-gap 1rem
  grid-template-columns 1fr 1fr 1fr
  @media (max-width 768px)
    grid-template-columns 1fr 1fr
  &-all
    margin-top 6rem
    margin-bottom 4rem
    text-align center
    &__button
      display inline-block
      text-decoration none
.new
  position relative
  display flex
  flex-direction column
  &__link
    z-index:1000
  &__date_image
    position: absolute;
    font-family: Rubik, sans-serif;
    top: 5%;
    text-align: center
    padding: 3% 7%;
    font-weight: 500;
    background-color white;
    z-index: 10;
  &__bg
    transition all 0.5s ease
    position relative
    padding-top 80%
    background-size cover
    background-position center
    z-index: -2
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
    font-family Rubik, sans-serif
    color rgba(#3C3C3C, .7)
    margin-top .7rem
    font-size .9rem
    @media (max-width 768px)
      font-size .8rem
  &__title
    font-family 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif
    font-size 1.2rem
    margin-top 1.5rem
    @media (max-width 768px)
      font-size 1rem
      margin-top .5rem
  &__wrap:hover
    .new__wrap_finger
      display: block;
      width: 100%;
      height: 80%
      background: rgba(109, 55, 244, 0.5) url("../../assets/icon/finger.png") no-repeat center
      @media (max-width:1200px)
        height: 75%
      @media (max-width:980px)
        background: url("../../assets/icon/finger.png") no-repeat center
      @media (max-width: 768px)
        background: url("../../assets/icon/finger.png") no-repeat 50% 35%
        background-size 60%
        height: 80%
      @media (max-width: 480px)
        background: none
    .new__bg
      filter blur(5px)
</style>


<script>
import { mapState } from 'vuex';
import moment from 'moment'
const axios = require("axios");

export default {
  data() {
    return {
      query: '',
      searchPhrase: this.$store.state.searchPhrase,

    }
  },
  created: function () {
    axios({
        url: 'https://parents-children.herokuapp.com/graphql',
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
        this.query = result.data;
        this.query = this.query.data.messes;
        this.query.forEach((item, i) => {
          let a = moment(this.query[i].created_at);
          // console.log(a);
          this.query[i].created_at = a.locale('ru').format('Do MMMM YYYY, h:mm');
          this.query[i].create_date = a.locale('ru').format('D MMMM');
        });
        // console.log(this.query);
    })
  },
}
</script>
