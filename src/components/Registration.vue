<template lang="pug">
  .mw
    span.reg-title Регистрация
    .auth-wrap.reg
      .auth
        .auth__error(v-if="onerr") Вы ввели неверные данные. Попробуйте ещё раз.
        form(@submit.prevent="register")
          .input
            input#username.input__text(
              required,
              v-model="username",
              type="text"
            )
            label.input__label(for='username') Введите имя пользователя
          .input
            select#role.input__text(
              v-model="role"
            )
              option(value="Родитель") Родитель
              option(value="Учитель") Учитель
              option(value="Куратор") Куратор
            label.input__label Выберите роль
          .input
            input#password.input__text(
              required,
              v-model="password",
              type="password"
            )
            label.input__label(for='password') Введите пароль
          .input
            input#email.input__text(
              required,
              v-model="email",
              type="text"
            )
            label.input__label(for='username') Введите адрес эл. почты
          .input
            input#family.input__text(
              required,
              v-model="family",
              type="text"
            )
            label.input__label(for='family') Введите фамилию
          .input
            input#name.input__text(
              required,
              v-model="name",
              type="text"
            )
            label.input__label(for='name') Введите Имя
          .input
            input#patronomyc.input__text(
              v-model="patronomyc",
              type="text"
            )
            label.input__label(for='patronomyc') Введите Отчество
          button.button(type='submit') Зарегистрироваться
</template>

<script>
  import axios from 'axios';

  export default {
    name: "Registration",
    data() {
      return {
        username: '',
        password: '',
        email: '',
        role: '',
        family: '',
        name: '',

        onerr: false
      }
    },
    methods: {
      register: function () {
        axios
          .post('http://localhost:1337/auth/local/register', {
            username: this.username,
            email: this.email,
            password: this.password,
          })
          .then(response => {
            // Handle success.
            // localStorage.setItem('user-token', response.data.jwt);
            // localStorage.setItem('user-profile', JSON.stringify(response.data.user));

            this.$router.push('/client');
            history.go(0);
          })
          .catch(error => {
            // Handle error.
            alert('Ошибка! Вероятно пользователь с этой почтой уже существует!');
            this.username = '';
            this.password = '';
            this.email = '';
            this.role = '';
          });
        this.sendEmail();
      },

      sendEmail: function () {
        axios.post(`/send.php?role=${this.role}&emaill=${this.email}&user=${this.username}`)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }
  }

</script>

<style scoped lang="stylus">
.reg
  min-width: 500px
  padding: 0
  &-title
    font-size: 2rem
    text-align: center
    width: 500px
    margin-top: 40px
    position: absolute
  .button
    max-width: 100%
</style>
