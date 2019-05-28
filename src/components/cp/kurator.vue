<template lang="pug">
  .kurator
    .kurator__tab
      .kurator__a(@click="tab = 1", :class="{ 'kurator__a--active' : tab == 1 }") Выставление счёта 
      .kurator__a(@click="tab = 2", :class="{ 'kurator__a--active' : tab == 2 }") Все счета
    .kurator__content(v-if="tab == 1")
      .block(v-if="!select.school")
        .block__title Выберите школу
        .elems(v-for="item in schools")
          .elems__id {{ '#' + item.id }}
          .elems__name {{ item.name }}
          .elems__select(@click="getClasses(item.id)") Выбрать
      .block(v-if="select.school && !select.class")
        .block__link(@click="backToSchool()") ← к выбору школы
        .block__title Выберите класс
        .elems(v-for="item in classes")
          .elems__id {{ '#' + item.id }}
          .elems__name {{ item.name }}
          .elems__select(@click="getOneClass(item.id)") Выбрать
      .block(v-if="select.school && select.class && !creating.start")
        .block__link(@click="backToClasses()") ← к выбору класса
        div(v-if="parents.length > 0")
          .block__title Введите данные для выставления счёта родителям «{{ className }}»
          .input
            input#title.input__text.input__text--white(required, v-model="tallage.title", type="text")
            label.input__label(for='title') На какие нужды? <span class="red">*</span>
          .input
            textarea#description.input__text.input__text--white(required, v-model="tallage.description", type="text")
            label.input__label(for='description') Краткое описание (необязательно)
          div(v-if="tallage.title")
            input.kurator__price(type="number", placeholder="Общая сумма", v-model.number="select.totalPrice")
            .kurator__rub ₽
            .kurator__parents
              .elems(v-for="item in parents")
                .elems__id {{ '#' + item.id }}
                .elems__name {{ item.family + ' ' + item.name + ' ' + item.patronymic }} 
                .elems__price <b>{{ onePrice }}</b> ₽
            .button.button--c(v-if="onePrice", @click="createTallage()") Выставить счёт
        .block__title(v-else) За этим классом никто не закреплён
      .block(v-if="creating.start")
        div(v-if="creating.tallage && creating.orders == parents.length")
          .block__title Все счета выставлены ({{ creating.orders }})
          .button.button--c(@click="clearVars()") Выставить ещё счёт
        div(v-else)
          .wait
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="wait__spin"><path fill="currentColor" d="M288 32c0 17.673-14.327 32-32 32s-32-14.327-32-32 14.327-32 32-32 32 14.327 32 32zm-32 416c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32zm256-192c0-17.673-14.327-32-32-32s-32 14.327-32 32 14.327 32 32 32 32-14.327 32-32zm-448 0c0-17.673-14.327-32-32-32S0 238.327 0 256s14.327 32 32 32 32-14.327 32-32zm33.608 126.392c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32zm316.784 0c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32zM97.608 65.608c-17.673 0-32 14.327-32 32 0 17.673 14.327 32 32 32s32-14.327 32-32c0-17.673-14.327-32-32-32z"></path></svg>
            .wait__text Пожалуйста, подождите..
    .kurator__content(v-if="tab == 2")
      tallage(v-for="(item, index) in tallages", :tallage_id="item.id", :title="item.title", :description="item.description", :price="item.price", :school="item.school.name", :classe="item.class.name", :orders="tallages[index].orders", :key="item.id")
</template>

<script>
import axios from 'axios'
import tallage from './tallage'

export default {
  data () {
    return {
      token: localStorage.getItem('user-token'),
      tab: 1,
      schools: [],
      classes: [],
      className: '',
      parents: [],
      select: {
        school: '',
        class: '',
        totalPrice: '',
      },
      tallage: {
        title: '',
        description: '',
      },
      creating: {
        start: false,
        tallage: false,
        orders: 0
      },
      tallages: [],
      totalCreate: false,
    }
  },
  computed: {
    onePrice: function () {
      return Math.ceil(this.select.totalPrice / this.parents.length)
    },
    refreshTabs: function () {
      if (this.creating.start) {
        return this.getTallages()
      }
    }
  },
  watch: {
    totalCreate: function () {
      this.getTallages()
    }
  },
  mounted: function () {
    this.getSchools()
    this.getTallages()
  },
  methods: {
    clearVars () {
      this.schools = [];
      this.classes = [];
      this.className = '';
      this.parents = [];
      this.select.school = '';
      this.select.class = '';
      this.select.totalPrice = '';
      this.tallage.title = '';
      this.tallage.description = '';
      this.creating.start = false;
      this.creating.tallage = false;
      this.creating.orders = 0;
      this.totalCreate = false;
      this.getSchools()
    },
    getSchools () {
      axios({
        url: 'http://localhost:1337/graphql',
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        method: 'post',
        data: {
          query: `
            {
              schools(sort: "id:desc") {
                id
                name
              }
            }
          `
        }
      }).then(result => {
        this.schools = result.data.data.schools;
      })
    },
    getClasses (id) {
      let schoolId = id;
      this.select.school = schoolId;
      axios({
        url: 'http://localhost:1337/graphql',
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        method: 'post',
        data: {
          query: `
            {
              school(id: ${schoolId}) {
                classes {
                  id
                  name
                }
              }
            }
          `
        }
      }).then(result => {
        this.classes = result.data.data.school.classes;
      })
    },
    getOneClass (id) {
      let classId = id;
      this.select.class = classId;
      axios({
        url: 'http://localhost:1337/graphql',
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        method: 'post',
        data: {
          query: `
            {
              class(id: ${classId}) {
                name
                users {
                  id
                  name
                  family
                  patronymic
                  photo {
                    url
                  }
                }
              }
            }
          `
        }
      }).then(result => {
        this.className = result.data.data.class.name;
        this.parents = result.data.data.class.users;
      })
    },
    createTallage () {
      let tallageId = '';
      this.creating.start = true;
      window.scrollTo(0, 0);
      axios({
        url: 'http://localhost:1337/graphql',
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        method: 'post',
        data: {
          query: `
            mutation {
              createTallage(input: {
                data: {
                  title: "${this.tallage.title}"
                  description: "${this.tallage.description}"
                  price: ${this.select.totalPrice}
                  school: ${this.select.school}
                  class: ${this.select.class}
                }
              }) {
                tallage {
                  id
                  title
                  price
                  school {
                    id
                  }
                  class {
                    id
                  }
                }
              }
            }
          `
        }
      }).then(result => {
        console.log('Общий счёт создан');
        tallageId = result.data.data.createTallage.tallage.id;
        this.creating.tallage = true;
        // for (let index = 0; index < this.parents.length; index++) {
        //   console.log(this.parents[index].id)
        //   console.log(tallageId)
        //   console.log(this.onePrice)
        //   this.createOrder(this.parents[index].id, tallageId, this.onePrice)
        // }
        this.createOrder(this.parents[0].id, tallageId, this.onePrice)
      })
    },
    createOrder (userId, tallageId, onePrice) {
      let uId = userId,
          tId = tallageId,
          oPrice = onePrice;
      axios({
        url: 'http://localhost:1337/graphql',
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        method: 'post',
        data: {
          query: `
            mutation {
              createOrder(input: { 
                data: { 
                  user: ${uId}, 
                  tallage: ${tId}, 
                  price: ${oPrice} 
                } 
              }) {
                order {
                  id
                }
              }
            }
          `
        }
      }).then(result => {
        console.log('Индивидуальный счёт создан');
        this.creating.orders++
        if (this.creating.orders != this.parents.length) {
          this.createOrder(this.parents[this.creating.orders].id, tallageId, this.onePrice)
        } else {
          this.totalCreate = true;
        }
      })
    },
    backToSchool () {
      this.select.school = '';
      this.classes = [];
    },
    backToClasses () {
      this.className = '';
      this.select.class = '';
      this.parents = [];
    },
    getTallages () {
      axios({
        url: 'http://localhost:1337/graphql',
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        method: 'post',
        data: {
          query: `
            {
              tallages(sort: "id:desc") {
                id
                title
                description
                price
                school {
                  name
                }
                class {
                  name
                }
                orders {
                  id
                  paid
                  price
                  user {
                    id
                    name
                    family
                    patronymic
                    class {
                      name
                      school {
                        name
                      }
                    } 
                  }
                }
              }
            }
          `
        }
      }).then(result => {
        this.tallages = result.data.data.tallages;
      })
    }
  },
  components: {
    tallage
  }
}
</script>

<style lang="stylus">
.wait
  margin-top 20px
  text-align center
  &__spin
    width 32px
    animation spin .8s infinite linear
  &__text
    margin-top 10px

@keyframes spin
  0%
    transform rotate(0deg)
  50%
    transform rotate(180deg)
  100%
    transform rotate(360deg)

.elems
  display flex
  border-bottom 1px dashed #bdb9c8
  padding 10px
  &__id
    width 40px
    margin-right 10px
    font-size .8rem
    display flex
    align-items center
    color rgba(60,60,60,0.7)
  &__name
    display flex
    justify-content flex-start
    align-items center
    flex 1
  &__select
    text-align center
    width 100%
    max-width 180px
    font-size .9rem
    border 0
    line-height 60px
    background #6D37F4
    padding 0 1rem
    text-transform uppercase
    color #fff
    cursor pointer
    box-shadow 0px 10px 30px rgba(0, 0, 0, 0.15)
    transition .3s
    &:hover
      transform: translateY(2px)
      box-shadow inset 0 -1px 1px rgba(#000, .1), 0px 8px 20px rgba(0, 0, 0, 0.15)
    &:active
      transform translateY(3px)
    @media (max-width 768px)
      font-size 0
      width 60px
      position relative
      display flex
      text-align center
      justify-content center
      align-items center
      &:before
        content '→'
        font-size 1rem
        display block
        position absolute
  &__price
    position relative
    &--ok
      color #42aa00

.kurator
  position relative
  &__tab
    display flex
    margin -20px -20px 20px -20px
  &__a
    flex 1
    text-align center
    background #f5f5f5
    padding 25px
    &:not(.kurator__a--active)
      cursor pointer
    &--active
      background #fff
  &__parents
    margin-top 20px
    margin-bottom 40px
  &__price
    display block
    margin 20px auto 0
    border: 0
    background transparent
    font-size 2.2rem
    text-align center
    color #080024
    font-weight 600
    width 100%
    -moz-appearance:textfield;
    &:-webkit-outer-spin-button, &:-webkit-inner-spin-button
      -webkit-appearance: none;
      margin: 0;
      display none
  &__rub
    font-size 1.8rem
    text-align center
    color #080024
    font-weight 600
</style>
