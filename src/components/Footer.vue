<template lang="pug">
  footer.footer
    .mw
      .footer__wrap
        .footer__col
          img.footer__logo(src="@/assets/image/logo-white.svg")
        .footer__col
          .footer__title Меню
          .footer__link Главная
          .footer__link Новости
          .footer__link О нас
          .footer__link Личный кабинет
        .footer__col
          .footer__title Связаться с нами
          .footer__link <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="envelope" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="footer__icon"><path fill="currentColor" d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z" class=""></path></svg> mail@parents.ru
          .footer__title Социальные сети
            .footer__soc
              img.footer__i(src="@/assets/icon/youtube.svg")
              img.footer__i(src="@/assets/icon/vk.svg")
              img.footer__i(src="@/assets/icon/facebook.svg")
              img.footer__i(src="@/assets/icon/twitter.svg")
        .footer__col
          .footer__title Правовая и техническая информация
          .footer__link Об использовании информации сайта
      .footer__by
        a(href='https://bsnsweb.ru/', title='Сайты, продвижение, реклама')
          picture
            source(srcset='https://bsnsweb.com/logo/bsnsweb-logo-white.webp')
            img.footer__by--img(src='https://bsnsweb.com/logo/bsnsweb-logo-white.webp', alt='Логотип Бизнес Веб. Сайты, продвижение, реклама')
</template>

<script>
export default {
  
}
</script>

<style lang="stylus">
.footer
  background #0D061F
  padding 3rem 0 120px
  &__wrap
    display flex
    @media (max-width 900px)
      flex-direction column
  &__col
    flex 1
    @media (max-width 900px)
      &:first-child
        display none
      & + &
        margin-top 2rem
  &__title
    text-transform uppercase
    color #fff
    font-family 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif
    font-size 1.1rem
  &__link
    color #909CB4
    margin-top 1rem
    font-size .9rem
    display flex
    align-items center
    & + .footer__title
      margin-top 2rem
  &__icon
    height: 18px;
    margin-right: 10px;
    color #6D37F4
  &__soc
    margin-top 1rem
    display flex
  &__i
    height 32px
    & + &
      margin-left 0.5rem
  &__logo
    height 80px
  &__by
    margin-top 2rem
    padding-top 2rem
    border-top 1px solid rgba(#fff, .15)
    &--img
      height 19px
      display block
      margin 0 auto
</style>
