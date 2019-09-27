<template lang="pug">
  footer.footer
    .mw
      .footer__wrap
        .footer__col
          img.footer__logo(src="@/assets/image/logo-white.svg")
        .footer__col
          .footer__title Меню
          router-link.footer__link(to='/') Главная
          router-link.footer__link(to='/client') Личный кабинет
          router-link.footer__link(to='/news/1') Новости
          router-link.footer__link(to='/about') О нас
        .footer__col
          .footer__title Связаться с нами
          .footer__link <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M30.25 27.5096C30.2475 27.8707 30.103 28.2164 29.8478 28.4718C29.5926 28.7273 29.2471 28.8721 28.886 28.875H4.114C3.75212 28.8746 3.40518 28.7306 3.14942 28.4746C2.89366 28.2186 2.75 27.8715 2.75 27.5096V26.125H27.5V10.0375L16.5 19.9375L2.75 7.5625V5.5C2.75 5.13533 2.89487 4.78559 3.15273 4.52773C3.41059 4.26987 3.76033 4.125 4.125 4.125H28.875C29.2397 4.125 29.5894 4.26987 29.8473 4.52773C30.1051 4.78559 30.25 5.13533 30.25 5.5V27.5096ZM6.09675 6.875L16.5 16.2388L26.9032 6.875H6.09675ZM0 20.625H11V23.375H0V20.625ZM0 13.75H6.875V16.5H0V13.75Z" fill="#6D37F4"/></svg> <a href="mailto:mail@parents.ru">mail@parents.ru</a>
          .footer__title Социальные сети
            .footer__soc
              img.footer__i(src="@/assets/icon/instagram.svg")
              img.footer__i(src="@/assets/icon/youtube.svg")
              img.footer__i(src="@/assets/icon/vk.svg")
              img.footer__i(src="@/assets/icon/facebook.svg")
              img.footer__i(src="@/assets/icon/twitter.svg")
        .footer__col
          .footer__title Правовая и техническая информация
          .footer__link Об использовании информации сайта
          .footer__link О портале
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

    a
      text-decoration: none
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

    a
      margin-left: 1rem
      color: inherit

  &__icon
    height: 18px;
    margin-right: 10px;
    color #6D37F4

  &__soc
    margin-top 1rem
    display flex

  &__i
    height 32px
    border-radius: 3px;

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
