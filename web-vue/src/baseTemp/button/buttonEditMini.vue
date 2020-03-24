<script>
  import kcButtonMini from './kcButtonMini.vue'

  export default {
    extends: kcButtonMini,
    props: {
      type: {default: "primary"},
      title: {default: "编辑"},
    }
  }
</script>