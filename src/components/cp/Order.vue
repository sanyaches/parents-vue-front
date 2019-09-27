<template lang="pug">
  .order(:class="[paid ? 'order--paid' : 'order--wait']")
    .order__wrap
      .order__id {{ '#' + order_id }}
      .order__title {{ title }} <br>
        .order__more(@click="moreToggle") {{ descriptionShow ? 'Скрыть' : 'Подробнее' }}
      .order__price {{ price }}
        span.order__price-rub ₽
      .order__pay(:class="[paid ? 'order__pay--paid' : 'order__pay--wait']", @click="payOrder") {{ payText }}
    div(v-if="descriptionShow")
      VueMarkdown.order__content.cnt(:source="description")
      .order__total-price Общая сумма сборов: <b>{{ tallage_price }}</b>
        span.order__price-rub ₽
</template>

<script>
import VueMarkdown from 'vue-markdown'

export default {
  props: ['paid','title','price', 'order_id', 'description', 'tallage_price'],
  data () {
    return {
      payText: this.paid ? 'Оплачено' : 'Оплатить',
      descriptionShow: false
    }
  },
  methods: {
    payOrder: function () {
      this.$emit('pay');
    },
    moreToggle: function () {
      this.descriptionShow = !this.descriptionShow
    }
  },
  components: {
    VueMarkdown
  }
}
</script>

<style lang="stylus">
.order
  background #f9f9f9
  border-left 2px solid
  &--wait
    border-color #6D37F4
  &--paid
    border-color #ADDB31
  &+&
    margin-top 40px
  &__wrap
    padding 0 0 0 20px
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
      padding-bottom 10px
      padding-left 0
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
      justify-content flex-start
    &-rub
      padding-left 5px
      color #6D37F4
      font-weight 400
  &__pay
    min-width 175px
    text-align center
    padding 20px
    transition .2s
    display flex
    justify-content center
    align-items center
    @media (max-width 768px)
      margin-right 20px
      margin-bottom 20px
    &--wait
      background #6D37F4
      color #fff
      cursor pointer
      &:hover
        background darken(#6D37f4, 10%)
    &--paid
      background #E5E5E5
  &__content
    margin-top 20px
    padding 0 20px 20px
    border-top 1px solid #e5e5e5
  &__total-price
    padding 0 20px 40px 20px
    font-size 1.2rem
</style>
