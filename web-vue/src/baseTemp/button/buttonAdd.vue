<script>
  import button from './button.vue'

  export default {
    extends: button,
    props: {
      icon: {default: "small iconfont-zengjia"},
      type: {default: "primary"},
      title: {default: "新增"},
    }
  }
</script>