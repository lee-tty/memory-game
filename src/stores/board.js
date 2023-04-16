import { defineStore } from 'pinia';
import axios from 'axios';

export const useBoardCardsStore = defineStore('boardCards', {
  state: () => ({
    cards: {},
    playerGame: ''
  }),
  getters: {
    boardCards: (state) => state.cards,
    boardCardsRandom: (state) => Object.keys(state.cards)
      .sort(() => {
      return Math.random() - 0.5;
    }),
    player: (state) => state.playerGame,
    allPlayers: () => {
      if (sessionStorage.getItem('players')) {
        return JSON.parse(sessionStorage.getItem('players'));
      }
    }
  },
  actions: {
    async getCards(pairCards) {
      try {
        const { data } = await axios
          .get(`https://fed-team.modyo.cloud/api/content/spaces/animals/types/game/entries?per_page=${pairCards}`);
        this.cards = data.entries.reduce((index, card) => ({
          ...index,
          [`${card.meta.name}-1`]: {
            found: false,
            show: true,
            image: card.fields.image.url,
            imageTitle: card.fields.image.title,
            uuid: `${card.meta.name}-1`,
            name: card.meta.name
          },
          [`${card.meta.name}-2`]: {
            found: false,
            show: true,
            image: card.fields.image.url,
            imageTitle: card.fields.image.title,
            uuid: `${card.meta.name}-2`,
            name: card.meta.name,
          },
        }), {});
      }
      catch (error) {
        alert(error)
        console.log(error)
      }
    },
    hideCards() {
      for (const key in this.cards) {
        this.cards[key].show = false
      }
    },
    setPlayer(player) {
      this.playerGame = player;
      let alreadyPlayers;
      const existingPlayer = (this.allPlayers || [])
        .find((alreadyPlayer) => alreadyPlayer.toLowerCase() === player.toLowerCase());
      if (!existingPlayer) {
        if (sessionStorage.getItem('players')) {
          alreadyPlayers = JSON.parse(sessionStorage.getItem('players'));
        }
        alreadyPlayers.push(player);
        sessionStorage.setItem('players', JSON.stringify(alreadyPlayers));
      }
    },
    markSelectedCard({ card, visible }) {
      this.cards[card.uuid].show = visible;
    },
    markFoundCard(card) {
      this.cards[card.uuid].found = true;
    }
  }
});
