/**
 *   分页页面
 */
const page = {
  data() {
    return {
      //token header
      tokenHeader: {'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)},
      /* 查询条件-请不要在queryParam中声明非字符串值的属性 */
      queryParam: {},
      /* 数据源 */
      dataSource: [],
      /* 分页参数 */
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + "-" + range[1] + " 共" + total + "条"
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      /* 排序参数 */
      isorter: {
        column: 'createTime',
        order: 'desc',
      },
      /* 筛选参数 */
      filters: {},
      /* table加载状态 */
      loading: false,
      /* table选中keys*/
      selectedRowKeys: [],
      /* table选中records*/
      selectionRows: [],
      /* 查询折叠 */
      toggleSearchStatus: false,
      /* 高级查询条件生效状态 */
      superQueryFlag: false,
      /* 高级查询条件 */
      superQueryParams: "",
      tHeight: 202,
      title: "功能标题",
      author: {},//权限
      baseUrl: "/继承修改",//默认访问地址,必须继承修改,如【/sysUser】
      findObjDialog: "继承修改",//查询单个对象组件名，如【sysUserFind】
      page: {pageNumber: 1, pageSize: 20},//分页数据集，包含页码、页大小
      sort: {},//排序数据集
      search: {},//查询参数
      selectionVals: [],//table选项值
    }
  },
  methods: {
    setVal(...vals) {
      this.baseSetVal(vals);
    },
    sortChange(sort) { /*排序变化操作*/
      this.psortChange(sort);
    },
    psortChange(sort) { /*排序变化操作*/
      this.$set(this, "sort", sort);
      this.refresh();
    },
    findPage(type) {
      this.pfindPage(type);
    },
    pfindPage(type, callbackFn, showResultMsg) {/*查询分页*/
      var reqData = this.search;
      reqData.prop = this.sort.prop;
      reqData.order = this.sort.order;
      reqData.pageNumber = this.page.pageNumber;
      reqData.pageSize = this.page.pageSize;
      if (type == 'search') {//判断是否查询
        reqData.pageNumber = 1;
      }
    },
    pexportPage(callbackFn) {/*导出数据*/
      var reqData = this.search;
      reqData.prop = this.sort.prop;
      reqData.order = this.sort.order;
      reqData.pageNumber = 1;
      reqData.pageSize = 10000;
      var url = this.baseUrl + "/exportXls.do";
      // this.axiosPost(url, reqData, callbackFn);
    },
    refresh() {/*刷新*/
      this.findPage();
    },
    selectionChange(val) { /*多选操作*/
      this.pselectionChange(val);
    },
    pselectionChange(val) { /*多选操作*/
      this.$set(this, "selectionVals", val);
    },
    del(ids) {/*删除数据*/
      this.pdel(ids);
    },
    pdel(ids) {/*删除数据*/
      if (ids == undefined) {
        ids = this.selectionVals;
      }
      // this.axiosDel(ids, function () {
      //   this.refresh();
      // });
    },
    selectable(row, index) { /*多选框是否可操作判断*/
      return true;
    },
    rowDblClick(row) {/*双击行编辑*/
      this.findObj(row.id);
    },
    findObj(id, title) { /*查询表单对象obj*/
      this.$refs[this.findObjDialog].findObj(id);
    },
    loadData(arg) {
      if (!this.url.list) {
        this.$message.error("请设置url.list属性!")
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1;
      }
      var params = this.getQueryParams();//查询条件
      this.loading = true;
      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          this.dataSource = res.result.records;
          this.ipagination.total = res.result.total;
        }
        if (res.code === 510) {
          this.$message.warning(res.message)
        }
        this.loading = false;
      })
    },
    initDictConfig() {
      console.log("--这是一个假的方法!")
    },
    handleSuperQuery(arg) {
      //高级查询方法
      if (!arg) {
        this.superQueryParams = ''
        this.superQueryFlag = false
      } else {
        this.superQueryFlag = true
        this.superQueryParams = JSON.stringify(arg)
      }
      this.loadData()
    },
    getQueryParams() {
      //获取查询条件
      let sqp = {}
      if (this.superQueryParams) {
        sqp['superQueryParams'] = encodeURI(this.superQueryParams)
      }
      var param = Object.assign(sqp, this.queryParam, this.isorter, this.filters);
      param.field = this.getQueryField();
      param.pageNo = this.ipagination.current;
      param.pageSize = this.ipagination.pageSize;
      return filterObj(param);
    },
    getQueryField() {
      //TODO 字段权限控制
      var str = "id,";
      this.columns.forEach(function (value) {
        str += "," + value.dataIndex;
      });
      return str;
    },

    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectionRows = selectionRows;
    },
    onClearSelected() {
      this.selectedRowKeys = [];
      this.selectionRows = [];
    },
    searchQuery() {
      this.loadData(1);
    },
    superQuery() {
      this.$refs.superQueryModal.show();
    },
    searchReset() {
      this.queryParam = {}
      this.loadData(1);
    },
    batchDel: function () {
      if (!this.url.deleteBatch) {
        this.$message.error("请设置url.deleteBatch属性!")
        return
      }
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！');
        return;
      } else {
        var ids = "";
        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          ids += this.selectedRowKeys[a] + ",";
        }
        var that = this;
        this.$confirm({
          title: "确认删除",
          content: "是否删除选中数据?",
          onOk: function () {
            that.loading = true;
            deleteAction(that.url.deleteBatch, {ids: ids}).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.loadData();
                that.onClearSelected();
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.loading = false;
            });
          }
        });
      }
    },
    handleDelete: function (id) {
      if (!this.url.delete) {
        this.$message.error("请设置url.delete属性!")
        return
      }
      var that = this;
      deleteAction(that.url.delete, {id: id}).then((res) => {
        if (res.success) {
          that.$message.success(res.message);
          that.loadData();
        } else {
          that.$message.warning(res.message);
        }
      });
    },
    handleEdit: function (record) {
      this.$refs.modalForm.edit(record);
      this.$refs.modalForm.title = "编辑";
      this.$refs.modalForm.disableSubmit = false;
    },
    handleAdd: function () {
      this.$refs.modalForm.add();
      this.$refs.modalForm.title = "新增";
      this.$refs.modalForm.disableSubmit = false;
    },
    handleTableChange(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      //TODO 筛选
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field;
        this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
      }
      this.ipagination = pagination;
      this.loadData();
    },
    handleToggleSearch() {
      this.toggleSearchStatus = !this.toggleSearchStatus;
    },
    modalFormOk() {
      // 新增/修改 成功时，重载列表
      this.loadData();
    },
    handleDetail: function (record) {
      this.$refs.modalForm.edit(record);
      this.$refs.modalForm.title = "详情";
      this.$refs.modalForm.disableSubmit = true;
    },
    /* 导出 */
    handleExportXls2() {
      let paramsStr = encodeURI(JSON.stringify(this.getQueryParams()));
      let url = `${window._CONFIG['domianURL']}/${this.url.exportXlsUrl}?paramsStr=${paramsStr}`;
      window.location.href = url;
    },
    handleExportXls(fileName) {
      if (!fileName || typeof fileName != "string") {
        fileName = "导出文件"
      }
      let param = {...this.queryParam};
      if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
        param['selections'] = this.selectedRowKeys.join(",")
      }
      console.log("导出参数", param)
      downFile(this.url.exportXlsUrl, param).then((data) => {
        if (!data) {
          this.$message.warning("文件下载失败")
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data], {type: 'application/vnd.ms-excel'}), fileName + '.xls')
        } else {
          let url = window.URL.createObjectURL(new Blob([data], {type: 'application/vnd.ms-excel'}))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName + '.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link); //下载完成移除元素
          window.URL.revokeObjectURL(url); //释放掉blob对象
        }
      })
    },
    /* 导入 */
    handleImportExcel(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        if (info.file.response.success) {
          // this.$message.success(`${info.file.name} 文件上传成功`);
          if (info.file.response.code === 201) {
            let {message, result: {msg, fileUrl, fileName}} = info.file.response
            let href = window._CONFIG['domianURL'] + fileUrl
          } else {
            this.$message.success(info.file.response.message || `${info.file.name} 文件上传成功`)
          }
          this.loadData()
        } else {
          this.$message.error(`${info.file.name} ${info.file.response.message}.`);
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`文件上传失败: ${info.file.msg} `);
      }
    },
    /* 图片预览 */
    getImgView(text) {
      if (text && text.indexOf(",") > 0) {
        text = text.substring(0, text.indexOf(","))
      }
      return window._CONFIG['staticDomainURL'] + "/" + text
    },
    /* 文件下载 */
    uploadFile(text) {
      if (!text) {
        this.$message.warning("未知的文件")
        return;
      }
      if (text.indexOf(",") > 0) {
        text = text.substring(0, text.indexOf(","))
      }
      window.open(window._CONFIG['staticDomainURL'] + "/" + text);
    },
  },
  watch: {},
  mounted() {
  },
  created() {
  },
  destroyed() {//页面销毁时

  },
}
/**
 *  查询单个对象-对话框
 */
const findObjDialog = {
  data() {
    return {
      author: {},//权限
      dialogVisible: false,//是否显示对话框
      loading: false,//是否显示加载效果
      baseUrl: "/继承修改",//默认访问地址
      obj: {},//表单值
      rules: {},//表单校验
      showResultMsg: true,//新增修改成功后是否提示
    }
  },
  props: {//扩展，重写
    title: String
  },
  methods: {
    setVal(...vals) {
      this.baseSetVal(vals);
    },
    close() {//关闭对话框
      this.dialogVisible = false;
    },
    refresh() {//刷新父组件
      this.$emit('refresh');
    },
    findObj(id) { /*初始化-查询表单对象obj*/
      this.dialogVisible = true;
      this.axiosFind({id: id}, function (resData) {
        //重写init
      });
    },
    addEdit() {/*新增修改*/
      var obj = this.copyObj(this.obj);
      this.axiosAddEdit({obj: obj}, function () {
        this.close();
        this.refresh();
      });
    },

  },
  watch: { //值改变动作 valObj(val){}
  },
  mounted() {/*页面加载初始化*/
    this.axiosAuthor();
  }, created() {
    //页面刚进入时
  },
  destroyed: function () {
    //页面销毁时
  },
}
export default {
  page: page,
  findObjDialog: findObjDialog,
}

