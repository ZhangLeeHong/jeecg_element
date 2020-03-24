<script>
  import button from './button.vue'

  export default {
    extends: button,
    props: {
      icon: {default: "small iconfont-shanchu"},
      type: {default: "danger"},
      title: {default: "删除"},
    }
  }
</script>