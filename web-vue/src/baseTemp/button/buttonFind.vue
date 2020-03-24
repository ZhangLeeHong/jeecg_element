<script>
  import kcButton from './kcButton.vue'

  export default {
    extends: kcButton,
    props: {
      icon: {default: "small iconfont-sousuo1"},
      type: {default: "success"},
      title: {default: "查询"},
    }
  }
</script>