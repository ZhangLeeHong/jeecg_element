<script>
  import button from './button.vue'

  export default {
    extends: button,
    props: {
      icon: {default: "small iconfont-refresh3"},
      type: {default: "success"},
      title: {default: "刷新"},
    }
  }
</script>