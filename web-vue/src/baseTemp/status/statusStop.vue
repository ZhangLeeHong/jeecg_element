<template>
  <span>
     <span v-if="value==1" style="color: green">正常</span>
     <span v-else style="color: red">停用</span>
  </span>
</template>
<script>

    export default {
        data() {
            return {};
        },
        props: {
            value: null,
        }
    }
</script>
