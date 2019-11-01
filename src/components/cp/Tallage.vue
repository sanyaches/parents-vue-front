<template lang="pug">
  .tallage(:class="[remainPrice < price ? 'tallage--wait' : 'tallage--paid']")
    .tallage__wrap(v-if="delStart == 0")
      .tallage__id {{ '#' + tallage_id }}
      .tallage__title {{ title }}<br><br><b>{{ classe + ', ' + school }}</b><br>
        .tallage__more(@click="moreToggle") {{ descriptionShow ? 'Скрыть' : 'Подробнее' }}
      .tallage__price(v-if="remainPrice < price") {{ remainPrice + ' из ' + price }}
        span.tallage__price-rub ₽
      .tallage__price(v-else) {{ 'Собрано ' + price }}
        span.tallage__price-rub ₽
        | <img class="cp__confirm-i" src="@/assets/icon/ok.svg" style="width:26;height:26px;margin-left:10px;">
    div(v-if="descriptionShow && delStart == 0")
      VueMarkdown.tallage__content.cnt(:source="description")
      .tallage__parent
        .elems(v-for="(item, index) in orders")
          .elems__id {{ '#' + item.id }}
          .elems__name {{ item.user.family + ' ' + item.user.name + ' ' + item.user.patronymic }} 
          .elems__price(v-if="item.paid !== true") не оплачено <b>{{ item.price }}</b> ₽
          .elems__price.elems__price--ok(v-else) <b>оплачено</b>
          .elems__pay(v-if="item.paid !== true" @click="payOrder(item.id)") Сдал
      .tallage__block
        span.tallage__del(@click="delShow = !delShow") Удалить счета
        .tallage__del-info(v-show="delShow") Для удаления всех счетов напишите название сборов «{{ title }}»
        .tallage__del-inputs(v-show="delShow")
          .input
            input#del.input__text.input__text--white(required, v-model="del", type="text")
            label.input__label(for='title') Название сборов <span class="red">*</span>
          .tallage__del-t(v-show="del == title") Восстановить данные о счетах будет невозможно. Вы уверены, что хотите удалить счета? <span class="tallage__del-yes" @click="deleteTallages(tallage_id)">Да!</span>
    .tallage__dels(v-if="delStart == 1")
      .wait
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="wait__spin"><path fill="currentColor" d="M288 32c0 17.673-14.327 32-32 32s-32-14.327-32-32 14.327-32 32-32 32 14.327 32 32zm-32 416c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32zm256-192c0-17.673-14.327-32-32-32s-32 14.327-32 32 14.327 32 32 32 32-14.327 32-32zm-448 0c0-17.673-14.327-32-32-32S0 238.327 0 256s14.327 32 32 32 32-14.327 32-32zm33.608 126.392c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32zm316.784 0c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32zM97.608 65.608c-17.673 0-32 14.327-32 32 0 17.673 14.327 32 32 32s32-14.327 32-32c0-17.673-14.327-32-32-32z"></path></svg>
        .wait__text Пожалуйста, подождите..
    .tallage__dels(v-if="delStart == 2 && delOrders >= orders.length") Счета удалены
</template>

<script>
import axios from 'axios'
import VueMarkdown from 'vue-markdown'

export default {
  props: ['paid','title','price', 'tallage_id', 'description', 'orders', 'school', 'classe'],
  data () {
    return {
      token: localStorage.getItem('user-token'),
      payText: this.paid ? 'Оплачено' : 'Оплатить',
      descriptionShow: false,
      delShow: false,
      del: '',
      delOrders: 0,
      delStart: 0,
    }
  },
  computed: {
    paysPrice: function () {
      return this.orders.filter(function (order) {
        return order.paid == true
      })
    },
    remainPrice: function () {
      return this.paysPrice.reduce((s, i) => s = s + i.price, 0);
    }
  },
  methods: {
    payTallage: function () {
      this.$emit('pay');
    },
    moreToggle: function () {
      this.descriptionShow = !this.descriptionShow
    },
    deleteTallages: function (id) {
      let talId = id;
      this.delStart = 1;
      axios({
        url: 'http://localhost:1337/graphql',
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        method: 'post',
        data: {
          query: `
            mutation {
              deleteTallage(input: {
                where: {
                  id: ${talId}
                }
              }) {
                tallage {
                  id
                }
              }
            }
          `
        }
      }).then(result => {
        console.log('Сбор удалён');
        this.deleteOrders(this.orders[0].id);
      })
    },
    deleteOrders: function (orderId) {
      let orderI = orderId;
      axios({
        url: 'http://localhost:1337/graphql',
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        method: 'post',
        data: {
          query: `
            mutation {
              deleteOrder(input: { where: { id: ${orderI} } }) {
                order {
                  id
                }
              }
            }
          `
        }
      }).then(result => {
        console.log('Счет удалён');
        this.delOrders++
        if (this.delOrders < this.orders.length) {
          this.deleteOrders(this.orders[this.delOrders].id);
        } else {
          this.delStart = 2;
          console.log('Все счета удалены')
        }
      })
    },
    payOrder: function (orderId) {
      axios({
        url: 'http://localhost:1337/graphql',
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        method: 'post',
        data: {
          query: `
            mutation {
              updateOrder(input: {
                where: {
                  id: "${orderId}"
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
        console.log('Счет успешно оплачен');
        console.log(result.data.data.order);
        this.$emit('update');
      })
      .catch(error => {
        console.log('Ошибка погашения');
        console.log(error);
      })
    }
  },
  components: {
    VueMarkdown
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

.tallage
  background #f9f9f9
  border-left 2px solid
  &--wait
    border-color #6D37F4
  &--paid
    border-color #ADDB31
  &__block
    padding 0 20px 20px
    text-align right
  &__dels
    padding 20px
  &__del
    color #ff0000
    cursor pointer
    &-info
      font-size .8rem
      margin-top 10px
      margin-left 20px
      margin-bottom 10px
      text-align left
    &-t
      margin-top 10px
      font-weight 600
      background #fef6f6
      color #710000
      padding 20px
      line-height 1.5
      text-align center
    &-yes
      background #ce0c0c
      color #fff
      padding 1px 6px
      border-radius 4px
      border 1px solid #7b1515
      cursor pointer
  &+&
    margin-top 40px
  &__parent
    padding 20px

  &__wrap
    padding 0 20px 0 20px
    display flex
    @media (max-width 768px)
      flex-direction column
  &__id
    width 40px
    padding 20px 10px 20px 0
    font-size .8rem
    display flex
    align-items center
    color rgba(60,60,60,0.7)
    @media (max-width 768px)
      padding-bottom 10px
  &__title
    padding 20px 10px
    flex 1
    @media (max-width 768px)
      padding-top 0
      padding-left 0
      padding-bottom 10px
  &__more
    display inline-block
    color rgba(60,60,60,0.7)
    margin-top 10px
    padding-bottom 1px
    border-bottom 1px dashed
    font-size .9rem
    cursor pointer
    transition .2s
    &:hover
      color rgba(60,60,60,0.9)
  &__price
    display flex
    align-items center
    justify-content center
    text-align center
    padding 20px 10px
    font-weight 600
    white-space nowrap
    text-align center
    width 150px
    @media (max-width 768px)
      padding-top 0
      padding-left 0
      text-align-last left
      justify-content flex-start
    &-rub
      padding-left 5px
      color #6D37F4
      font-weight 400
  &__content
    margin-top 20px
    padding 0 20px 20px
    border-top 1px solid #e5e5e5
</style>
