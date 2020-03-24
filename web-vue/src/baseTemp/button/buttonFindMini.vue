<script>
  import buttonMini from './buttonMini.vue'

  export default {
    extends: buttonMini,
    props: {
      type: {default: "success"},
      title: {default: "查询"},
    }
  }
</script>