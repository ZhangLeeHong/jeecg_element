<script>
  import kcButton from './kcButton.vue'

  export default {
    extends: kcButton,
    props: {
      icon: {default: "small iconfont-zengjia"},
      type: {default: "primary"},
      title: {default: "新增"},
    }
  }
</script>