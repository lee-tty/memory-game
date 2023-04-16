<script>
import { mapStores, mapState } from 'pinia';
import { useBoardCardsStore } from '../../../stores/board';
import ModalPlayer from './ModalPlayer.vue';
export default {
  components: { ModalPlayer },
  data() {
    return {
      playerName: '',
      maxCardsSelected: 2,
      selected: 0,
      cards: [],
      found: 0,
      failures: 0
    }
  },
  computed: {
    ...mapStores(useBoardCardsStore),
    ...mapState(useBoardCardsStore, ['boardCards', 'boardCardsRandom', 'player']),
  },
  methods: {
    selectCard(card) {
      if (!card.show) {
        this.cardsSelected = this.cardsSelected + 1;
        if (this.cardsSelected <= this.maxCardsSelected) {
          useBoardCardsStore().markSelectedCard({ card, visible: true });
          this.cards.push(card);
        }
        setTimeout(() => {
          if (this.cards.length === this.maxCardsSelected) {
            const attempts = this.cards.every((selected) => selected.name === this.cards[0].name);
            if (attempts) {
              this.found = this.found + this.maxCardsSelected;
              this.cards.forEach((selected) => {
                useBoardCardsStore().markFoundCard(selected);
              });
            } else {
              this.failures = this.failures + 1;
              this.cards.forEach((selected) => {
                useBoardCardsStore().markSelectedCard({ card: selected, visible: false });
              });
            }
            this.cardsSelected = 0;
            this.cards = [];
          }
        }, 2000)
      }
    },
    prepareBoard: function () {
      setTimeout(() => this.hideCardsBoard(), 3000);
    },
    hideCardsBoard() {
      useBoardCardsStore().hideCards();
    },
    async getBoardCards() {
      this.cardsSelected = 0;
      this.found = 0;
      this.cards = [];
      await useBoardCardsStore().getCards();
    },
    async getPlayerName(player) {
      this.playerName = player;
      useBoardCardsStore().setPlayer(player);
      await this.getBoardCards();
      await this.prepareBoard();
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-12 text-center mt-5">
        <ModalPlayer @get-player-name="getPlayerName" v-if="!player" />
      </div>
    </div>
    <div class="">
      Welcome {{player}}
      <button class="btn btn-primary mt-3" @click="prepareBoard()">
        START
      </button>
    </div>
    <div class="row" v-if="player">
      <div class="col-12">
        <h2 class="green">
          Bienvenido a MemoryGame
        </h2>
        <div>
          Fallos: {{failures}}
          Encontradas: {{found}}
        </div>
      </div>
      <div class="row">
        <div
          class="col-md-3 col-6 card-game m-3"
          v-for="(card, index) in boardCardsRandom"
          :key="index"
        >
          <img v-if="boardCards[card].show" :src="boardCards[card].image" class="image-box img-thumbnail " alt="...">
          <div
            v-if="!boardCards[card].show"
            class=" card-reverse" @click="selectCard(boardCards[card])"
            :class="{ 'disabled': card.show || cards.length === maxCardsSelected }"
          >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
