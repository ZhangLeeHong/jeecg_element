<script>
  import kcButtonMini from './kcButtonMini.vue'

  export default {
    extends: kcButtonMini,
    props: {
      type: {default: "success"},
      title: {default: "查询"},
    }
  }
</script>