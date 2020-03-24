<script>
  import kcButton from './kcButton.vue'

  export default {
    extends: kcButton,
    props: {
      icon: {default: "small iconfont-refresh3"},
      type: {default: "success"},
      title: {default: "刷新"},
    }
  }
</script>