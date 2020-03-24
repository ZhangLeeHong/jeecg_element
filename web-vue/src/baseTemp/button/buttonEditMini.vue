<script>
  import buttonMini from './buttonMini.vue'

  export default {
    extends: buttonMini,
    props: {
      type: {default: "primary"},
      title: {default: "编辑"},
    }
  }
</script>