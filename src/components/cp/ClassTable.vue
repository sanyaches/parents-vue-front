<template lang="pug">
    .table-wrapper
      .table-filter.flex-column
        .table-filter__title Выберите год и месяц
        .table-filter__selects.flex-row
          span Год:
          select.table-filter__years(v-model="selectedYear")
            option.year(v-for="(year, index) in getYears"
              :key="index") {{ year.text }}
          span(v-show="selectedYear") Месяц:
          select.table-filter__months(v-model="selectedMonth" v-show="selectedYear")
            option.month(
              v-for="(month, index) in getMonths"
              :key="index"
              :disabled="month.disabled") {{ month.text }}
      table.table
        tr.table-row
          th.table-item.table-header № п/п
          th.table-item.table-header ФИО
          th.table-item.table-header(v-for="tallage in filterTallages") {{tallage.title}}
          th.table-item.table-header Осталось оплатить
        tr.table-row(v-for="(user, index) in filterUsers")
          td.table-cell {{ index+1 }}
          td.table-cell.table-cell-name {{ user.family }} {{ user.name }} ({{user.childname}})
          td.table-cell.table-cell-count(v-for="order in user.orders") {{ order.paid ? order.price==='-' ? '(отсутствовал)' : order.price+'руб.': '-' }}
          td.table-cell.table-cell-residue {{ user.owed ? user.owed + ' руб.' : '0 руб.' }}

      table.table-year.table
        tr.table-row
          th.table-item.table-header № п/п
          th.table-item.table-header ФИО
          th.table-item.table-header Расходы за год
        tr.table-row(v-for="(user, index) in filterUsersByYear")
          td.table-cell {{ index+1 }}
          td.table-cell.table-cell-name {{ user.family }} {{ user.name }} ({{user.childname}})
          td.table-cell.table-cell-residue {{ (''+user.costsByYear).includes('-') ? '0' : user.costsByYear }} руб.
</template>

<script>
  import axios from 'axios'

  export default {
    name: "ClassTable",
    data() {
      return {
        olderListOrders: [],
        school: JSON.parse(localStorage.getItem('user-school')),
        childname: '',
        users: [],
        tallages: [],
        maxOrders: '',
        class: JSON.parse(localStorage.getItem('user-class')),
        profile: JSON.parse(localStorage.getItem('user-profile')),
        token: localStorage.getItem('user-token'),
        selectedYear: '',
        selectedMonth: '',
        currentMonth: 'ноябрь',
        currentYear: '2019',
      }
    },

    created () {
      this.initMonthsYears();
    },

    mounted: function() {
      this.getUserSchoolClassCity();
      this.getCurrentUser();
      this.getUsersOrders();
      this.selectCurrent();
    },

    computed: {
      getMonths: function () {
        let currentMonth = new Date().getMonth();
        let currentYear = new Date().getFullYear();

        return [
          {
            text: 'январь',
            selected: false,
            disabled: (currentMonth < 0) && (Number(this.selectedYear) === currentYear)
          },
          {
            text: 'февраль',
            selected: false,
            disabled: currentMonth < 1 && (Number(this.selectedYear) === currentYear)
          },
          {
            text: 'март',
            selected: false,
            disabled: currentMonth < 2 && (Number(this.selectedYear) === currentYear)
          },
          {
            text: 'апрель',
            selected: false,
            disabled: currentMonth < 3 && (Number(this.selectedYear) === currentYear)
          },
          {
            text: 'май',
            selected: false,
            disabled: currentMonth < 4 && (Number(this.selectedYear) === currentYear)
          },
          {
            text: 'июнь',
            selected: false,
            disabled: currentMonth < 5 && (Number(this.selectedYear) === currentYear)
          },
          {
            text: 'июль',
            selected: false,
            disabled: currentMonth < 6 && (Number(this.selectedYear) === currentYear)
          },
          {
            text: 'август',
            selected: false,
            disabled: currentMonth < 7 && (Number(this.selectedYear) === currentYear)
          },
          {
            text: 'сентябрь',
            selected: false,
            disabled: currentMonth < 8 && (Number(this.selectedYear) === currentYear)
          },
          {
            text: 'октябрь',
            selected: false,
            disabled: currentMonth < 9 && (Number(this.selectedYear) === currentYear)
          },
          {
            text: 'ноябрь',
            selected: true,
            disabled: currentMonth < 10 && (Number(this.selectedYear) === currentYear)
          },
          {
            text: 'декабрь',
            selected: false,
            disabled: currentMonth < 11 && (Number(this.selectedYear) === currentYear)
          },

        ];
      },

      getYears: function () {
        return [
          {
            text: '2019',
            selected: true
          },
          {
            text: '2018',
            selected: false
          },
          {
            text: '2017',
            selected: false
          },
        ];
      },

      filterTallages: function () {
        return this.tallages.filter(tallage => {
          let monthFiltered = this.msGetMonth(tallage.created_at) === this.selectedMonth;
          let yearFiltered = this.msGetYear(tallage.created_at) === this.selectedYear;

          return monthFiltered && yearFiltered;
        });
      },

      /**
       * Filter orders of users by mounth and year
       */
      filterUsers: function () {
        let filteredUsers = [];

        this.users.forEach( user => {
          let filteredUser = {};
          // скопируем в него все свойства user
          for (let key in user) {
            filteredUser[key] = user[key];
          }

          filteredUser.orders = filteredUser.orders.filter(order => {
            let monthFiltered = this.msGetMonth(order.created_at) === this.selectedMonth;
            let yearFiltered = this.msGetYear(order.created_at) === this.selectedYear;

            return monthFiltered && yearFiltered;
          });

          filteredUsers.push(filteredUser);
        });

        return filteredUsers;
      },

      /**
       * Filter orders of users by year and get Summary of costs
       */
      filterUsersByYear: function () {
        let filteredUsers = [];

        this.users.forEach( user => {
          let filteredUser = {};
          // скопируем в него все свойства user
          for (let key in user) {
            filteredUser[key] = user[key];
          }

          filteredUser.orders = filteredUser.orders.filter(order => {
            return this.msGetYear(order.created_at) === this.selectedYear;
          });

          // Calculate costs by Filtered Year
          filteredUser.costsByYear = 0;
          filteredUser.orders.forEach( order => {
            if (order.paid === true) {
              filteredUser.costsByYear += order.price
            }
          });

          filteredUsers.push(filteredUser);
        });

        return filteredUsers;
      },
    },

    methods: {

      /**
       * Return string of month from ms
       */
      msGetMonth (milliseconds) {
        //0 - january, 11 - december
        let monthNumber = new Date(milliseconds).getMonth();
        let monthString = '';

        switch (monthNumber) {
         case 0: monthString = 'январь'; break;
         case 1: monthString = 'февраль'; break;
         case 2: monthString = 'март'; break;
         case 3: monthString = 'апрель'; break;
         case 4: monthString = 'май'; break;
         case 5: monthString = 'июнь'; break;
         case 6: monthString = 'июль'; break;
         case 7: monthString = 'август'; break;
         case 8: monthString = 'сентябрь'; break;
         case 9: monthString = 'октябрь'; break;
         case 10: monthString = 'ноябрь'; break;
         case 11: monthString = 'декабрь'; break;
        }

        return monthString;
      },

      /**
       * Return string of year from ms
       */
      msGetYear (milliseconds) {
        let year = '' + new Date(milliseconds).getFullYear();

        return year;
      },

      selectCurrent () {
        let years = Array.from(document.querySelectorAll('.table-filter__years .year'));
        let months = Array.from(document.querySelectorAll('.table-filter__months .month'));

        years.forEach(year => {
          if (year.textContent === this.currentYear) {
            year.setAttribute('selected', 'selected');
          }
        });

        months.forEach(month => {
          if (month.textContent === this.currentMonth) {
            month.setAttribute('selected', 'selected');
          }
        });
      },

      initMonthsYears () {
        // console.log(new Date().getMonth());
        // let currentMonth = new Date().getMonth();
        // let currentYear = new Date().getFullYear();
        // console.log(currentMonth);
        // console.log(currentYear);
      },

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
      getUserSchoolClassCity: async function () {
       await axios({
          url: 'https://parents-children.herokuapp.com/graphql',
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
       .catch(error => {
         console.log(error);
       })
      },

      /**
       * Get tallages from class of user
       */
      getCurrentUser: function () {
        axios({
          url: 'https://parents-children.herokuapp.com/graphql',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          method: 'post',
          data: {
            query: `
            {
               tallages(sort:"id:asc", where : {
                class: "${this.class.id}"
               }) {
                created_at
                title
               }
            }
            `
          }
        }).then((result) => {
          // console.log(result.data.data.user);
          this.tallages = result.data.data.tallages;
        })
        .catch(error => {
          console.log(error);
        });
      },

      /**
       * Get all Users of class and orders
       */
      getUsersOrders: function () {
        axios({
          url: 'https://parents-children.herokuapp.com/graphql',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          method: 'post',
          data: {
            query: `{
              class(id: ${this.class.id}) {
                name
                users (sort: "family:asc",
                where :{
                  role: "2"
                }){
                  childname
                  name
                  family
                  id
                  orders {
                    created_at
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
          let maxLengthOrders = 0;

          this.users.forEach(user => {
            if (user.orders.length > maxLengthOrders) {
              maxLengthOrders = user.orders.length;
              this.olderListOrders = user.orders;
            }
            user.owed = this.getOwed(user);
          });

          this.maxOrders = maxLengthOrders;
          this.addEmptyOrders();
        })
        .catch(error => {
          console.log(error);
        })
      },

      addEmptyOrders() {
        // let createdList = [];
        // this.olderListOrders.forEach( order => {createdList.push(order.created_at)});

        this.users.forEach(user => {
          // while (user.orders.length !== this.maxOrders) {
          //   user.orders.unshift({
          //     paid: true,
          //     price: '-',
          //
          //   });
          // }
          if ( user.orders.length !== this.maxOrders ) {
            for (let i = 0; i < this.olderListOrders.length; i++) {
              let order =  this.olderListOrders[i];
              if (user.orders.length === 0 || !this.createCreatedAt(user.orders).includes(order.created_at)) {
                user.orders.push({
                  paid: true,
                  price: '-',
                  created_at: order.created_at,
                });
              }
            }
          }
        });
      },

      createCreatedAt(arrOrders) {
        let createdList = [];

        arrOrders.forEach( order => {createdList.push(order.created_at)});

        return createdList;
      }
    }

  }
</script>

<style scoped lang="stylus">
  .table-filter
    align-items: center
    span
      margin: 0 .5rem
    &__title
      font-size: 1.1rem
      font-weight: 700
      font-family: "Rubik"
    &__selects
      padding: 1rem 0
  .table-year
    margin-top: 1rem
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
