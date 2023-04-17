<script>
export default {
  props: {
    player: {
      type: String,
      required: true
    },
    timer: {
      type: Number
    },
    failures: {
      type: Number
    },
    found: {
      type: Number
    }
  }
}
</script>
<template>
  <div class="col-12 mt-2 text-center">
    <h2 class="green">
      ¡Hi {{player}}! Welcome to MemoryGame
    </h2>
    <h4 v-if="timer !== 0" class="text-danger">
      Get Ready in {{timer}}
    </h4>
    <h4>
      <b class="text-danger">Failed attempts:</b> {{failures}}
      <b class="text-success">Hits:</b> {{found}}
    </h4>
  </div>
</template>