<script>
  import button from './button.vue'

  export default {
    extends: button,
    props: {
      icon: {default: "small iconfont-sousuo1"},
      type: {default: "success"},
      title: {default: "查询"},
    }
  }
</script>