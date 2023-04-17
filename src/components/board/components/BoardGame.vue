<script>
import { mapStores, mapState } from 'pinia';
import { useBoardCardsStore } from '../../../stores/board';
import ModalPlayer from './ModalPlayer.vue';
export default {
  components: { ModalPlayer },
  data() {
    return {
      playerName: '',
      maxFlippedCards: 2,
      selected: 0,
      cards: [],
      found: 0,
      failures: 0,
      timer: 5
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
        if (this.cardsSelected <= this.maxFlippedCards) {
          useBoardCardsStore().markSelectedCard({ card, visible: true });
          this.cards.push(card);
        }
        setTimeout(() => {
          if (this.cards.length === this.maxFlippedCards) {
            const attempts = this.cards.every((selected) => selected.name === this.cards[0].name);
            if (attempts) {
              this.found = this.found +  1;
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
      this.interval = setInterval(() => {
        if (this.timer === 0) {
          clearInterval(this.interval)
        } else {
          this.timer--
        }
      }, 1000)
      setTimeout(() => this.hideCardsBoard(), 5000);
    },
    hideCardsBoard() {
      useBoardCardsStore().hideCards();
    },
    async getBoardCards(pairCards) {
      this.cardsSelected = 0;
      this.found = 0;
      this.cards = [];
      await useBoardCardsStore().getCards(pairCards);
    },
    async getGameInfo({ player, pairCards }) {
      this.playerName = player;
      useBoardCardsStore().setPlayer(player);
      await this.getBoardCards(pairCards);
      await this.prepareBoard();
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="row" v-if="!player">
      <div class="col-12 mt-2">
        <ModalPlayer @get-game-info="getGameInfo" />
      </div>
    </div>
    <div class="row" v-if="player">
      <div class="col-12 mt-2 text-center">
        <h2 class="green">
          ¡Hi {{player}}! Welcome to MemoryGame
        </h2>
        <h4 v-if="timer !== 0" class="text-danger">
          Get Ready in {{timer}}
        </h4>
        <h4>
          <b class="text-danger">Attempts:</b> {{failures}}
          <b class="text-success">Hits:</b> {{found}}
        </h4>
      </div>
      <div class="col-12 mt-2 text-center">
        <div class="row d-flex justify-content-around">
          <div
            class="col-lg-2 col-md-4 col-sm-3 col-3"
            v-for="(card, index) in boardCardsRandom"
            :key="index"
          >
            <div class="card-game m-2">
              <img v-if="boardCards[card].show" :src="boardCards[card].image" class="image-box" alt="?" />
              <img
                v-if="!boardCards[card].show"
                src="/public/bg-card-1.jpg"
                :class="{ 'disabled': card.show || cards.length === maxFlippedCards }" alt="?"
                class="image-box" @click="selectCard(boardCards[card])"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
