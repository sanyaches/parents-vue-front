<template lang="pug">
.chat
  .chat-header
    .chat-header__photo
    .chat-header__title
      .chat-header__name 5 класс, 73 школа г. Оренбург
      .chat-header__people 15 участников
  .chat-messages
    .message(v-for="msg in arrayMessage" :class="{'my-message': msg.myMessage}")
      img.message-avatar(:src='msg.avatar')
      .message-message
        .message-content
          .message-message__name {{ msg.name }}
          .message-message__text {{ msg.text }}
        .message-message__date {{ msg.timeStamp}}
  form.chat-input(:submit="sendPersonMessage")
    input.chat-input__message(placeholder="Написать сообщение" v-model="mySelf.message")
    a.chat-input__file
      img(src="../../assets/image/clip.svg")
    button.chat-input__send(@click="sendPersonMessage()")
</template>

<script>
  export default {
    name: "ClassChat",
    data () {
      return {
        mySelf: {
          name: 'Алексей Петров',
          message: '',
          avatar: require('../../assets/image/Ellipse.jpg'),
        },
        arrayMessage: [
          {
            avatar: require('../../assets/image/Ellipse.jpg'),
            name: 'Алексей Петров',
            timeStamp: '15 апреля 15:34',
            text: 'Всем привет! Что будем делать на выпускной?',
            myMessage: false,
          },
          {
            avatar: require('../../assets/image/Ellipse.jpg'),
            name: 'Алексей Петров',
            timeStamp: '15 апреля 15:35',
            text: 'Привет. Думаю в национальную деревню',
            myMessage: false,
          },
          {
            avatar: require('../../assets/image/Ellipse.jpg'),
            name: 'Алексей Петров',
            timeStamp: '15 апреля 15:34',
            text: 'А как насчет экстрим-парка?',
            myMessage: true,
          },
          {
            avatar: require('../../assets/image/Ellipse.jpg'),
            name: 'Алексей Петров',
            timeStamp: '15 апреля 15:34',
            text: 'Ну можно сделать и так',
            myMessage: false,
          },
          {
            avatar: require('../../assets/image/Ellipse.jpg'),
            name: 'Алексей Петров',
            timeStamp: '15 апреля 15:34',
            text: 'Хорошо, тогда встретимся и обсудим это',
            myMessage: false,
          },
        ],
      }
    },
    methods: {
      /**
       * Return string formatted from now date
       * @param date ( new Date() )
       * @returns {string} => 'DD MONTH HH:MM'
       */
      formatDate: function (date) {
        let monthNames = [
          "января", "февраля", "марта",
          "апреля", "мая", "июня", "июля",
          "августа", "сентября", "октября",
          "ноября", "декабря"
        ];
        let day = date.getDate();
        let monthIndex = date.getMonth();
        let hours = date.getHours();
        let minutes = date.getMinutes();

        return day + ' ' + monthNames[monthIndex] + ' ' + hours+ ':' + minutes;
      },

      sendPersonMessage: function () {
        this.arrayMessage.push({
          avatar: this.mySelf.avatar,
          name: this.mySelf.name,
          timeStamp: this.formatDate(new Date()),
          text: this.mySelf.message,
          myMessage: true,
        });
        // Clear message
        this.mySelf.message = '';
      }
    }
  }
</script>

<style scoped lang="stylus">
.chat
  &-header
    display: flex
    flex-direction: row
    align-items: center
    padding-left: .5rem
    padding-top: 1rem
    padding-bottom: 1rem
    border-bottom: 1px solid #ECECEC
    &__photo
      height: 42px
      width: 42px
      margin-right: 1.2rem
      background url("../../assets/image/Ellipse.jpg") no-repeat
      border-radius 50%
    &__title
      display: flex
      flex-direction: column
      font-family: "Rubik";
      font-style: normal;
      font-weight: normal;
      font-size: .85rem;
      line-height: 120%;
      text-align: center;
      align-items: flex-start
      color: #37445E;
    &__people
      font-family: Rubik;
      font-style: normal;
      font-weight: normal;
      font-size: .65rem;
      line-height: 120%;
      color: #909CB4;
  &-messages
    padding: 2rem 1.4rem 1.6rem .5rem;
    max-height: 590px;
    overflow: auto
    .message
      &:not(:first-child)
        margin-top: .8rem
      display: flex
      flex-direction: row
      justify-content: flex-start
      &-avatar
        width: 27px
        height: 27px
        margin-right: .8rem
        margin-bottom: .6rem
        align-self: flex-end
      &-message
        max-width: 80%
        display: flex
        flex-direction: column
        &__date
          font-size: .5rem
          font-family: 'Rubik'
          line-height: 150%;
          margin-top: .5rem
          color: #909CB4;
      &-content
        background: #F1F3F5
        border-radius: 10px 10px 10px 0
        padding: .6rem
        color: #7C8295
        .message-message__name
          font-size: .5rem
          font-family: 'Rubik'
          line-height: 150%;
        .message-message__text
          font-size: .8rem
          font-family: 'Rubik'
          line-height: 150%

    .my-message
      flex-direction: row-reverse
      margin-top 1.2rem
      margin-bottom: .8rem
      .message-avatar
        margin-right: 0
        margin-left: .8rem
      .message-content
        background: linear-gradient(69.03deg, #6D37F4 0.52%, #804EFF 97.32%), linear-gradient(69.03deg, #6D37F4 0.52%, #733CFF 97.32%);
        box-shadow: 0px 0px 30px rgba(55, 68, 94, 0.15);
        border-radius: 10px 10px 0px 10px;
        color: white
      .message-message
        &__date
          align-self: flex-end;
          margin-top: .7rem
          color: #909CB4;

  &-input
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-top: 1px solid #ECECEC;
    padding: 1rem .3rem 1rem 0.4rem;
    &__message
      border: none
      width: 85%;
      font-family: "Rubik";
      font-style: normal;
      font-weight: normal;
      font-size: .95rem;
      line-height: 150%;
      color: #505265;
      &::placeholder
        font-family: "Rubik";
        font-style: normal;
        font-weight: normal;
        font-size: .85rem;
        line-height: 150%;
        color: #909CB4;
    &__file
      width 5%
    &__send
      background: url("../../assets/image/telegram-plane.svg") no-repeat
      border: none
      width: 5%
      height: 23px

</style>
