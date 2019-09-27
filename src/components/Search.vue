<template lang="pug">
  .search
    form(v-on:submit.prevent = "update()")
      input.search__input(v-model="searchPhrase")
      button.button-search(type='submit')
</template>

<script>
export default {
  name: 'search',
  methods: {
    update () {
        this.$router.push('/searched');
    }
  },
  computed: {
    searchPhrase: {
      get () {
        return this.$store.state.searchPhrase
      },
      set (value) {
        this.$store.commit('updatePhrase', value)
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.search
  width: 223px
  height: 52px
  background: rgba(255, 255, 255, 0.2)
  form
    height: 100%
    position: relative
    input
      background: transparent
      border: none
      width: 80%
      height: 100%
      position: absolute
      color white
      padding: .5rem
    .button-search
      position: absolute
      width: 20%
      right: 0
      border: none
      height: 100%
      background: url("../assets/icon/search-line.svg") no-repeat center
</style>
