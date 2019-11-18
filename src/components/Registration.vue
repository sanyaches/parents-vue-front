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

          //Select city
          .input
            select#city.input__text(
              v-model="city"
            )
              option(v-for="oneCity in cities") {{ oneCity.city }}
            label.input__label Выберите Город

          .input(v-if="showSchoolSelect")
            select#school.input__text(
              v-model="school"
            )
              option(v-for="oneSchool in schools") {{oneSchool.name}}
            label.input__label Выберите Школу/сад
          .input(v-if="showClassSelect")
            select#class.input__text(
              v-model="selectClass"
            )
              option(v-for="oneClass in classes") {{oneClass.name}}
            label.input__label Выберите Класс/группу
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
          .input
            input#childname.input__text(
              v-model="childname",
              type="text"
            )
            label.input__label(for='childname') Имя ребенка
          button.button(type='submit') Зарегистрироваться
</template>

<script>
  import axios from 'axios';

  export default {
    name: "Registration",
    data() {
      return {
        token: '',
        profile: {},
        username: '',
        password: '',
        email: '',
        role: '',
        family: '',
        name: '',
        patronomyc: '',
        childname: '',
        showSchoolSelect: false,
        showClassSelect: false,
        cities: [],
        city: '',
        schools: [],
        school: {},
        classId: '',
        schoolId: '',
        cityId: '',
        classes: [],
        selectClass: '',
        onerr: false
      }
    },
    mounted: function() {
      this.getCities();
    },
    methods: {
      getClassId: async function() {
        await axios({
          url: 'https://parents-children.herokuapp.com/graphql',
          method: 'post',
          data: {
            query: `
            {
            cities(
              where: {
              id: "${this.cityId}"
             }) {
              schools(
                where: {
                id: "${this.schoolId}"
               }) {
                 classes(
                  where: {
                  name: "${this.selectClass}"
                 }) {
                  id
                  name
                  }
                }
              }
            }
            `
          }
        }).then((result) => {
          let citiesClassesRes = result.data.data.cities;
          try {
            if (citiesClassesRes.length !== 0) {
              let schools = citiesClassesRes[0].schools;
              if (schools.length !== 0) {
                let classes = schools[0].classes;
                if (classes.length !== 0) {
                  this.classId = classes[0].id;
                }
              }
            }
          }
          catch (e) {
            console.log(e);
            this.classId = 'undefined class id'
          }


          console.log(this.classId);
        })
          .catch((error) => {
            console.log(error);
          });
      },
    register: async function () {
       await axios
          .post('https://parents-children.herokuapp.com/auth/local/register', {
            username: this.username,
            email: this.email,
            password: this.password,
          })
          .then(response => {
            // Handle success.
            localStorage.setItem('user-token', response.data.jwt);
            localStorage.setItem('user-profile', JSON.stringify(response.data.user));
            this.token = localStorage.getItem('user-token');
            this.profile = JSON.parse(localStorage.getItem('user-profile'));

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

      this.updateRegisteredUser();
    },

      sendEmail: function () {
        axios.post(`/send.php?role=${this.role}&emaill=${this.email}&user=${this.username}`)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
      },

      updateRegisteredUser: async function() {
        //update vote
        await axios({
          url: 'https://parents-children.herokuapp.com/graphql',
          method: 'post',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          data: {
            query: `
            mutation {
              updateUser(input: {
                where: {
                  id: "${this.profile.id}"
                },
                data: {
                  name: "${this.name}"
                  family: "${this.family}"
                  patronymic: "${this.patronomyc}"
                  childname: "${this.childname}"
                  class: "${this.classId}"
                }
              }) {
                user {
                  id
                  name
                  family
                  patronymic
                  childname
                  class {
                    name
                    id
                  }
                }
              }
            }
          `
          }
        }).then(result => {
          console.log('Пользователю передались личные данные');
          console.log(result);
        })
        .catch(error => {
          console.log('Пользователю НЕ передались личные данные, ошибка!!! ');
          console.log(error);
        });

        localStorage.removeItem('user-token');
        localStorage.removeItem('user-profile');
        this.$router.push('/client');
        history.go(0);
      },

      getCities: function () {
        axios({
          url: 'https://parents-children.herokuapp.com/graphql',
          method: 'post',
          data: {
            query: `
            {
              cities(sort: "id:asc") {
                id
                city
              }
            }
          `
          }
        }).then((result) => {
          // console.log(result.data.data);
          this.cities = result.data.data.cities;
        })
          .catch((error) => {
            console.log(error);
          });
      },

      selectedCity: function () {

        if (!this.showSchoolSelect) {
          this.showSchoolSelect = !this.showSchoolSelect;
        }

        axios({
          url: 'https://parents-children.herokuapp.com/graphql',
          method: 'post',
          data: {
            query: `
            {
             cities(
              where: {
              city: "${this.city}"
             }) {
              id
              city
              schools(sort: "name:asc") {
                name
                id
              }
             }
            }`
          }
        }).then((result) => {
          console.log(result.data.data);
          let citiesRes = result.data.data.cities;
          if (citiesRes.length !== 0) {
            this.cityId = citiesRes[0].id;
            this.schools = citiesRes[0].schools;
          }

        })
          .catch((error) => {
            console.log(error);
          });
      },

      selectedSchool: function () {
        if (!this.showClassSelect) {
          this.showClassSelect = !this.showClassSelect;
        }
        console.log(this.school);

        axios({
          url: 'https://parents-children.herokuapp.com/graphql',
          method: 'post',
          data: {
            query: `
              {
               schools(
                where: {
                name: "${this.school}"
               }) {
                id
                name
                classes(sort: "name:asc") {
                  name
                  id
                }
               }
              }`
          }
        }).then((result) => {
          console.log(result.data.data);
          let schoolsRes = result.data.data.schools;
          if (schoolsRes.length !== 0) {
            this.schoolId = schoolsRes[0].id;
            this.classes = schoolsRes[0].classes;
          }

        })
          .catch((error) => {
            console.log(error);
          });
      },


    },

    watch: {
      city () {
        this.selectedCity();
      },
      school () {
        this.selectedSchool();
      },
      selectClass () {
        this.getClassId();
      }
    },


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
    margin: 40px 0
    display: block
  .button
    max-width: 100%
    margin-bottom: 4rem
</style>
