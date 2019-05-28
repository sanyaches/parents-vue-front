<template lang="pug">
  .auth-wrap
    //- video.auth-video(autoplay='' loop='')
    //-   source(src='@/assets/video/auth.mp4', type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"')
    //-   source(src='@/assets/video/auth.webm', type='video/webm; codecs="vp8, vorbis"')
    .auth
      .auth__error(v-if="errlogin") Вы ввели неверные данные. Попробуйте ещё раз.
      form(@submit.stop.prevent="handleSubmit")
        .input
          input#email.input__text(
            v-model="email",
            type="email",
            autofocus="true",
            required
          )
          label.input__label(for='email') Введите электронную почту
        .input
          input#password.input__text(
            v-model="password",
            label="password",
            type="password",
            class="form-control",
            autofocus="true",
            required
          )
          label.input__label(for='password') Введите пароль
        button.button(type='submit') Войти
</template>

<script>
import Strapi from 'strapi-sdk-javascript/build/main'
const apiUrl = process.env.API_URL || 'https://stark-mountain-93246.herokuapp.com'
const strapi = new Strapi(apiUrl)
import { mapMutations } from 'vuex'

import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      errlogin: false
    }
  },
  methods: {
    async handleSubmit() {
      try {
        this.loading = true
        const response = await strapi.login(this.email, this.password)
        this.loading = false
        this.setUser(response.user)
        this.$router.go(-1)
      } catch (err) {
        this.loading = false
        this.errlogin = true
        //alert(err.message || 'An error occurred.')
      }
      axios
        .post('https://stark-mountain-93246.herokuapp.com/auth/local', {
            identifier: this.email,
            password: this.password
        })
        .then(response => {
          // Handle success.
          console.log('Well done!');
          console.log('User profile', response.data.user);
          console.log('User token', response.data.jwt);
        })
        .catch(error => {
          // Handle error.
          console.log('An error occurred:', error);
        });
    },
    ...mapMutations({
      setUser: 'auth/setUser'
    })
  },
  created: function() {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTU2NzgwMzQ5LCJleHAiOjE1NTkzNzIzNDl9.ZdRwqlYebnZUSJGe6tMfHwk-WhH2FwhRDXuOjpTreo0';

    // Request API.
    axios
      .get('https://stark-mountain-93246.herokuapp.com/posts', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        // Handle success.
        alert(123);
        console.log('Data: ', response.data);
      })
      .catch(error => {
        // Handle error.
        alert(321);
        console.log('An error occurred:', error);
      });
  }
}
</script>

<style lang="stylus" scope>
.auth-wrap
  background-image url(../../assets/image/bgdots.jpg)
  background-size 800px
  background-repeat no-repeat
  background-position center
  flex 1 0 auto
  padding-bottom 150px
.auth-video
  position absolute
  min-width: 100%;
  min-height: 100%;
  top 50%
  left 50%
  transform translate(-50%, -50%)
.auth
  margin-top 100px
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
@keyframes fadeIn
  from
    transform translateY(100px) scale(.95)
    opacity 0
  to
    transform translateY(0) scale(1)
    opacity 1
// .header__link
//   color #fff
//   &:hover
//     color rgba(#fff, .8)
//   &:before, &:after
//     background #fff
</style>
