<script>
  import buttonMini from './buttonMini.vue'

  export default {
    extends: buttonMini,
    props: {
      type: {default: "danger"},
      title: {default: "删除"},
    }
  }
</script>