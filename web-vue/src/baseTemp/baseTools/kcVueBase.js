/**
 *   分页页面
 */
const page = {
    data() {
        return {
            title: "功能标题",
            author:{},//权限
            loading: false,//加载效果
            baseUrl: "/继承修改",//默认访问地址,必须继承修改,如【/sysUser】
            findObjDialog: "继承修改",//查询单个对象组件名，如【sysUserFind】
            page: {pageNumber: 1, pageSize:20},//分页数据集，包含页码、页大小
            sort: {},//排序数据集
            search: {},//查询参数
            selectionVals: [],//table选项值
            login_id: sessionStorage.getItem('login_id'),//当前登录用户ID
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
            this.axiosPage(reqData,callbackFn,showResultMsg);
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
            this.axiosDel(ids, function () {
                this.refresh();
            });
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
    }, watch: { //值改变动作 valObj(val){}
    }, mounted() {/*页面加载初始化*/
        this.axiosAuthor();
    }
}
/**
 *  查询单个对象-对话框
 */
const findObjDialog = {
    data() {
        return {
            author:{},//权限
            dialogVisible: false,//是否显示对话框
            loading: false,//是否显示加载效果
            baseUrl: "/继承修改",//默认访问地址
            obj: {},//表单值
            rules: {},//表单校验
            login_id: sessionStorage.getItem('login_id'),//当前登录用户ID
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
    }, watch: { //值改变动作 valObj(val){}
    }, mounted() {/*页面加载初始化*/
        this.axiosAuthor();
    }
}
 export default {
    page: page,
    findObjDialog: findObjDialog,
}

