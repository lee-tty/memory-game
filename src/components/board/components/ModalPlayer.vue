<script>

import {mapState} from "pinia";
import {useBoardCardsStore} from "../../../stores/board";

export default {
  props: {
    value: {
      type: String
    },
  },
  emits :{
    getGameInfo: null
  },
  data () {
    return {
      valueInput: this.value,
      player: '',
      error: false,
      isNotZero: 0,
      pairCards: 20,
      existingPlayer: 'no'
    }
  },
  computed: {
    ...mapState(useBoardCardsStore, ['allPlayers'])
  },
  methods: {
    onInput() {
      this.isNotZero = this.pairCards % 2 === 0;
      if (!this.player || !this.isNotZero) {
        this.error = true;
        return;
      }
      this.$emit('getGameInfo', {
        player: this.player,
        pairCards: this.pairCards
      });
      // eslint-disable-next-line no-undef
      var myModal = bootstrap.Modal.getInstance(document.getElementById('formModal'));
      myModal.hide();
    },
  },
  mounted() {
    // eslint-disable-next-line no-undef
    var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('formModal'), {
      backdrop: 'static'
    });
    myModal.show();
  }
}
</script>
<template>
  <div class="modal fade" id="formModal" tabindex="-1" aria-labelledby="modalTitle" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalTitle">
            First, we need this information
          </h5>
        </div>
        <div class="modal-body">
          <form>
            <div class="d-flex justify-content-around">
              <div class="form-check mb-3">
                <input
                  class="form-check-input"
                  type="radio"
                  id="isOldPlayer"
                  v-model="existingPlayer"
                  value="yes"
                >
                <label class="form-check-label" for="isOldPlayer">
                  Im an old player
                </label>
              </div>
              <div class="form-check mb-3">
                <input
                  class="form-check-input"
                  type="radio"
                  id="isNotOldPlayer"
                  v-model="existingPlayer"
                  value="no"
                >
                <label class="form-check-label" for="isNotOldPlayer">
                  Im a new player
                </label>
              </div>
            </div>
            <div v-if="existingPlayer === 'yes'">
              <select class="form-select mb-3" aria-label="Select of players" v-model="player">
                <option selected>Select your name</option>
                <option
                  v-for="(alreadyPlayer, index) in allPlayers"
                  :key="index"
                  :value="alreadyPlayer"
                >
                  {{alreadyPlayer}}
                </option>
              </select>
            </div>
            <div class="mb-3 text-right" v-if="existingPlayer === 'no'">
              <label for="name" class="form-label">¿Whats your name?</label>
              <input
                type="text"
                id="name"
                class="form-control"
                placeholder="Your name"
                aria-label="name"
                aria-describedby="nameHelp"
                v-model="player"
              />
            </div>
            <div class="mb-3 text-right">
              <label for="cards" class="form-label">¿How many pairs of cards do you want?</label>
              <input
                type="number"
                class="form-control"
                id="cards"
                min="2"
                aria-label="name"
                aria-describedby="pairCardsHelp"
                v-model="pairCards"
              />
            </div>
          </form>
          <div class="alert alert-danger" role="alert" v-if="error && !player">
            In order to play you have to enter your name
          </div>
          <div class="alert alert-danger" role="alert" v-if="error && !isNotZero">
            The number of cards is not even
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="onInput">Save player</button>
        </div>
      </div>
    </div>
  </div>
</template>