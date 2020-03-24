<script>
  import elButton from './elButton.vue'

  export default {
    extends: elButton,
    data() {
      return {}
    },
    props: {
      size: {default: "small"},
      icon: {default: "small"},
      title: {default: "按钮"},
    },
    methods: {}, mounted: function () {
    }, watch: {}
  }
</script>