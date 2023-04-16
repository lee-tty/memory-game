<script>

export default {
  props: {
    value: {
      type: String
    },
  },
  emits :{
    getPlayerName: null
},
  data () {
    return {
      valueInput: this.value,
      player: ''
    }
  },
  methods: {
    onInput() {
      this.$emit('getPlayerName', this.player);
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
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form>
            <label for="name" class="form-label">¿Whats your name?</label>
            <input
              type="text"
              class="form-control"
              id="name"
              aria-describedby="nameHelp"
              v-model="player"
            />
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" @click="onInput">Save player</button>
        </div>
      </div>
    </div>
  </div>
</template>