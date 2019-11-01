<template lang="pug">
  .wrapper
    form.form.flex-column(@submit.prevent="onSubmit" v-if="showFormEventCreate")
      .flex-row.space-around.aic
        label Создание события
        input.input(v-model="eventName" placeholder="Название события")
      button.button.button-form(@click="createEvent") Создать событие
    form.form.add-photo.flex-column(@submit.prevent="onSubmit" v-if="showFormAddPhoto")
      .flex-row.space-around.aic
        label Добавление фото
        input(type="file" name="files")
        input(type="text" name="ref" value="photo" v-show="false")
        input(type="text" name="refId" :value="photoId" v-show="false")
        input(type="text" name="field" value="image" v-show="false")
      button.button.button-form(@click="addPhoto") Добавить фотографию
    .buttons.flex-row.jcc
      button.button(v-if="!galleryExist" @click="createGallery") Создать галерею
      .flex-row(v-else)
        button.button(type="submit"
          @click="showFormEventCreate = !showFormEventCreate"
          v-show="!showFormEventCreate") Создать событие
        //button.button(type="submit"
          @click="createPhoto"
          v-show="!showFormAddPhoto") Добавить фото
    .event(v-for="(event, index) in events" :key="index")
      .year
        .year-number
          b {{ event.eventName }}
          span  - {{ event.timeStamp }}
      .spotlight-group.gallery
        .spotlight.gallery-image(v-for='(photo, index) in event.photos'
          :data-src="`http://localhost:1337${photo.image.url}`"
          :key="index")
          .gallery-image-desc
            .gallery-image-desc__name {{ event.eventName }}
            .gallery-image-desc__date {{ event.timeStamp }}
          img.gallery-image-picture(:src="`http://localhost:1337${photo.image.url}`")
        .gallery-add-image(@click="createPhoto(event.id)") +
</template>

<script>
  import axios from 'axios';

  export default {
    name: "Gallery",
    data() {
      return {
        class: JSON.parse(localStorage.getItem('user-class')),
        galleryExist: false,
        galleryId: '',
        eventName: '',
        photoId: '',
        token: localStorage.getItem('user-token'),
        profile: JSON.parse(localStorage.getItem('user-profile')),
        events: [],
        showFormEventCreate: false,
        showFormAddPhoto: false,
      }
    },
    created () {
      this.initializeGallery();
    },
    methods: {

      /**
       * Get Gallery for class with GraphQL query
       */
      initializeGallery() {
        this.checkExistGallery();
        this.getEvents();
      },

      checkExistGallery() {
        axios({
          url: 'http://localhost:1337/graphql',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          method: 'post',
          data: {
            query: `
          {
            galleries(where: {
              class: ${this.class.id}
            }){
              id
            }
          }
          `
          }
        }).then(result => {
          // console.log(result);
          this.galleryExist = !!result.data.data.galleries.length;
          this.galleryExist ? this.galleryId = result.data.data.galleries[0].id : ''
        })
        .catch(error => {
          console.log("CheckExistGalleryError!");
          console.log(error);
          this.galleryExist = false;
        });
      },

      getEvents() {
        axios({
          url: 'http://localhost:1337/graphql',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          method: 'post',
          data: {
            query: `
            {
              events(sort: "created_at:asc", where: {
                gallery: "${this.galleryId}"
              }) {
                id
                timeStamp
                eventName
                photos {
                  image {
                    url
                  }
                }
              }
            }`
          }
        }).then(result => {
          console.log('Success load events');
          console.log(result);
          this.events = result.data.data.events;
        })
        .catch(error => {
          console.log('Error load events');
          console.log(error)
        });
      },

      createGallery() {
        axios({
          url: 'http://localhost:1337/graphql',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          method: 'post',
          data: {
            query: `
            mutation {
              createGallery(input: {
                data: {
                  class: ${this.class.id}
                }
              }){
                gallery {
                  id
                  created_at
                }
              }
            }
          `
          }
        }).then(result => {
          console.log("CreateGallerySuccess!");
          console.log(result);
          this.checkExistGallery();
        })
        .catch(error => {
          console.log("CreateGalleryError!");
          console.log(error);
        });
      },

      createEvent() {
        axios({
          url: 'http://localhost:1337/graphql',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          method: 'post',
          data: {
            query: `
              mutation {
                createEvent(input: {
                  data: {
                    gallery: ${this.galleryId}
                    eventName: "${this.eventName}"
                    timeStamp: "${this.formatDate(new Date())}"
                  }
                }){
                  event {
                    id
                    timeStamp
                    eventName
                    gallery {
                      id
                    }
                  }
                }
              }
            `
          }
        }).then(result => {
          console.log("CreateEventSuccess!");
          console.log(result);
          this.showFormEventCreate = !this.showFormEventCreate;
          this.eventName = '';
        })
        .catch(error => {
          console.log("CreateEventError!");
          console.log(error);
          this.eventName = '';
        });
      },

      /**
       * Return string formatted from now date
       * @param date ( Date() )
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

      createPhoto (eventId) {
        axios({
          url: 'http://localhost:1337/graphql',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          method: 'post',
          data: {
            query: `
              mutation {
                createPhoto(input: {
                  data: {
                    event: ${eventId}
                  }
                }){
                  photo {
                    id
                  }
                }
              }
            `
          }
        }).then(result => {
          console.log("CreatePhotoSuccess!");
          console.log(result);
          this.photoId = result.data.data.createPhoto.photo.id;
          this.showFormAddPhoto = !this.showFormAddPhoto;

          //scroll to form addition photo
          document.querySelector('.add-photo').scrollIntoView();
        })
        .catch(error => {
          console.log("CreatePhotoError!");
          console.log(error);
        });
      },

      addPhoto: async function () {
        let formElement = document.querySelector('.form.add-photo');
        let formData = new FormData(formElement);

        await axios.post('http://localhost:1337/upload', formData, {
          headers: {
            Authorization: `Bearer ${this.token}`
          },
        }).then((result) => {
          console.log('uploadPhoto success');
          console.log(result.data);
          this.showFormAddPhoto = !this.showFormAddPhoto;
          this.getEvents();
        })
        .catch(error => {
          console.log('uploadPhoto');
          console.log(error);
        });
      },

      onSubmit () {
        //do something
      },
    },
  }
</script>

<style scoped lang="stylus">
  .form
    font-family: 'Rubik', sans-serif
    label
      font-size: 1.3rem
    .button.button-form
      line-height: 3rem
      font-size: 1rem
      align-self center
    input.input
      &::placeholder
        font-family: 'Rubik', sans-serif
  .buttons
    margin-bottom: 2rem
  .year
    font-family: "Rubik";
    font-style: normal;
    font-weight: normal;
    font-size: 1rem;
    line-height: 120%;
    display: flex;
    align-items: center;
    text-align: center;
    color: #37445E;
    &-number
      position: relative
      width: 100%
      text-align: left
      overflow: hidden
      &::after
        content: ''
        position: absolute
        top: 45%
        width: 85%
        height: 1px
        background: #E5E5E5
        margin:0 2%
  .event
    padding: 0 0.7rem
  .gallery
    display: flex
    flex-direction: row
    flex-wrap: wrap
    justify-content: space-between
    align-items: center
    margin-top: 1.5rem
    &-add-image
      width: 5rem
      height: 5rem
      font-size: 2rem
      border-radius: 100%
      background: #6D37F4
      color: #ffffff
      display: flex
      flex-direction: column
      justify-content: center
      align-items: center
      cursor: pointer
    &-image
      position: relative
      width: 32%
      transition: all .8s
      &-picture
        width: 100%
        height: auto
        z-index: 1
        transition: all .8s
      &-desc
        padding: 1rem;
        color: transparent
        background transparent
        position: absolute
        width: 100%
        height: 100%
        transition: all .8s
        display: none
        font-family: "Rubik";
        font-style: normal;
        font-weight: normal;
        &__name
          font-size: .8rem;
          line-height: 120%;
          width: 90%
        &__date
          font-size: .55rem;
          line-height: 120%;
          margin-top: .55rem
      &:hover
        .gallery-image-desc
          color: #ffffff
          background: linear-gradient(14.47deg, #6D37F4 -9.32%, rgba(255, 255, 255, 0) 119.38%)
          z-index: 2
          display: flex;
          flex-direction: column
          justify-content: flex-end
        .gallery-image-picture
          opacity: .6;
          filter blur(1px)

</style>
