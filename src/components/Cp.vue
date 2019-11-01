<template lang="pug">
  .cp
    .cp__popup(v-if="showPopup")
      form.cp__popup-form
        .cp__popup-close(@click="showPopup = !showPopup")
        label.cp__popup-label Введите свои данные
        input.cp__popup-input(type=text v-model='name' placeholder='Введите Имя')
        input.cp__popup-input(type=text v-model='tel' placeholder='Введите Номер телефона')
        textarea.cp__popup-input.cp__popup-input-large(v-model='text' placeholder='Текст обращения')
        button.cp__popup-submit(type=submit @click="submitLeadForm") Отправить заявку

    .cp__popup(v-if="showPopupKuratorLetter")
      form.cp__popup-form
        .cp__popup-close(@click="showPopupKuratorLetter = !showPopupKuratorLetter")
        label.cp__popup-label Напишите письмо вашему куратору
        textarea.cp__popup-input.cp__popup-input-large(v-model='letter' placeholder='Текст обращения')
        button.cp__popup-submit(type=submit @click="sendLetterToKurator") Отправить заявку

    .cp__popup(v-if="showPopupPhotoUpload")
      form.cp__popup-form.popup-edit-photo
        .cp__popup-close(@click="showPopupPhotoUpload = !showPopupPhotoUpload")
        <!-- Can be multiple files -->
        input(type="file" name="files")
        input(type="text" name="ref" value="user" v-show="false")
        input(type="text" name="source" value="users-permissions" v-show="false")
        input(type="text" name="refId" :value="profile.id" v-show="false")
        input(type="text" name="field" value="photo" v-show="false")
        input.cp__popup-submit(type="submit" value="Заменить аватар" @click="submitUpload")


    .cp__popup(v-if="showPopupCreateVote")
      form.cp__popup-form.popup-create-vote
        .cp__popup-close(@click="showPopupCreateVote = !showPopupCreateVote")
        label.cp__popup-label Новое голосование
        input.cp__popup-input.title-create-vote(type=text v-model='titleVote' placeholder='Введите вопрос для обсуждения')
        .answer-wrapper
          .answer(v-for='(answer, index) in answers'
            :key='index'
            @input="event => onInputAnswer(event, index)"
            contenteditable='true'
            autocomplete='off'
            autocorrect='off'
            autocapitalize='off'
            spellcheck='false'
            tabindex='0') {{ answer.text }}
        .buttons-wrapper
          .add-answer-button(@click="addNewAnswer") +
          .add-answer-button(@click="popAnswer") -
        button.cp__popup-submit(type=submit @submit.prevent="submittedCreateVote" @click="submitCreateVoteForm") Создать голосование


    .cp__mw.mw
      .cp-tabs
        .cp-tabs__tab(@click="activeTab = 1" :class="{'active-tab': activeTab === 1}")
          span.cp-tabs__tab-count +1
          span.cp-tabs__tab-name Счета
        .cp-tabs__tab(@click="activeTab = 2" :class="{'active-tab': activeTab === 2}")
          span.cp-tabs__tab-count +1
          span.cp-tabs__tab-name Голосование
        .cp-tabs__tab(@click="activeTab = 3" :class="{'active-tab': activeTab === 3}")
          span.cp-tabs__tab-name Новости
        .cp-tabs__tab(@click="activeTab = 4" :class="{'active-tab': activeTab === 4}")
          span.cp-tabs__tab-count +2
          span.cp-tabs__tab-name Чат
        .cp-tabs__tab(@click="activeTab = 5" :class="{'active-tab': activeTab === 5}")
          span.cp-tabs__tab-name Галерея
      .cp__content
        .cp__content-balance(v-if="meRole == 2")
          span.cp__content-balance__title Баланс класса
          .cp__content-balance__count
            span.cp__content-balance__count 14000
            span.cp__content-balance__valute ₽
        .cp__content-wrap
          div(v-if="meRole == 2 && activeTab===1")
            .order-error(v-if="payError") Ошибка
            .order-success(v-if="paySuccess.on", v-html="paySuccess.text")
            .order-none(v-if="ordersWait.length == 0 && ordersPaid.length == 0") Счетов ещё нет
            .order-table(v-if="ordersWait.length > 0")
              //.order-table__id
              .order-table__name Название
              .order-table__price Сумма долга
            Order(v-for="order in ordersWait", :title="order.tallage.title", :tallage_price="order.tallage.price", :price="order.price", :order_id="order.id", :description="order.tallage.description", :key="order.id", @pay="getOrderToPay(order.id)")
            .cp__hr(v-if="ordersPaid.length > 0")
              span.cp__hr-text Оплачено
            Order(v-for="order in ordersPaid", :title="order.tallage.title", :tallage_price="order.tallage.price", :price="order.price", :order_id="order.id", :description="order.tallage.description", :key="order.id", :paid="true")
            .cp__hr
              span.cp__hr-text Информация об оплате по классу
            ClassTable(ref="classTable")
          div(v-if="meRole == 2 && activeTab===2")
            Vote(v-for="vote in votes"
              @get-votes="getVotes"
              :key="vote.id"
              :vote-submit="vote.submitted"
              :vote-id="vote.id"
              :vote-end="vote.ended")
            .add-vote.cp__button(@click="showPopupCreateVote = !showPopupCreateVote") Добавить голосование
          div(v-if="meRole == 2 && activeTab===3")
            Newslc
          div(v-if="meRole == 2 && activeTab===4")
            ClassChat
          div(v-if="meRole == 2 && activeTab===5")
            Gallery

          Kurator(v-if="meRole == 12")
          //- order(:title="Название" :price="15", :order_id="1", :description="описание")
      .cp__aside
        .cp__aside-wrap
          .cp__avatar(
            v-if="photo"
            :style="userAvatarBackground"
            @click="showPopupPhotoUpload = !showPopupPhotoUpload")
            .cp__avatar-edit
          .cp__avatar(
            v-else
            @click="showPopupPhotoUpload = !showPopupPhotoUpload")
            <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="cp__avatar-no"><path fill="currentColor" d="M324.3 64c3.3 0 6.3 2.1 7.5 5.2l22.1 58.8H464c8.8 0 16 7.2 16 16v288c0 8.8-7.2 16-16 16H48c-8.8 0-16-7.2-16-16V144c0-8.8 7.2-16 16-16h110.2l20.1-53.6c2.3-6.2 8.3-10.4 15-10.4h131m0-32h-131c-20 0-37.9 12.4-44.9 31.1L136 96H48c-26.5 0-48 21.5-48 48v288c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V144c0-26.5-21.5-48-48-48h-88l-14.3-38c-5.8-15.7-20.7-26-37.4-26zM256 408c-66.2 0-120-53.8-120-120s53.8-120 120-120 120 53.8 120 120-53.8 120-120 120zm0-208c-48.5 0-88 39.5-88 88s39.5 88 88 88 88-39.5 88-88-39.5-88-88-88z" class=""></path></svg>
            .cp__avatar-edit

          .cp__f {{ profile.family }}
          .cp__io {{ profile.name }} {{ profile.patronymic }}

          .cp__kurator
            span Ваш куратор:
            div {{kurator.family}} {{kurator.name}} {{kurator.patronymic}}
          .cp__button(@click="showPopupKuratorLetter = !showPopupKuratorLetter") Написать куратору

          .cp__button(@click="showPopup = !showPopup") Оставить заявку

          div(v-if="meRole == 2")
            .cp__location
              span.cp__location-school Школа: {{ this.school.name }}
              span.cp__location-city {{ this.school.city }}
            .cp__hr
              span.cp__hr-text Информация об оплате {{  }}
            .cp__confirm(v-if="ordersPaid.length > 0")
              <!--img.cp__confirm-i(src="@/assets/icon/ok.svg")-->
              .cp__confirm-text Оплаченных счетов:
              .cp__confirm-count {{ ordersPaid.length }}
            .cp__confirm(v-if="ordersWait.length > 0")
              <!--img.cp__confirm-i(src="@/assets/icon/no.svg")-->
              .cp__confirm-text Неоплаченных счетов:
              .cp__confirm-count.cp__confirm-count--red {{ ordersWait.length }}
            .cp__total.cp__total--dolg(v-if="ordersWait.length > 0")
              .cp__total-text Сумма долга
              .cp__total-num - {{ totalPriceFunc }} <span class="cp__total-rub">₽</span>
            .cp__total(v-else)
              .cp__total-text.cp__total-text-free Долгов нет

</template>

<script>
import axios from 'axios'
import Order from './cp/Order'
import Kurator from './cp/Kurator'
import Vote from "./module/Vote";
import Newslc from "./Newslc";
import ClassChat from "./module/ClassChat";
import Gallery from "./Gallery";
import ClassTable from "./cp/ClassTable";

export default {
  data () {
    return {
      token: localStorage.getItem('user-token'),
      profile: JSON.parse(localStorage.getItem('user-profile')),
      photo: false,
      orders: [],
      meId: false,
      showPopup: false,
      meRole: false,
      kurator: {},
      payId: 0,
      payInfo: false,
      titleVote: '',
      payError: false,
      newVote: {},
      showPopupCreateVote: false,
      showPopupPhotoUpload: false,
      showPopupKuratorLetter: false,
      letter: '',
      paySuccess: {
        on: false,
        text: 'Успешно'
      },
      votes: [],
      school: {
        name: '',
        id: '',
        city: '',
      },
      class: {
        name: '',
        id: ''
      },
      activeTab: 1,
      name: '',
      tel: '',
      text: '',
      answers: [
        {
          text: 'Первый вариант ответа'
        },
        {
          text: 'Второй вариант ответа'
        },
        {
          text: 'Третий вариант ответа'
        },
        {
          text: 'Четвертый вариант ответа'
        },
      ],
    }
  },
  metaInfo: {
    title: 'Личный кабинет – «Родители & Дети»',
  },
  mounted: async function () {
    this.getUserInfo(); // получаем информацию о пользователе
    this.getMeId();
    await this.getUserSchoolClassCity();
    this.getVotes(); // получаем данные по всем голосованиям в классе
    this.getKurator();
  },
  computed: {
    userAvatarBackground: function () {
      return 'background-image:url(http://localhost:1337' + this.photo + ')'
    },
    ordersPaid: function () {
      return this.orders.filter(function (order) {
        return order.paid == true
      })
    },
    ordersWait: function () {
      return this.orders.filter(function (order) {
        return order.paid != true
      })
    },
    totalPriceFunc: function () {
      return this.ordersWait.reduce((s, i) => s = s + i.price, 0);
    },
  },
  methods: {
    sendLetterToKurator() {
      this.sendEmailToKurator();
      this.showPopupKuratorLetter = !this.showPopupKuratorLetter;
    },

    sendEmailToKurator () {
      axios.post(`/kurator.php?email=${this.kurator.email}&name=${this.profile.name}&family=${this.profile.family}&text=${this.letter}`)
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log('sendEmail');
          console.log(error);
        });
    },

    getKurator: function () {
      axios({
        url: 'http://localhost:1337/graphql',
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        method: 'post',
        data: {
          query: `{
              class(id: "${this.class.id}") {
                name
                users (sort: "family:asc",
                where :{
                  role: "12"
                }){
                  name
                  family
                  patronymic
                  email
                }
              }
            }`
        }
      }).then((result) => {
        console.log(result.data.data.class.users[0]);
        this.kurator = result.data.data.class.users[0];
      })
        .catch(
          error => { console.log('error'); console.log(error); }
        );
    },

    submitUpload: async function (e) {
      let formElement = document.querySelector('.popup-edit-photo');
      let formData = new FormData(formElement);

      e.preventDefault();

      await axios.post('http://localhost:1337/upload', formData, {
        headers: {
          Authorization: `Bearer ${this.token}`
        },
      }).then((result) => {
        console.log('uploadPhoto success');
        console.log(result.data);
      })
      .catch(error => {
        console.log('uploadPhoto');
        console.log(error);
      });

      //Close the popup and reload photo :)
      this.showPopupPhotoUpload = !this.showPopupPhotoUpload;
      this.getUserInfo();

    },
    onInputAnswer: function(event, index) {
      const value = event.target.innerText;
      this.answers[index].text = value;
    },
    getVotes: async function () {
      let votes = [];
      let userPassedVoteIds = [];
      let currentUser = {
        id: this.profile.id,
        username: this.profile.username,
      };
      let userVotesPassed = [];

      await axios({
        url: 'http://localhost:1337/graphql',
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        method: 'post',
        data: {
          query: `
            {
              user(id: "${this.profile.id}") {
                class {
                name
                votes(sort: "created:desc") {
                  id
                  ended
                }
              }
            }
          }
        `
        }
      }).then((result) => {
        // console.log(result.data.data);
        votes = result.data.data.user.class.votes;

        console.log('All votes for class:');
        console.log(votes);
      })
      .catch(error => {
        console.log('getVotes');
        console.log(error);
      });

      await axios({
        url: 'http://localhost:1337/graphql',
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        method: 'post',
        data: {
          query: `
            {
              userstovotes(where: {
                user: "${this.profile.id}"
              }) {
                user {
                  id
                  username
                }
                vote {
                  id
                  title
                }
              }
            }`
        }
      }).then(result => {
        console.log('Votes passed of user:');
        console.log(result.data.data.userstovotes);
        userVotesPassed = result.data.data.userstovotes;

        // Наполняем массив айдишниками пройденных голосований
        userVotesPassed.forEach(passedVote => {
          userPassedVoteIds.push(passedVote.vote.id);
        });

        votes.forEach(vote => {
          userPassedVoteIds.includes(vote.id) ? vote.submitted = true : vote.submitted = false
        });


      })
      .catch(error => {
        console.log(error)
      });

      this.votes = votes;
    },

    addNewAnswer() {
      this.answers.push({
        text: 'Новый вариант ответа',
      });
    },

    popAnswer() {
      this.answers.pop();
    },

    getOrderToPay (orderId) {
      if (1 === 2) {
        this.payId = orderId;
        axios({
          url: 'http://localhost:1337/graphql',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          method: 'post',
          data: {
            query: `
            {
              order(id: "${orderId}") {
                id
                user{
                  id
                }
                paid
              }
            }
          `
          }
        }).then(result => {
          this.payInfo = result.data.data.order;
          if (this.payInfo) {
            console.log('Счёт существует');
            this.getMeId(); // обновляем переменную с ИД пользователя
            if (this.meId === +this.payInfo.user.id && !this.payInfo.paid) {
              this.payError = false; // убираем ошибку
              console.log('ID пользователя совпадает, счёт ожидает оплаты');
              this.orderFinallyPay()
            } else {
              this.paySuccess.on = false; // убираем сообщение об успехе
              this.payError = true; // ставим ошибку
              console.log('ID пользователя не совпадает или счёт уже оплачен')
            }
          } else {
            console.log('Ошибка операции со счётом')
          }
        })
        .catch(error => {
            console.log('getOrderToPay');
            console.log(error);
          });
      }
    },

    orderFinallyPay () {
      axios({
        url: 'http://localhost:1337/graphql',
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        method: 'post',
        data: {
          query: `
            mutation {
              updateOrder(input: {
                where: {
                  id: "${this.payId}"
                },
                data: {
                  paid: true
                }
              }) {
                order {
                  paid
                }
              }
            }
          `
        }
      }).then(result => {
        console.log('Счёт успешно оплачен')
        this.getUserInfo() // обновляем список счетов
        this.paySuccess.on = true // включаем сообщение об успехе
        this.paySuccess.text = `Счёт #${this.payId} успешно оплачен`;

        // UPDATE CLASSTABLE
        // this.$refs.classTable.getCurrentUser();
        this.$refs.classTable.getUsersOrders();
      })
      .catch(error => {
        console.log('orderFinallyPay');
        console.log(error);
      });
    },

    async getUserInfo () {
      await axios({
        url: 'http://localhost:1337/graphql',
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        method: 'post',
        data: {
          query: `
            {
                user(id: "${this.profile.id}") {
                role {
                  id
                }
                childname
                photo {
                  url
                }
                orders(sort: "id:desc") {
                  id
                  paid
                  price
                  tallage{
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
        // console.log(result.data.data);
        if (result.data.data.user.photo != null) {
          this.photo = result.data.data.user.photo.url;
        }
        if (result.data.data.user.orders) this.orders = result.data.data.user.orders;
        if (result.data.data.user.role.id) this.meRole = result.data.data.user.role.id;
        result.data.data.user.childname ? this.childname = result.data.data.user.childname : this.childname = 'Митька';
      })
      .catch(error => {
        console.log('getUserInfo');
        console.log(error);
      });
    },

    getMeId () {
      axios.get('http://localhost:1337/users/me' ,{
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then((result) => {
        this.meId = result.data.id
      })
      .catch(error => {
        console.log('getUserInfo');
        console.log(error);
      });
    },

    /**
     * Get school and class for user-id
     */
    getUserSchoolClassCity: async function () {
     await axios({
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
                    city {
                      city
                    }
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
        this.school.id = res.class.school.id;
        this.school.name = res.class.school.name;
        this.school.city = res.class.school.city.city;
        localStorage.setItem('user-class', JSON.stringify(this.class));
        localStorage.setItem('user-school', JSON.stringify(this.school));
      })
      .catch(error => {
        console.log('getUserSchoolClassCity');
        console.log(error);
      });
    },

    sendEmail: function () {
      axios.post(`/order.php?name=${this.name}&tel=${this.tel}&text=${this.text}`)
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log('sendEmail');
          console.log(error);
        });
    },

    submitLeadForm: function () {
      this.sendEmail();
      this.showPopup = !this.showPopup;
    },

    /**
     * Format date from new Date() to '15 ноября 2019 года'
     * @param dateNow - new Date()
     * @returns {string} - str('15 ноября 2019 года')
     */
    getDateNow: function(dateNow) {
      let strDate = '';

      //Add days of month
      strDate += dateNow.getDate();
      strDate += ' ';

      //Add month
      let month = dateNow.getMonth();
      switch (month) {
        case 0: strDate += 'январь'; break;
        case 1: strDate += 'февраля'; break;
        case 2: strDate += 'марта'; break;
        case 3: strDate += 'апреля'; break;
        case 4: strDate += 'мая'; break;
        case 5: strDate += 'июня'; break;
        case 6: strDate += 'июля'; break;
        case 7: strDate += 'августа'; break;
        case 8: strDate += 'сентября'; break;
        case 9: strDate += 'октября'; break;
        case 10: strDate += 'ноября'; break;
        case 11: strDate += 'декабря'; break;
      }
      strDate += ' ';


      //Add year
      strDate += dateNow.getFullYear();

      return strDate;
    },

    submitCreateVoteForm : async function () {
      console.log(this.answers);
      console.log(this.titleVote);
      let date = this.getDateNow(new Date());

      //create new vote
      await axios ({
        url: 'http://localhost:1337/graphql',
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        method: 'post',
        data: {
          query: `
            mutation {
              createVote(input: {
                data: {
                  title: "${this.titleVote}"
                  ended: false
                  created: "${date}"
                  class: ${this.class.id}
                }
              }) {
                vote {
                  id
                  title
                  ended
                  created
                  class {
                    name
                  }
                }
              }
            }
          `
        }
      }).then(result => {
        console.log('Вопрос создан');
        this.newVote = result.data.data.createVote.vote;
        console.log(result.data.data.createVote.vote);
      })
      .catch(error => {
        console.log('submitCreateVoteForm');
        console.log(error);
      });


      this.answers.forEach((answer, index) => {
        axios({
          url: 'http://localhost:1337/graphql',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          method: 'post',
          data: {
            query: `
            mutation {
              createAnswer(input: {
                data: {
                  answer: "${answer.text}"
                  count: 0
                  vote: "${this.newVote.id}"
                }
              }) {
                answer {
                  id
                  answer
                  count
                  vote {
                    title
                    id
                  }
                }
              }
            }
          `
          }
        })
        .then(result => {
          console.log('Ответ создан: #' + index);
          console.log(answer.text);
          console.log(result.data.data.createAnswer.answer);
        })
        .catch(error => {
          console.log('createAnswer');
          console.log(error);
        });
      });
      this.getVotes();
      this.showPopupCreateVote = !this.showPopupCreateVote;

    },

    submittedCreateVote: function () {
      // this.showPopupCreateVote = !this.showPopupCreateVote;

    }
  },
  components: {
    ClassTable,
    Gallery,
    ClassChat,
    Newslc,
    Vote,
    Order,
    Kurator
  }
}
</script>

<style lang="stylus">
@import url('https://fonts.googleapis.com/css?family=Rubik&display=swap')
@import url('https://fonts.googleapis.com/css?family=Roboto&display=swap')
.cp__popup-form.popup-create-vote
  height: auto;
  padding: 1rem 0;
.cp__popup-input.title-create-vote
  border: 1px solid #E5E5E5
  border-radius: 10px;
  padding: 10px;
.add-answer-button
  padding: 10px 20px;
  background: #e5e5e5;
  border-radius: 30px;
  font-size: 2rem;
  display: flex;
  align-items: center;
  margin: 1rem auto 0;
.buttons-wrapper
  display: flex
  flex-direction: row
  justify-content: space-around
  width: 50%
.answer-wrapper
  margin-top: 1rem
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
.answer
  &:not(:last-child) {
    border-bottom: 1px solid #e5e5e5;
    margin-bottom: .5rem
  }

.order-success
  background #f9fef6
  padding 20px 10px 20px 20px
  border-left 2px solid #addb31
  color: #023c0a
  text-align center

.order-error
  background #fef6f6
  padding 20px 10px 20px 20px
  border-left 2px solid #f43737
  color: #710000;
  text-align center

.order-table
  display flex
  /*padding 0 0 0 20px*/
  padding-right 175px
  color #909cb4
  margin-bottom 10px
  @media (max-width 768px)
    display none
  &__id
    /*width 40px*/
    /*padding 20px 10px 20px 0*/
    display flex
    align-items center
  &__name
    display flex
    font-family: 'Rubik', sans-serif;
    font-size: 0.85rem
    align-items center
    padding 20px 5px
    flex 1
  &__price
    display flex
    align-items center
    justify-content center
    text-align center
    padding 20px 10px
    font-family: 'Rubik', sans-serif;
    font-size: 0.85rem
    white-space nowrap
    text-align center
    width: 240px

.order-none
  color rgba(60,60,60,.7)
  display flex
  text-align center
  justify-content center
  align-items center
  padding 80px 0

.cp
  padding-top 4rem
  padding-bottom 8rem
  @media (max-width 768px)
    padding-top 0
    padding-bottom 4rem
  &__popup
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    background: rgba(32,32,32,0.9)
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    z-index: 100
    &-close
      width: 40px
      height: 40px
      position: absolute
      top: 3%;
      right: 3%;
      background: url("../assets/image/close-svg.svg") no-repeat
      background-size cover
    &-form
      position: relative
      font-family: "Rubik"
      background: #ffffff
      display: flex
      flex-direction: column
      justify-content: center
      align-items: center
      width: 40%
      height: 45%
    &-label
      margin: 1rem 0
      font-size: 1.2rem
      font-family: "Roboto"
      font-weight: bold
      line-height: 1.6rem
    &-submit
      margin-top: 2rem
      background: #6D37f4
      color: white
      border: none
      outline: none
      padding: .5rem
      margin-bottom: .5rem
    &-input
      width: 70%
      border: none
      border-bottom: 1px solid #E5E5E5
      &:not(:first-child)
        margin-top: 1.5rem
      &:last-child
        border:none
      &::placeholder
        font-family: "Rubik"
    &-input-large
      min-height: 60px
  &__button
    margin-top: 1rem
    align-self: center
    cursor: pointer
    padding: 10px
    color white
    width: 60%
    background-color: #6d37f4
  &__location
    display: flex
    flex-direction: row
    justify-content: space-evenly
    align-items: center
    margin-top: 7%
    &-school
      padding-left: 2rem
      background: url("../assets/image/old-school.svg") no-repeat 5% center;
    &-city
      padding-left: 2rem
      background: url("../assets/image/placeholder.svg") no-repeat 5% center;
  &__mw
    display grid
    grid-template-columns: 1.5fr 5fr 3fr
    grid-gap 1rem
    @media (max-width 768px)
      display flex
      flex-direction: column-reverse;
      padding-left 0
      padding-right 0
  &-tabs
    display: flex
    flex-direction: column
    position: sticky
    top: 20px
    height: fit-content
    .active-tab
      background: #6D37F4
      box-sizing: border-box;
      box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
      border-radius: 6px 6px 0 6px;

      .cp-tabs__tab-name
        color: #ffffff
      .cp-tabs__tab-count
        color: #6D37F4
        background: #ffffff
        box-shadow: 0 4px 8px rgba(255, 255, 255, 0.15);

    &__tab
      transition: background-color 0.8s, color 0.8s, border 0.8s
      font-family: 'Rubik', sans-serif
      font-size: 13px
      font-weight: 600
      background: #E5E5E5
      color: #909CB4
      padding: 19px 15px;
      display: flex
      flex-direction: row
      justify-content: flex-start
      align-items: center
      &-name
        margin-left: 11%
      &-count
        color: white
        padding: 4px 7px 3px 5px
        background: #6D37F4
        font-size: 9px
        text-align: center
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
        border-radius: 5px 5px 0 5px;
      &:not(:last-child)
        margin-bottom: 7%
  &__content-balance
    display: flex
    flex-direction: row
    justify-content: space-between
    align-items: center
    color: #ffffff
    background: #6D37F4
    padding: 0.74rem 1.7rem
    margin-bottom: 2%
    &__title
      font-family: "Rubik"
      font-weight: bold
      font-size: 20px
      line-height: 23px
    &__count
      font-family: 'Rubik';
      font-weight: bold;
      font-size: 25px;
      line-height: 29px;
      display: flex
      flex-direction: row
      align-items: center
    &__valute
      font-family: 'Rubik'
      font-size: 15px;
      line-height: 18px;
      font-weight: 500
      margin-left: 5%
  &__content-wrap
    background #ffffff
    box-shadow 0px 15px 35px rgba(0, 0, 0, 0.05)
    padding 20px 20px 40px
  &__aside-wrap
    font-family: 'Rubik'
    position sticky
    top 20px
    background #ffffff
    box-shadow 0px 15px 35px rgba(0, 0, 0, 0.05)
    padding 3rem 1rem
    text-align center
    display: flex
    flex-direction: column
  &__avatar
    width 150px
    position: relative
    height 150px
    border-radius 50%
    background-color #f5f5f5
    background-size 80%
    background-repeat no-repeat
    background-position center
    margin 0 auto 1rem
    display flex
    justify-content center
    align-items center
    color #d0d0d0
    &-edit
      display: none;
      transition all 1s
      position: absolute
      width: 100%
      height: 100%
      background: rgba(2,2,2,.85) url("../assets/icon/edit-pen.svg") no-repeat center
      background-size 50%
      border-radius 50%
    &:hover
      .cp__avatar-edit
        display: block
    &-no
      height 70px
  &__io
    font-size 1.7rem
  &__f
    font-size: 1.7rem
    font-weight 600
  &__kurator
    margin-top: 1rem
    font-weight: 700
    font-size: 1.2rem
    span
      font-weight: 400
      font-size: 1rem

  &__hr
    margin-top 2rem
    margin-bottom 2rem
    position relative
    text-align center
    /*&:before
      content ''
      border-top 1px solid #e5e5e5
      width 100%
      display block
      position absolute
      top calc(50% + 1px) */
    &-text
      padding 0 1rem
      font-family: Rubik, sans-serif
      font-size: 0.85rem;
      color: #37445E
      font-weight: 600
      position relative
      background #ffffff
  &__confirm
    display flex
    line-height 26px
    margin:  1rem 0 1rem 1.3rem
    @media screen and (max-width:1366px) {
      margin:  1rem 0 1rem .3rem
    }
    /*margin-left: 3.3rem;*/
    &-i
      margin-right .5rem
    &-text
      margin-right .5rem
    &-count
      position: absolute
      right: 10%
      font-weight 600
      background: #54D581
      width: 44px
      box-shadow: 0 10px 20px rgba(84, 213, 129, 0.25)
      border-radius: 10px 10px 10px 0
    &-count--red
      background: #FF4C45
  &__total
    background #f9f9f9
    margin 2rem -1rem -3rem
    padding 3rem 1rem 3rem
    &-text
      font-weight 600
      font-size: 1rem
      color: #fff
    &-text.cp__total-text-free
      color: #222;
      font-size: 1.2rem
    &-num
      display: flex
      flex-direction: row
      align-items: center
      justify-content: center
      font-size 3.33rem
      font-weight 800
      color: #fff
      margin-top 1rem
    &-rub
      font-weight 400
      font-size: 2rem
      color: #fff
      margin-left: .5rem
  &__total--dolg
    background #FF4C45

.add-vote
  text-align: center
  margin: 2rem auto 0
</style>
