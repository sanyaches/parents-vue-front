<template lang="pug">
  .cp
    .cp__mw.mw
      .cp__content
        .cp__content-wrap
          div(v-if="meRole == 2")
            .order-error(v-if="payError") Ошибка
            .order-success(v-if="paySuccess.on", v-html="paySuccess.text")
            .order-none(v-if="ordersWait.length == 0 && ordersPaid.length == 0") Счетов ещё нет
            .order-table(v-if="ordersWait.length > 0")
              .order-table__id
              .order-table__name На что
              .order-table__price Сколько
            order(v-for="order in ordersWait", :title="order.tallage.title", :tallage_price="order.tallage.price", :price="order.price", :order_id="order.id", :description="order.tallage.description", :key="order.id", @pay="getOrderToPay(order.id)")
            .cp__hr(v-if="ordersPaid.length > 0")
              span.cp__hr-text Оплачено
            order(v-for="order in ordersPaid", :title="order.tallage.title", :tallage_price="order.tallage.price", :price="order.price", :order_id="order.id", :description="order.tallage.description", :key="order.id", :paid="true")
          kurator(v-if="meRole == 12")
          //- order(:title="Название" :price="15", :order_id="1", :description="описание")
      .cp__aside
        .cp__aside-wrap
          .cp__avatar(v-if="photo", :style="'background-image:url(https://stark-mountain-93246.herokuapp.com' + photo + ')'")
          .cp__avatar(v-else) <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="cp__avatar-no"><path fill="currentColor" d="M324.3 64c3.3 0 6.3 2.1 7.5 5.2l22.1 58.8H464c8.8 0 16 7.2 16 16v288c0 8.8-7.2 16-16 16H48c-8.8 0-16-7.2-16-16V144c0-8.8 7.2-16 16-16h110.2l20.1-53.6c2.3-6.2 8.3-10.4 15-10.4h131m0-32h-131c-20 0-37.9 12.4-44.9 31.1L136 96H48c-26.5 0-48 21.5-48 48v288c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V144c0-26.5-21.5-48-48-48h-88l-14.3-38c-5.8-15.7-20.7-26-37.4-26zM256 408c-66.2 0-120-53.8-120-120s53.8-120 120-120 120 53.8 120 120-53.8 120-120 120zm0-208c-48.5 0-88 39.5-88 88s39.5 88 88 88 88-39.5 88-88-39.5-88-88-88z" class=""></path></svg>
          .cp__io {{ profile.name }} {{ profile.patronymic }}
          .cp__f {{ profile.family }}
          div(v-if="meRole == 2")
            .cp__hr
              span.cp__hr-text Информация об оплате {{  }}
            .cp__confirm(v-if="ordersWait.length > 0")
              img.cp__confirm-i(src="@/assets/icon/no.svg")
              .cp__confirm-text Неоплаченных счетов:
              .cp__confirm-count {{ ordersWait.length }}
            .cp__confirm(v-if="ordersPaid.length > 0")
              img.cp__confirm-i(src="@/assets/icon/ok.svg")
              .cp__confirm-text Оплаченных счетов:
              .cp__confirm-count {{ ordersPaid.length }}
            .cp__total(v-if="ordersWait.length > 0")
              .cp__total-text Общая сумма долга
              .cp__total-num {{ totalPriceFunc }} <span class="cp__total-rub">₽</span>
            .cp__total(v-else)
              .cp__total-text Долгов нет
</template>

<script>
import axios from 'axios'
import order from './cp/order'
import kurator from './cp/kurator'

export default {
  data () {
    return {
      token: localStorage.getItem('user-token'),
      profile: JSON.parse(localStorage.getItem('user-profile')),
      photo: false,
      orders: [],
      meId: false,
      meRole: false,
      payId: 0,
      payInfo: false,
      payError: false,
      paySuccess: {
        on: false,
        text: 'Успешно'
      }
    }
  },
  metaInfo: {
    title: 'Личный кабинет – «Родители & Дети»',
  },
  mounted: function () {
    this.getUserInfo() // получаем информацию о пользователе
    this.getMeId()
  },
  computed: {
    ordersPaid: function () {
      return this.orders.filter(function (order) {
        return order.paid == true
      })
    },
    ordersWait: function () {
      return this.orders.filter(function (order) {
        return order.paid != true
      })
    },
    totalPriceFunc: function () {
      return this.ordersWait.reduce((s, i) => s = s + i.price, 0);
    }
  },
  methods: {
    getOrderToPay (orderId) {
      this.payId = orderId;
      axios({
        url: 'https://stark-mountain-93246.herokuapp.com/graphql',
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        method: 'post',
        data: {
          query: `
            {
              order(id: "${orderId}") {
                id
                user{
                  id
                }
                paid
              }
            }
          `
        }
      }).then(result => {
        this.payInfo = result.data.data.order;
        if (this.payInfo) {
          console.log('Счёт существует')
          this.getMeId() // обновляем переменную с ИД пользователя
          if (this.meId == +this.payInfo.user.id && !this.payInfo.paid) {
            this.payError = false // убираем ошибку
            console.log('ID пользователя совпадает, счёт ожидает оплаты')
            this.orderFinallyPay()
          } else {
            this.paySuccess.on = false // убираем сообщение об успехе
            this.payError = true // ставим ошибку
            console.log('ID пользователя не совпадает или счёт уже оплачен')
          }
        } else {
          console.log('Ошибка операции со счётом')
        }
      })
    },
    orderFinallyPay() {
      axios({
        url: 'https://stark-mountain-93246.herokuapp.com/graphql',
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        method: 'post',
        data: {
          query: `
            mutation {
              updateOrder(input: {
                where: {
                  id: "${this.payId}"
                },
                data: {
                  paid: true
                }
              }) {
                order {
                  paid
                }
              }
            }
          `
        }
      }).then(result => {
        console.log('Счёт успешно оплачен')
        this.getUserInfo() // обновляем список счетов
        this.paySuccess.on = true // включаем сообщение об успехе
        this.paySuccess.text = `Счёт #${this.payId} успешно оплачен`
      })
    },
    getUserInfo () {
      axios({
        url: 'https://stark-mountain-93246.herokuapp.com/graphql',
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        method: 'post',
        data: {
          query: `
            {
              user(id: "${this.profile.id}") {
                role {
                  id
                }
                photo {
                  url
                }
                orders(sort: "id:desc") {
                  id
                  paid
                  price
                  tallage{
                    title
                    description
                    price
                  }
                }
              }
            }
          `
        }
      }).then((result) => {
        if (result.data.data.user.photo != null) {
          this.photo = result.data.data.user.photo.url
        }
        if (result.data.data.user.orders) this.orders = result.data.data.user.orders
        if (result.data.data.user.role.id) this.meRole = result.data.data.user.role.id
      })
    },
    getMeId () {
      axios.get('https://stark-mountain-93246.herokuapp.com/users/me' ,{
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then((result) => {
        this.meId = result.data.id
      })
    }
  },
  components: {
    order,
    kurator
  }
}
</script>

<style lang="stylus">
.order-success
  background #f9fef6
  padding 20px 10px 20px 20px
  border-left 2px solid #addb31
  color: #023c0a
  text-align center

.order-error
  background #fef6f6
  padding 20px 10px 20px 20px
  border-left 2px solid #f43737
  color: #710000;
  text-align center

.order-table
  display flex
  padding 0 0 0 20px
  padding-right 175px
  color rgba(60,60,60,.7)
  margin-bottom 10px
  @media (max-width 768px)
    display none
  &__id
    width 40px
    padding 20px 10px 20px 0
    display flex
    align-items center
  &__name
    display flex
    align-items center
    padding 20px 10px
    flex 1
  &__price
    display flex
    align-items center
    justify-content center
    text-align center
    padding 20px 10px
    white-space nowrap
    text-align center
    width 150px

.order-none
  color rgba(60,60,60,.7)
  display flex
  text-align center
  justify-content center
  align-items center
  padding 80px 0

.cp
  padding-top 4rem
  padding-bottom 8rem
  @media (max-width 768px)
    padding-top 0
    padding-bottom 4rem
  &__mw
    display grid
    grid-template-columns 2fr 1fr
    grid-gap 2rem
    @media (max-width 768px)
      display flex
      flex-direction: column-reverse;
      padding-left 0
      padding-right 0
  &__content-wrap
    background #ffffff
    box-shadow 0px 15px 35px rgba(0, 0, 0, 0.05)
    padding 20px
  &__aside-wrap
    position sticky
    top 20px
    background #ffffff
    box-shadow 0px 15px 35px rgba(0, 0, 0, 0.05)
    padding 3rem 1rem
    text-align center
  &__avatar
    width 150px
    height 150px
    border-radius 50%
    background-color #f5f5f5
    background-size cover
    background-position center
    margin 0 auto 1rem
    display flex
    justify-content center
    align-items center
    color #d0d0d0
    &-no
      height 70px
  &__io
    font-size 1.5rem
  &__f
    font-size 2rem
    font-weight 600
  &__hr
    margin-top 2rem
    margin-bottom 2rem
    position relative
    text-align center
    &:before
      content ''
      border-top 1px solid #e5e5e5
      width 100%
      display block
      position absolute
      top calc(50% + 1px)
    &-text
      padding 0 1rem
      position relative
      background #ffffff
  &__confirm
    display flex
    line-height 26px
    margin 1rem
    &-i
      margin-right .5rem
    &-text
      margin-right .5rem
    &-count
      font-weight 600
  &__total
    background #f9f9f9
    margin 2rem -1rem -3rem
    padding 1rem 1rem 3rem
    &-text
      font-weight 600
    &-num
      font-size 2.4rem
      font-weight 800
    &-rub
      color #7672d9
      font-weight 400
</style>
