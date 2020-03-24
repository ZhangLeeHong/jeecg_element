<template>
  <span>
     <span v-if="value==1" style="color: green">是</span>
     <span v-else style="color: red">否</span>
  </span>
</template>
<script>

    export default {
        data() {
            return {};
        },
        props: {
            value: {default: 0},
        }
    }
</script>