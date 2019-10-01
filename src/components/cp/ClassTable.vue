<template lang="pug">
    .table-wrapper
      table.table

        tr.table-row
          th.table-item.table-header № п/п
          th.table-item.table-header ФИО
          th.table-item.table-header(v-for="tallage in tallages") {{tallage.title}}
          th.table-item.table-header Осталось оплатить

        tr.table-row(v-for="(user, index) in users")
          td.table-cell {{ index+1 }}
          td.table-cell.table-cell-name {{ user.family }} {{ user.name }}
          td.table-cell.table-cell-count(v-for="order in user.orders") {{ order.paid ? order.price+'руб.': '-' }}
          td.table-cell.table-cell-residue {{ user.owed ? user.owed + ' руб.' : '0 руб.' }}

</template>

<script>
  import axios from 'axios'
  export default {
    name: "ClassTable",
    data() {
      return {
        school: JSON.parse(localStorage.getItem('user-school')),
        users: [], //
        tallages: [], //
        class: JSON.parse(localStorage.getItem('user-class')),
        profile: JSON.parse(localStorage.getItem('user-profile')),
        token: localStorage.getItem('user-token'),
      }
    },
    mounted: function() {
      this.getUserSchoolClassCity();
      this.getCurrentUser();
      this.getUsersOrders();
    },
    methods: {
      /**
       * Get sum of owed from user (долг)
       */
      getOwed: function (user) {
        let owed = 0;

        user.orders.forEach(order => {
          !order.paid ? owed += order.price : ''
        });

        return owed;
      },

      /**
       * Get school and class for user-id
       */
      getUserSchoolClassCity: function () {
        axios({
          url: 'http://localhost:1337/graphql',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          method: 'post',
          data: {
            query: `
            {
               user(id: ${this.profile.id}) {
                id
                family
                name
                class {
                  id
                  name
                  school {
                    id
                    name
                  }
                }
              }
            }
            `
          }
        }).then((result) => {
          // console.log(result.data.data.user);
          let res = result.data.data.user;
          this.class.name = res.class.name;
          this.class.id = res.class.id;
          this.school = res.class.school;
        })
      },

      /**
       * Get one user with current user-id(profile.id)
       */
      getCurrentUser: function () {
        axios({
          url: 'http://localhost:1337/graphql',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          method: 'post',
          data: {
            query: `
            {
               user(id: ${this.profile.id}) {
                orders(sort: "id:desc") {
                  id
                  paid
                  price
                  tallage {
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
          // console.log(result.data.data.user);
          let res = result.data.data.user;
          // console.log(res);

          res.orders.forEach(order => {
            this.tallages.push(order.tallage)
          });
        })
      },


      /**
       * Get all Users of class and orders
       */
      getUsersOrders: function () {
        axios({
          url: 'http://localhost:1337/graphql',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          method: 'post',
          data: {
            query: `{
              class(id: ${this.class.id}) {
                name
                users (sort: "family:asc"){
                  name
                  family
                  id
                  orders {
                    id
                    price
                    paid
                  }
                }
              }
            }`
          }
        }).then((result) => {
          // console.log(result.data.data.class.users);
          this.users = result.data.data.class.users;

          this.users.forEach(user => {
            user.owed = this.getOwed(user);
          })

          // res.orders.forEach(order => {
          //   this.tallages.push(order.tallage)
          // });
        });
      }
    }

  }
</script>

<style scoped lang="stylus">
  .table
    color: #37445e;
    width: 100%
    font-family: "Rubik";
    font-size: 10px;
    border-collapse: collapse; /*убираем пустые промежутки между ячейками*/
    border: 3px solid #e5e5e5; /*устанавливаем для таблицы внешнюю границу серого цвета толщиной 3px*/
    &-header, &-cell
      border: 1px solid #e5e5e5; /*устанавливаем для таблицы внешнюю границу серого цвета толщиной 1px*/
      padding: 10px 15px;
    &-row
      &:first-child
        background: #6d37f4;
        color: #ffffff;
      &:not(:last-child)
        margin-bottom: 5%
    &-header
      font-size: 1.4em
      white-space: nowrap
    &-cell
      font-size: 1.1em
      text-align: center
</style>
