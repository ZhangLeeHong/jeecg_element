<!--分页通用模板，通过父组件page对象取值，给父组件传值@setVal,刷新函数@refresh -->
<template>
  <el-pagination
    :pager-count="5"
    @size-change="pageSizeChange"
    @current-change="pageNumberChange"
    :current-page.sync="page.current"
    :page-size.sync="page.pageSize"
    :page-sizes.sync="pageSizes!=null?pageSizes:page_sizes"
    :layout.sync="layout"
    :total.sync="page.total">
  </el-pagination>
</template>

<script>
  export default {
    data() {
      return {
        layout: "total, sizes, prev, pager, next, jumper",
        page_sizes: [10, 20, 50, 100, 200, 500]
      };
    },
    props: ["page", "pageSizes"],
    methods: {
      pageSizeChange(val) {/*分页大小变化操作*/
        this.$emit('setVal', "page", "pageSize", val);
        this.refresh();
      },
      pageNumberChange(val) { /*页码变化操作*/
        this.$emit('setVal', "page", "pageNumber", val);
        this.refresh();
      },
      refresh() {//刷新父组件数据
        this.$emit('refresh', 0);
      }
    }
  }
</script>