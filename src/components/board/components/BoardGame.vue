<script>
import { mapStores, mapState } from 'pinia';
import { useBoardCardsStore } from '../../../stores/board';
import ModalPlayer from './ModalPlayer.vue';
import ToastMessage from './ToastMessage.vue';
import HeaderBoard from './HeaderBoard.vue';
export default {
  components: { ModalPlayer, ToastMessage, HeaderBoard },
  data() {
    return {
      playerName: '',
      maxFlippedCards: 2,
      selected: 0,
      cards: [],
      found: 0,
      failures: 0,
      gameOver: false,
      timer: 5
    }
  },
  computed: {
    ...mapStores(useBoardCardsStore),
    ...mapState(useBoardCardsStore, ['boardCards', 'boardCardsRandom', 'player']),
  },
  watch: {
    found(newVal) {
      if (newVal === (Object.values(this.boardCards).length / 2)) {
        this.gameOver = true;
        // eslint-disable-next-line no-undef
        const toast = new bootstrap.Toast(document.getElementById('finished'));
        toast.show();
      }
    }
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
            const successfulAttempt = this.cards.every((selected) => selected.name === this.cards[0].name);
            if (successfulAttempt) {
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
        }, 1000)
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
    setPlayerSession(player) {
      let allPlayers = [];
      if (sessionStorage.getItem('players')) {
        allPlayers = JSON.parse(sessionStorage.getItem('players'));
      }
      let alreadyPlayers = [];
      const existingPlayer = allPlayers.find((alreadyPlayer) => alreadyPlayer.toLowerCase() === player.toLowerCase());
      if (!existingPlayer) {
        if (sessionStorage.getItem('players')) {
          alreadyPlayers = JSON.parse(sessionStorage.getItem('players'));
        }
        alreadyPlayers.push(player);
        sessionStorage.setItem('players', JSON.stringify(alreadyPlayers));
      }
    },
    async getGameInfo({ player, pairCards }) {
      this.playerName = player;
      useBoardCardsStore().setPlayer(player);
      this.setPlayerSession(player);
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
    <ToastMessage
      message="you have completed the game, congratulations"
      title="¡¡¡WUJUUUUU!!! 🥳🎉"
    />
    <div class="row" v-if="player">
      <HeaderBoard
        :player="player"
        :found="found"
        :failures="failures"
        :timer="timer"
      />
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
