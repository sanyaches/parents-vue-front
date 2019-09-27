<template lang="pug">
  .wrapper
    .year
      .year-number 2019
    .spotlight-group.gallery
      .spotlight.gallery-image(v-for='image in images' :data-src="image.fullHref")
        .gallery-image-desc
          .gallery-image-desc__name {{ image.event }}
          .gallery-image-desc__date {{ image.date }}
        img.gallery-image-picture(:src="image.src")
</template>

<script>
    export default {
        name: "Gallery",
      data() {
          return {
            images : [
              {
                event: 'Открытый урок литературы',
                date: '10 сентября 2019',
                src: require('../assets/image/gallery1.jpg'),
                fullHref: require('../assets/image/gallery1.jpg'),
              },
              {
                event: 'Праздник на природе',
                date: '11 сентября 2019',
                src: require('../assets/image/gallery2.jpg'),
                fullHref: require('../assets/image/gallery2.jpg'),
              },
              {
                event: 'День рождение Татьяны',
                date: '13 сентября 2019',
                src: require('../assets/image/gallery3.jpg'),
                fullHref: require('../assets/image/gallery3.jpg'),
              },
              {
                event: 'Открытый урок литературы',
                date: '10 сентября 2019',
                src: require('../assets/image/gallery1.jpg'),
                fullHref: require('../assets/image/gallery1.jpg'),
              },
              {
                event: 'Праздник на природе',
                date: '11 сентября 2019',
                src: require('../assets/image/gallery2.jpg'),
                fullHref: require('../assets/image/gallery2.jpg'),
              },
              {
                event: 'День рождение Татьяны',
                date: '13 сентября 2019',
                src: require('../assets/image/gallery3.jpg'),
                fullHref: require('../assets/image/gallery3.jpg'),
              },
              {
                event: 'Праздник на природе',
                date: '11 сентября 2019',
                src: require('../assets/image/gallery2.jpg'),
                fullHref: require('../assets/image/gallery2.jpg'),
              },
            ]
          }
      }
    }
</script>

<style scoped lang="stylus">
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
      padding: 0 .7rem;
      width: 100%
      text-align: left;
      overflow: hidden;
      &::after
        content: ''
        position: absolute
        top: 45%
        width: 85%
        height: 1px
        background: #E5E5E5
        margin:0 2%

  .gallery
    display: flex
    flex-direction: row
    flex-wrap: wrap
    justify-content: space-between
    &-image
      position: relative
      width: 32%
      margin-top: 1.22rem
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
