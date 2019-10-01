<template lang="html">
  <div class="vote" :class="{'vote-active': voteActive&&!voteSubmit, 'vote-end': voteEnd}">

    <div class="vote-wrapper flex-row">
      <div class="vote-head">
        <div class="vote-title">{{this.vote.title}}</div>
        <div v-if="!voteSubmit" class="vote-date">{{getDate(vote.date || "")}}</div>
        <div v-if="voteSubmit" class="vote-date-passed">Голосование создано: {{getDate(vote.date || "")}}</div>
      </div>

      <div class="vote-state--continue vote-state" v-if="voteSubmit && !voteEnd">Голосование идет</div>
      <div class="vote-state--end vote-state" v-if="voteSubmit && voteEnd">Голосование окончено</div>
    </div>

    <form v-if="(!voteSubmit)" class="vote-form">
      <p class="vote-input-wrapper" v-for="(answer, index) in vote.answers"><input :checked="index === 0" @click="check" class="vote-input" name="vote" type="radio">{{answer.answer}}</p>
      <div class="vote-submit-wrapper">
        <button @submit.prevent="onSubmit" @click="submitVote" class="vote-submit" type="button">Проголосовать</button>
        <button class="vote-curator">Связаться с куратором</button>
      </div>
    </form>

    <div class="vote-results-show" v-if="voteSubmit" @click="showResults = !showResults">
      <span v-if="!showResults">Показать результаты</span>
      <span v-if="showResults">Скрыть результаты</span>
    </div>

    <div v-if="showResults" class="vote-results">
      <ul class="vote-results-list">
        <li class="vote-results-item" v-for="answer in vote.answers">
          <span class="vote-results-item__answer">{{answer.answer}}: </span>
          <span class="vote-results-item__count">{{answer.count}} голос(-а)</span>
        </li>
      </ul>
    </div>



  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "Vote",
    props: {
      voteActive : {
        type: Boolean,
        default: true,
      },
      voteId: String,
      voteEnd: {
        type: Boolean,
        default: false,
      },
      voteSubmit: {
        type: Boolean,
        default: true,
      },

    },
    data() {
      return {
        token: localStorage.getItem('user-token'),
        profile: JSON.parse(localStorage.getItem('user-profile')),
        vote: {},
        resultVote: '',
        showResults: false,
        checkedAnswer: '',
      }
    },
    mounted: function () {
      this.voteInit();
    },
    methods: {
      submitVote: function () {
        this.voteSubmit = !this.voteSubmit;
        let answer = this.vote.answers.filter(answer => answer.answer === this.checkedAnswer)[0];

        console.log(answer);
        answer.count++;

        axios({
          url: 'http://localhost:1337/graphql',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          method: 'post',
          data: {
            query: `
            mutation {
              updateAnswer(input: {
                where: {
                  id: "${answer.id}"
                },
                data: {
                  count: ${answer.count}
                }
              }) {
                answer {
                  id
                  answer
                  count
                }
              }
            }
          `
          }
        }).then(result => {
          // console.log('Голосование прошло успешно');
          console.log(result);
        });

        axios({
          url: 'http://localhost:1337/graphql',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          method: 'post',
          data: {
            query: `
            mutation {
              updateVote(input: {
                where: {
                  id: "${vote.id}"
                },
                data: {
                  user: ${answer.count}
                }
              }) {
                answer {
                  id
                  answer
                  count
                }
              }
            }
          `
          }
        }).then(result => {
          console.log('Голосование прошло успешно');
          console.log(result);
        });
      },

      getDate: function (date) {
        let monthRu = '';
        // console.log(date);
        let dateRow = date.split(' ')[0].split('-');
        let year = dateRow[0];
        let month = dateRow[1];
        let day = dateRow[2];

        switch (month) {
          case '01': monthRu = 'январь'; break;
          case '02': monthRu = 'февраля'; break;
          case '03': monthRu = 'марта'; break;
          case '04': monthRu = 'апреля'; break;
          case '05': monthRu = 'мая'; break;
          case '06': monthRu = 'июня'; break;
          case '07': monthRu = 'июля'; break;
          case '08': monthRu = 'августа'; break;
          case '09': monthRu = 'сентября'; break;
          case '10': monthRu = 'октября'; break;
          case '11': monthRu = 'ноября'; break;
          case '12': monthRu = 'декабря'; break;
        }

        // return `${day} ${monthRu} ${year}`
        return '25 сентября 2019'
      },

      voteInit: function () {
        axios({
          url: 'http://localhost:1337/graphql',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          method: 'post',
          data: {
            query: `{
              vote(id: ${ this.voteId }) {
                title
                date
                answers(sort: "answer:asc") {
                  id
                  answer
                  count
                }
              }
            }`
          }
        }).then((result) => {
          // console.log(result.data.data.vote);
          this.vote = result.data.data.vote;
          this.checkedAnswer = this.vote.answers[0].answer;
          this.submitAnswer = this.vote.answers.filter(answer => answer === this.checkedAnswer)[0];
        })
      },
      check: function (e) {
        // console.log(e.target.parentElement.textContent);
        this.checkedAnswer = e.target.parentElement.textContent;

        this.getResultOfVote();
      },

      getResultOfVote: function () {

      }
    },
  }
</script>

<style scoped lang="stylus">
  .vote-wrapper {
    width: 100%
    justify-content: space-between
  }
  .flex-row {
    display: flex
    flex-direction: row
  }
  .vote
    display: flex
    flex-direction: column
    align-items: center
    justify-content: space-between
    background: #F9F9F9
    color: #37445E;
    padding: 26px 39px 10px;
    &-state
      display: flex
      align-items: center
    &-results-show
      margin: 1rem 0
      font-size: .7rem
      cursor: pointer
    &-results
      width: 100%
      &-item
        display: flex
        flex-direction: row
        justify-content: space-between
    &:not(:first-child)
      margin-top: 13px
    .vote-state--continue
      font-size: .6rem;
      line-height: .75rem;
      padding: .6rem .65rem .6rem 2rem;
      color white
      background: url("../../assets/image/vector.svg") no-repeat 10% center, #54D581
      box-shadow: 0 15px 25px rgba(111, 187, 46, 0.2);
    .vote-state--end
      font-size: .6rem;
      line-height: .75rem;
      padding .6rem
      background: #FF4C45;
      box-shadow: 0 15px 25px rgba(231, 110, 84, 0.25);
      color white
    &-head
      font-family: 'Rubik';
      font-weight: 600;
      padding-bottom: 0
      margin-bottom: 0
      border-bottom: none;
      .vote-title
        font-size: 1.1rem;
        line-height: 1.8rem;
      .vote-date
        font-size: .6rem;
        line-height: .75rem;
        color: #909CB4;
      .vote-date-passed
        font-family: 'Rubik';
        font-style: normal;
        font-weight: normal;
        font-size: .6rem;
        line-height: .75rem;
    &-form
      .vote-input-wrapper
        display: flex
        flex-direction: row
        align-items: center
        font-family: Open Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 0.8rem;
        line-height: 1.1rem;
        &:not(:first-child)
          margin-top: 11px
      .vote-input
        padding: 5.5px;
        -webkit-appearance: none;
        outline: 0.1em solid #6D37F4;
        outline-offset: 0.1em;
        margin-right: 11px
        &:checked
          display: inline-block;
          background-color: #6D37F4;
    &-submit-wrapper
      margin-top: 1.4rem
      .vote-submit
        font-size: .6rem;
        line-height: .75rem;
        background: #6D37F4;
        box-shadow: 0 10px 15px rgba(109, 55, 244, 0.2);
        outline: none;
        border: none;
        color: #fff;
        padding: 10px 29px;
      .vote-curator
        font-size: .6rem;
        line-height: .75rem;
        border: 1px solid #6D37F4;
        box-sizing: border-box;
        color: #6D37F4;
        padding: 9px 28px;
        background: none;
  .vote-active
    flex-direction: column
    align-items: normal
    .vote-head
      width: 100%;
      display: flex
      flex-direction: row
      align-items: center
      justify-content: space-between
      padding-bottom: 1.4rem;
      margin-bottom: 1.4rem;
      border-bottom: 1px solid rgba(144,156,180,0.15);
      .vote-title
        font-family: 'Rubik';
        font-style: normal;
        font-weight: 600;
        font-size: .85rem;
        line-height: 1.2rem;


</style>
