<script>
  import button from './button.vue'

  export default {
    extends: button,
    props: {
      size: {default: "mini"},
      icon: {default: "small"},
      type: {default: "primary"},
      title: {default: "默认"},
    }
  }
</script>