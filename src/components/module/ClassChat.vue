<template lang="pug">
.chat
  .chat-header
    .chat-header__title
      .chat-header__name {{chat.name}}
      .chat-header__people {{count}} {{peopleString}}
  .chat-messages
    .message(v-for="msg in messages" :class="{'my-message': msg.userId === ''+profile.id}")
      img.message-avatar(:src="`http://localhost:1337${msg.urlAvatar}`")
      .message-message
        .message-content
          .message-message__name {{ msg.fullName }} ({{msg.childName}})
          .message-message__text {{ msg.textMessage }}
        .message-message__date {{ msg.timeStamp}}
  form.chat-input(@submit.prevent="onSubmit")
    input.chat-input__message(placeholder="Написать сообщение" v-model="mySelf.message")
    //a.chat-input__file
      //img(src="../../assets/image/clip.svg")
    button.chat-input__send(type="submit" @click="sendPersonMessage")
</template>

<script>
  import axios from 'axios';

  export default {
    name: "ClassChat",
    data () {
      return {
        chat: {},
        timerIdInterval: '',
        count: 0,
        class: JSON.parse(localStorage.getItem('user-class')),
        messages: [],
        token: localStorage.getItem('user-token'),
        profile: JSON.parse(localStorage.getItem('user-profile')),
        mySelf: {
          message: '',
          urlAvatar:'',
          userId: '',
          fullName: '',
          childName: '',
        },
      }
    },

    created () {
      this.getChat();
      this.timerIdInterval = setInterval(this.getChat, 3000);
    },

    beforeMount() {
      this.computeCountUsers();
      this.createMySelf();
    },

    beforeDestroy() {
      clearInterval(this.timerIdInterval);
    },

    computed: {
      peopleString: function () {
        let strCount = ''+this.count;
        let people = 'участников';

        switch (strCount[strCount.length - 1]) {
          case '0': people = 'участников'; break;
          case '1': people = 'участник'; break;
          case '2': people = 'участника'; break;
          case '3': people = 'участника'; break;
          case '4': people = 'участника'; break;
          case '5': people = 'участников'; break;
          case '6': people = 'участников'; break;
          case '7': people = 'участников'; break;
          case '8': people = 'участников'; break;
          case '9': people = 'участников'; break;
          default: people='участников'; break;
        }

        return people;
      },
    },
    methods: {

      createMySelf () {
        this.mySelf.fullName = this.profile.family + ' ' + this.profile.name;
        this.mySelf.userId = ''+this.profile.id;

        axios({
          url: 'http://localhost:1337/graphql',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          method: 'post',
          data: {
            query: `
            {
              user(id: ${this.profile.id}){
                photo {
                  url
                }
                childname
              }
            }
            `
          }
        }).then(result => {
          // console.log('creatingMySelf');
          // console.log(result);
          this.mySelf.urlAvatar = result.data.data.user.photo.url;
          this.mySelf.childName = result.data.data.user.childname;
        })
        .catch(error => {
          console.log('creatingMySelfError!');
          console.log(error);
        });
      },


      computeCountUsers: async function() {
        await axios({
          url: 'http://localhost:1337/graphql',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          method: 'post',
          data: {
            query: `
            {
              class(id: ${this.class.id}){
                users(where: {role: "2"}) {
                  id
                }
              }
            }
            `
          }
        }).then(result => {
          // console.log('countSubscribersChatSuccess!');
          // console.log(result);
          this.count = result.data.data.class.users.length;
        })
        .catch(error => {
          console.log('countSubscribersChatError!');
          console.log(error);
        });
      },

      /**
       * Get chat and messages info before mount vue component!
       */
      async getChat() {
        await this.queryChat();
        this.queryMessages();

        //After get chat scroll to his bottom
        this.scrollChatBottom();
      },

      /**
       * Scroll to bottom of chat container
       */
      scrollChatBottom () {
        let chat = document.querySelector('.chat-messages');
        chat.scrollTop = chat.scrollHeight;
      },

      async queryChat() {
       await axios({
          url: 'http://localhost:1337/graphql',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          method: 'post',
          data: {
            query: `
            {
              chats(where: {
                class: ${this.class.id}
              }){
                id
                name
              }
            }
            `
          }
        }).then(result => {
          // console.log('queryChatSuccess');
          // console.log(result);
          this.chat = result.data.data.chats[0];
        })
          .catch(error => {
            console.log('queryChatError!');
            console.log(error);
          });
      },

      queryMessages() {
        axios({
          url: 'http://localhost:1337/graphql',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          method: 'post',
          data: {
            query: `
            {
              messages(sort: "created_at:asc", where: {
                chat: ${this.chat.id}
              }){
                userId
                textMessage
                timeStamp
                created_at
                fullName
                urlAvatar
                childName
              }
            }
          `
          }
        }).then(result => {
          // console.log('queryMessages');
          // console.log(result);
          this.messages = result.data.data.messages;
        })
          .catch(error => {
            console.log('queryMessagesError');
            console.log(error);
          });
      },

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

      onSubmit () {
        // DO Something
      },

      sendPersonMessage: async function () {

        await axios({
          url: 'http://localhost:1337/graphql',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          method: 'post',
          data: {
            query: `
            mutation {
              createMessage(input: {
                data: {
                  textMessage: "${this.mySelf.message}"
                  userId: "${this.mySelf.userId}"
                  urlAvatar: "${this.mySelf.urlAvatar}"
                  fullName: "${this.mySelf.fullName}"
                  childName: "${this.mySelf.childName}"
                  timeStamp: "${this.formatDate(new Date())}"
                  chat: ${this.chat.id}
                }
              }) {
                message {
                  id
                  textMessage
                  fullName
                  urlAvatar
                  userId
                  timeStamp
                  childName
                }
              }
            }
          `
          }
        })
          .then(result => {
            // console.log('Сообщение отослано');
            // console.log(result.data.data.createMessage.message);
            this.mySelf.message = '';
            this.getChat();
            this.scrollChatBottom();
          })
          .catch(error => {
            console.log('createMessageError!');
            console.log(error);
          });
      },
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
    overflow-x: hidden
    overflow-y: scroll
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
        border-radius: 100%
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
