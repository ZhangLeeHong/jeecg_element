<template>
  <span>
     <span v-if="value==1" style="color: green">启用</span>
     <span v-else style="color: red">停用</span>
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