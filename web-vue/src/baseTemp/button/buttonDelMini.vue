<script>
  import kcButtonMini from './kcButtonMini.vue'

  export default {
    extends: kcButtonMini,
    props: {
      type: {default: "danger"},
      title: {default: "删除"},
    }
  }
</script>