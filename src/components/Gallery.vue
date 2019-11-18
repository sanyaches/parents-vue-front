<template lang="pug">
  .wrapper
    form.form.flex-column(@submit.prevent="onSubmit" v-if="showFormEventCreate")
      .form-close(@click="showFormEventCreate = !showFormEventCreate")
      .flex-row.space-around.aic
        label Создание события
        input.input(v-model="eventName" @input="clearEventErr" placeholder="Название события")
      .error(v-if="errorEventForm.exist") {{errorEventForm.text}}
      button.button.button-form(@click="createEvent") Создать событие
    form.form.add-photo.flex-column(@submit.prevent="onSubmit" v-show="showFormAddPhoto")
      .form-close(@click="showFormAddPhoto = !showFormAddPhoto")
      .flex-column.space-around.aic
        label Добавление фото
        input#imageUploadFile(type="file" name="files" @input="clearPhotoErr")
        input(type="text" name="ref" value="photo" v-show="false")
        input(type="text" name="refId" :value="photoId" v-show="false")
        input(type="text" name="field" value="image" v-show="false")
      .error(v-if="errorPhotoForm.exist") {{errorPhotoForm.text}}
      button.button.button-form(@click="addPhoto") Добавить фотографию
    .buttons.flex-row.jcc
      button.button(v-if="!galleryExist" @click="createGallery") Создать галерею
      .flex-row(v-else)
        button.button(type="submit"
          @click="showFormEventCreate = !showFormEventCreate"
          v-show="!showFormEventCreate && !showFormAddPhoto") Создать событие
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
          :data-src="`https://parents-children.herokuapp.com${photo.image.url}`"
          :key="index")
          .gallery-image-desc
            .gallery-image-desc__name {{ event.eventName }}
            .gallery-image-desc__date {{ event.timeStamp }}
          img.gallery-image-picture(:src="`https://parents-children.herokuapp.com${photo.image.url}`")
        .add-image-wrap
          .gallery-add-image(@click="createPhoto(event.id)") +
</template>

<script>
  import axios from 'axios';
  const errorEmptyEventName = 'Введите название события и повторите попытку!';
  const errorEmptyPhoto = 'Не найдено изображение, загрузите и повторите попытку добавления!';

  export default {
    name: "Gallery",

    data() {
      return {
        class: JSON.parse(localStorage.getItem('user-class')),
        galleryExist: false,
        galleryId: '',
        eventName: '',
        eventId: '',
        photoId: localStorage.getItem('photo-id'),
        token: localStorage.getItem('user-token'),
        profile: JSON.parse(localStorage.getItem('user-profile')),
        events: [],
        showFormEventCreate: false,
        showFormAddPhoto: false,
        errorEventForm: {
          exist: false,
          text: errorEmptyEventName
        },
        errorPhotoForm: {
          exist: false,
          text: errorEmptyPhoto
        },
      }
    },

    created () {
      window.addEventListener('beforeunload', this.removePhotoLocalStorage);

      this.initializeGallery();
    },

    beforeDestroy() {
      this.removePhotoLocalStorage();
    },

    methods: {
      removePhotoLocalStorage () {
        let photoId = null;
        this.eventId = '';

        if (localStorage.getItem('photo-id') !== null){
          photoId = localStorage.getItem('photo-id');
          localStorage.removeItem('photo-id');
        }

        if(photoId !== null) {
          axios({
            url: 'https://parents-children.herokuapp.com/graphql',
            headers: {
              Authorization: `Bearer ${this.token}`
            },
            method: 'post',
            data: {
              query: `
              mutation {
                deletePhoto(input: {
                  where: {
                    id: "${photoId}"
                  }
                }) {
                  photo {
                    id
                  }
                }
              }
            `
            }
          }).then(result => {
            console.log('Фото удалена из бд в связи с неиспользованием');
          })
            .catch(error => {
              console.log(error);
            })
        }
      },

      clearEventErr() {
        this.errorEventForm.exist = false;
      },

      clearPhotoErr() {
        this.errorPhotoForm.exist = false;
      },

      /**
       * Get Gallery for class with GraphQL query
       */
      initializeGallery() {
        this.checkExistGallery();
        this.getEvents();
      },

      checkExistGallery() {
        axios({
          url: 'https://parents-children.herokuapp.com/graphql',
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
          url: 'https://parents-children.herokuapp.com/graphql',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          method: 'post',
          data: {
            query: `
            {
              events(sort: "created_at:desc", where: {
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
          url: 'https://parents-children.herokuapp.com/graphql',
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
        if (!this.eventName) {
          this.errorEventForm.exist = true;
        }
        else {
          this.errorEventForm.exist = false;

          axios({
            url: 'https://parents-children.herokuapp.com/graphql',
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
            this.getEvents();
          })
            .catch(error => {
              console.log("CreateEventError!");
              console.log(error);
              this.eventName = '';
            });
        }
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

      scrollToAdditionPhoto() {
        document.querySelector('.add-photo').scrollIntoView();
      },

      createPhoto (eventId) {
        if (this.eventId === '') {
          this.eventId = eventId;
        }

        if (this.eventId !== eventId) {
          this.removePhotoLocalStorage();
        }

        if (this.showFormEventCreate) {
          this.showFormEventCreate = !this.showFormEventCreate
        }

        if (localStorage.getItem('photo-id') !== null) {
          console.log("Get Photo from local storage!");
          this.photoId = localStorage.getItem('photo-id');

          if (!this.showFormAddPhoto) {
            this.showFormAddPhoto = !this.showFormAddPhoto;
          }
          //scroll to form addition photo
          setTimeout(this.scrollToAdditionPhoto, 200);
        }
        else {
          axios({
            url: 'https://parents-children.herokuapp.com/graphql',
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

            if (!this.showFormAddPhoto) {
              this.showFormAddPhoto = !this.showFormAddPhoto;
            }

            //Set localStorage for validation in the future
            localStorage.setItem('photo-id', this.photoId);
            //scroll to form addition photo
            setTimeout(this.scrollToAdditionPhoto, 200);
          })
            .catch(error => {
              console.log("CreatePhotoError!");
              console.log(error);
            });
        }
      },

      addPhoto: async function () {
        if( document.getElementById("imageUploadFile").files.length === 0 ){
          this.errorPhotoForm.exist = true;
        }
        else {
          this.clearPhotoErr();

          let formElement = document.querySelector('.form.add-photo');
          let formData = new FormData(formElement);

          await axios.post('https://parents-children.herokuapp.com/upload', formData, {
            headers: {
              Authorization: `Bearer ${this.token}`
            },
          }).then((result) => {
            console.log('uploadPhoto success');
            console.log(result.data);
            this.showFormAddPhoto = !this.showFormAddPhoto;

            // clear localStorage photo-id
            localStorage.removeItem('photo-id');
            this.photoId = null;

            this.getEvents();
          })
            .catch(error => {
              console.log('uploadPhoto');
              console.log(error);
            });
        }
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
    padding: 2rem
    background: #e5e5e5
    position: relative
    &-close
      width: 40px
      height: 40px
      position: absolute
      top: 0;
      right: 0;
      background: url("../assets/image/close-svg.svg") no-repeat
      background-size cover
    .error
      padding: .2rem
      line-height: 140%
      color: #f43737
      text-align: center
    label
      font-size: 1.3rem
    .button.button-form
      line-height: 3rem
      font-size: 1rem
      align-self center
    input
      margin-top: 1rem
    input.input
      margin-top 0
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
    &:not(:first-child)
      margin-top: 2rem
  .gallery
    display: flex
    flex-direction: row
    flex-wrap: wrap
    justify-content: space-between
    align-items: center
    margin-top: 1.5rem
    & > *
      margin: 1rem 0;
    &:after {
      content: "";
      flex: auto;
    }
    .add-image-wrap
      width: 38%;
      display: flex
      align-items: center
      justify-content: center
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
      width: 31%
      transition: all .8s
      flex-basis: 31%
      &-picture
        width: 100%
        height: 170px
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
