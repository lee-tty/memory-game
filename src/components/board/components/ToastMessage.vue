<script>
export default {
  props: {
    message: {
      type: String
    },
    title: {
      type: String
    }
  },
}
</script>
<template>
  <div class="toast-container p-3 top-50 start-50 translate-middle">
  <div
    class="toast"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
    id="finished"
  >
    <div class="toast-header">
      <strong class="me-auto">{{title}}</strong>
    </div>
    <div class="toast-body">
      {{message}}
    </div>
  </div>
  </div>
</template>