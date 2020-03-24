<script>
  import kcButton from './kcButton.vue'

  export default {
    extends: kcButton,
    props: {
      icon: {default: "small iconfont-shanchu"},
      type: {default: "danger"},
      title: {default: "删除"},
    }
  }
</script>