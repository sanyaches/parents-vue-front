<template lang="html">
  <div class="vote" :class="{'vote-active': voteActive&&!voteSubmit, 'vote-end': voteEnd}">

    <div class="vote-head">
      <div class="vote-title">Место проведения праздника</div>
      <div v-if="!voteSubmit" class="vote-date">25 апреля 2019</div>
      <div v-if="voteSubmit" class="vote-date-passed">Голосование создано: 25 апреля 2019</div>

    </div>

    <div class="vote-state--continue" v-if="voteSubmit && !voteEnd">Голосование идет</div>
    <div class="vote-state--end" v-if="voteSubmit && voteEnd">Голосование окончено</div>

    <form v-if="voteActive && (!voteSubmit)" class="vote-form" action="">
      <p class="vote-input-wrapper" ><input class="vote-input" name="vote" type="radio" checked value="Парке">Собраться в парке</p>
      <p class="vote-input-wrapper" ><input class="vote-input" name="vote" type="radio" value="Зал в Армаде">Снять зал в Армаде</p>
      <p class="vote-input-wrapper" ><input class="vote-input" name="vote" type="radio" value="Пойти с классом в аквапарк">Пойти с классом в аквапарк</p>
      <p class="vote-input-wrapper" ><input class="vote-input" name="vote" type="radio" value="Никуда не хочу идти">Никуда не идти</p>
      <div class="vote-submit-wrapper">
        <input @click="voteSubmit = true" class="vote-submit" type="submit" value="Проголосовать">
        <button class="vote-curator" value="">Связаться с куратором</button>
      </div>
    </form>



  </div>
</template>

<script>
    export default {
      name: "Vote",
      props: {
        voteActive : {
          type: Boolean,
          default: true,
        },
        voteEnd: {
          type: Boolean,
          default: false,
        },
        voteSubmit: {
          type: Boolean,
          default: true,
        },
      },
    }
</script>

<style scoped lang="stylus">
  .vote
    display: flex
    flex-direction: row
    align-items: center
    justify-content: space-between
    background: #F9F9F9
    color: #37445E;
    padding: 26px 39px;
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
