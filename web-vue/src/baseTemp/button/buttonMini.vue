<script>
  import kcButton from './kcButton.vue'

  export default {
    extends: kcButton,
    props: {
      size: {default: "mini"},
      icon: {default: "small"},
      type: {default: "primary"},
      title: {default: "默认"},
    }
  }
</script>