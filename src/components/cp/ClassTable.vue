<template lang="pug">
    .table-wrapper
      table.table

        tr.table-row
          th.table-item.table-header № п/п
          th.table-item.table-header ФИО
          th.table-item.table-header Мероприятие 1
          th.table-item.table-header Мероприятие 2
          th.table-item.table-header Остаток

        tr.table-row
          td.table-cell 1
          td.table-cell.table-cell-name Артамкин Арсений
          td.table-cell.table-cell-count 1000 руб
          td.table-cell.table-cell-count 2000 руб
          td.table-cell.table-cell-residue 2550 руб

        tr.table-row
          td.table-cell 2
          td.table-cell Вышегородцева Вика
          td.table-cell 1000 руб
          td.table-cell 2000 руб
          td.table-cell.table-cell-residue 0 руб

        tr.table-row
          td.table-cell 3
          td.table-cell Главицкая Мария
          td.table-cell -
          td.table-cell 2000 руб
          td.table-cell.table-cell-residue 1500 руб

        tr.table-row
          td.table-cell 4
          td.table-cell Главицкая Ольга
          td.table-cell -
          td.table-cell 2000 руб
          td.table-cell.table-cell-residue 1500 руб
        
</template>

<script>
  import axios from 'axios'
  export default {
    name: "ClassTable",
    data() {
      return {
        school: {
          name: '',
          id: ''
        },
        class: {
          name: '',
          id: ''
        },
        profile: JSON.parse(localStorage.getItem('user-profile')),
        token: localStorage.getItem('user-token'),
      }
    },
    mounted: function() {
      this.getUserSchoolClass();
      this.getUsersOfClass();
    },
    methods: {

      /**
       * Get school and class for user-id
       */
      getUserSchoolClass: function () {
        axios({
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
      },

      getUsersOfClass: function () {

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
