<template lang="pug">
    //- video.auth-video(autoplay='' loop='')
    //-   source(src='@/assets/video/auth.mp4', type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"')
    //-   source(src='@/assets/video/auth.webm', type='video/webm; codecs="vp8, vorbis"')
    .auth-wrap
      .auth
        .auth__error(v-if="onerr") Вы ввели неверные данные. Попробуйте ещё раз.
        form(@submit.prevent="login")
          .input
            input#username.input__text(
              required,
              v-model="username",
              type="text"
            )
            label.input__label(for='username') Введите электронную почту
          .input
            input#password.input__text(
              required,
              v-model="password",
              type="password"
            )
            label.input__label(for='password') Введите пароль
          button.button(type='submit') Войти
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      onerr: false
    }
  },
  methods: {
    login: function () {
      axios
        .post('http://localhost:1337/auth/local', {
            identifier: this.username,
            password: this.password
        })
        .then(response => {
          localStorage.setItem('user-token', response.data.jwt)
          localStorage.setItem('user-profile', JSON.stringify(response.data.user))
          this.$router.push('/client');
          history.go(0)
        })
        .catch(error => {
          this.onerr = true;
          console.log('An error occurred:', error)
        });
    }
  }
}
</script>

<style lang="stylus" scope>
.auth-wrap
  padding-right 15px
  padding-left 15px
.auth-video
  position absolute
  min-width: 100%;
  min-height: 100%;
  top 50%
  left 50%
  transform translate(-50%, -50%)
.auth
  margin-top 100px
  margin-bottom 100px
  position relative
  background #ffffff
  max-width 480px
  margin-right auto
  margin-left auto
  padding 20px
  border-radius 5px
  animation-name fadeIn
  animation-duration 1s
  box-shadow 0 0 0 1px rgba(0,0,0,.05),0 2px 2px 0 rgba(0,0,0,.065) ,0px 80px 100px rgba(0,0,0,0.05)
  &__error
    background #fbeeee
    color #5f0c0c
    margin-bottom: 1rem;
    padding: 15px;
    border-radius: 5px;
    animation-name errorForm
    animation-duration .5s
@keyframes fadeIn
  from
    transform translateY(100px) scale(.95)
    opacity 0
  to
    transform translateY(0) scale(1)
    opacity 1
@keyframes errorForm
  from
    transform translateX(0)
  20%
    transform translateX(-10px)
  40%
    transform translateX(10px)
  60%
    transform translateX(-10px)
  80%
    transform translateX(10px)
  to
    transform translateX(0)
// .header__link
//   color #fff
//   &:hover
//     color rgba(#fff, .8)
//   &:before, &:after
//     background #fff
</style>
