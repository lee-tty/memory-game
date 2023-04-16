<script>

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
      pairCards: 20
    }
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
      var myModal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
      myModal.hide();
    },
  },
  mounted() {
    // eslint-disable-next-line no-undef
    var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('exampleModal'), {
      backdrop: 'static'
    });
    myModal.show();
  }
}
</script>
<template>
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            Player information
          </h5>
        </div>
        <div class="modal-body">
          <form>
            <div class="input-group mb-3">
              <span class="input-group-text" id="basic-nameHelp">¿Whats your name?</span>
              <input
                type="text"
                class="form-control"
                placeholder="Your name"
                aria-label="name"
                aria-describedby="nameHelp"
                v-model="player"
              />
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text" id="pairCardsHelp">¿How many pairs of cards do you want?</span>
              <input
                type="number"
                class="form-control"
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