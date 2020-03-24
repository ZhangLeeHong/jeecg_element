<template>
  <el-row :gutter="10">
    <el-col :md="12" :sm="24" style="margin-bottom: 20px">
      <el-card>
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <!-- 搜索区域 -->
          <el-input placeholder="请输入角色名称模糊查询" v-model="queryParam.keyStr" clearable @keyup.enter.native="loadData"
                    @clear="loadData" style="width: 280px" size="small"></el-input>
          <a-button type="primary" @click="loadData" icon="search" style="margin-left: 21px">查询</a-button>
          <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
        </div>
        <!-- 操作按钮区域 -->
        <div class="table-operator" style="margin: 5px 0 10px 2px">
          <a-button @click="handleAdd" type="primary" icon="plus">角色录入</a-button>
          <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader"
                    :action="importExcelUrl" @change="handleImportExcel">
            <a-button type="primary" icon="import">导入</a-button>
          </a-upload>
          <a-button type="primary" icon="download" @click="handleExportXls">导出</a-button>
        </div>
        <div class="mainArea">
          <el-table v-loading="loading" :data="dataSource" ref="table" border
                    :default-sort="sort={prop: 'createTime', order: 'descending'}"
                    @sort-change="sortChange" :height="getHeight(305)"
                    @selection-change="selectionChange">
            <el-table-column type="index" align="center" width="60"/>
            <el-table-column prop="roleName" label="角色名称" width="140"/>
            <el-table-column prop="roleCode" label="角色编码" width="140"/>
            <el-table-column prop="createTime" label="创建时间" width="140" align="center" sortable>
              <template slot-scope="scope">
                <span>{{ scope.row.createTime | moment('YYYY-MM-DD HH:mm') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="140" align="left" fixed="right">
              <template slot-scope="scope">
                <a @click="handleOpen(scope.row)">用户</a>

                <a-divider type="vertical"/>

                <a-dropdown>
                  <a class="ant-dropdown-link">
                    更多
                    <a-icon type="down"/>
                  </a>
                  <a-menu slot="overlay">
                    <a-menu-item>
                      <a @click="handlePerssion(scope.row.id)">授权</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a @click="handleEdit(scope.row)">编辑</a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>

              </template>
            </el-table-column>
          </el-table>
          <pagination :page="ipagination" @refresh="refresh" @setVal="setVal"/>
        </div>
        <!-- 右侧的角色权限配置 -->
        <user-role-modal ref="modalUserRole"></user-role-modal>
        <role-modal ref="modalForm" @ok="modalFormOk"></role-modal>
      </el-card>
    </el-col>
    <el-col :md="12" :sm="24">
      <el-card>
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <a-input placeholder="" v-model="queryParam2.username" style="width: 200px"></a-input>
          <a-button type="primary" @click="searchQuery2" icon="search" style="margin-left: 21px">查询</a-button>
          <a-button type="primary" @click="searchReset2" icon="reload" style="margin-left: 8px">重置</a-button>
        </div>
        <!-- 操作按钮区域 -->
        <div class="table-operator" style="margin: 0px 0 6px 2px">
          <a-button @click="handleAdd2" type="primary" icon="plus" style="margin-top: 16px">用户录入</a-button>
          <a-button @click="handleAddUserRole" type="primary" icon="plus" style="margin-top: 16px">添加已有用户</a-button>
          <a-dropdown v-if="selectedRowKeys2.length > 0">
            <a-menu slot="overlay">
              <a-menu-item key="1" @click="batchDel2">
                <a-icon type="delete"/>
                删除
              </a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px"> 批量操作
              <a-icon type="down"/>
            </a-button>
          </a-dropdown>
        </div>
        <!-- table区域-begin -->
        <div class="mainArea">
          <el-table v-loading="loading2" :data="dataSource2" ref="table" border
                    @sort-change="sortChange" :height="getHeight(305)"
                    @selection-change="selectionChange">
            <el-table-column type="index" align="center" width="60"/>
            <el-table-column prop="username" label="用户账号" width="140"/>
            <el-table-column prop="realname" label="用户姓名" width="140"/>
            <el-table-column prop="createTime" label="创建时间" width="140" align="center" sortable>
              <template slot-scope="scope">
                <span>{{ scope.row.createTime | moment('YYYY-MM-DD HH:mm') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="140" align="left" fixed="right">
              <template slot-scope="scope">
                <a @click="handleEdit2(scope.row)">编辑</a>
              </template>
            </el-table-column>
          </el-table>
          <pagination :page="ipagination2" @refresh="refresh" @setVal="setVal"/>
        </div>
        <!-- 表单区域 -->
        <role-modal ref="modalForm" @ok="modalFormOk"></role-modal>
        <user-modal ref="modalForm2" @ok="modalFormOk2"></user-modal>
        <Select-User-Modal ref="selectUserModal" @selectFinished="selectOK"></Select-User-Modal>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
  import {ListMixin} from '@/mixins/ListMixin'
  import {deleteAction, postAction, getAction} from '@/api/manage'
  import SelectUserModal from './modules/SelectUserModal'
  import RoleModal from './modules/RoleModal'
  import UserModal from './modules/UserModal'
  import {filterObj} from '@/utils/util'
  import UserRoleModal from './modules/UserRoleModal'
  import moment from 'moment'

  export default {
    name: 'RoleUserList',
    mixins: [ListMixin],
    components: {
      UserRoleModal,
      SelectUserModal,
      RoleModal,
      UserModal,
      moment
    },
    data() {
      return {
        loading: false,
        model1: {},
        model2: {},
        currentRoleId: '',
        queryParam1: {},
        queryParam2: {},
        dataSource1: [],
        dataSource2: [],
        ipagination1: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + '-' + range[1] + ' 共' + total + '条'
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        ipagination2: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + '-' + range[1] + ' 共' + total + '条'
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        isorter1: {
          column: 'createTime',
          order: 'desc'
        },
        isorter2: {
          column: 'createTime',
          order: 'desc'
        },
        filters1: {},
        filters2: {},
        loading1: false,
        loading2: false,
        selectedRowKeys1: [],
        selectedRowKeys2: [],
        selectionRows1: [],
        selectionRows2: [],
        test: {},
        rightcolval: 0,
        columns:
          [
            {
              title: '角色编码',
              align: 'center',
              dataIndex: 'roleCode'
            },
            {
              title: '角色名称',
              align: 'center',
              dataIndex: 'roleName'
            },
            {
              title: '创建时间',
              dataIndex: 'createTime',
              align: "center",
              sorter: true,
              customRender: (text) => {
                return moment(text).format('YYYY-MM-DD')
              }
            },
            {
              title: '操作',
              dataIndex: 'action',
              align: 'center',
              scopedSlots: {customRender: 'action'}
            }
          ],
        columns2: [{
          title: '用户账号',
          align: 'center',
          dataIndex: 'username',
          width: 120
        },
          {
            title: '用户名称',
            align: 'center',
            width: 100,
            dataIndex: 'realname'
          },
          {
            title: '状态',
            align: 'center',
            width: 80,
            dataIndex: 'status_dictText'
          },

          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
            align: 'center',
            width: 120
          }],


        url: {
          list: '/sys/role/list',
          delete: '/sys/role/delete',
          list2: '/sys/user/userRoleList',
          addUserRole: '/sys/user/addSysUserRole',
          delete2: '/sys/user/deleteUserRole',
          deleteBatch2: '/sys/user/deleteUserRoleBatch',
          exportXlsUrl: 'sys/role/exportXls',
          importExcelUrl: 'sys/role/importExcel'
        }
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
      },
      leftColMd() {
        return this.selectedRowKeys1.length === 0 ? 24 : 12
      },
      rightColMd() {
        return this.selectedRowKeys1.length === 0 ? 0 : 12
      }
    },
    mounted() {
      this.loadData2(1);
    },
    methods: {
      onSelectChange2(selectedRowKeys, selectionRows) {
        this.selectedRowKeys2 = selectedRowKeys
        this.selectionRows2 = selectionRows
      },
      onClearSelected2() {
        this.selectedRowKeys2 = []
        this.selectionRows2 = []
      },
      onClearSelected1() {
        this.selectedRowKeys1 = []
        this.selectionRows1 = []
      },
      onSelectChange1(selectedRowKeys, selectionRows) {
        this.rightcolval = 1
        this.selectedRowKeys1 = selectedRowKeys
        this.selectionRows1 = selectionRows
        this.model1 = Object.assign({}, selectionRows[0])
        console.log(this.model1)
        this.currentRoleId = selectedRowKeys[0]
        this.loadData2()
      },
      onClearSelected() {
      },

      getQueryParams2() {
        //获取查询条件
        let sqp = {}
        if (this.superQueryParams2) {
          sqp['superQueryParams'] = encodeURI(this.superQueryParams2)
        }
        var param = Object.assign(sqp, this.queryParam2, this.isorter2, this.filters2)
        param.field = this.getQueryField2()
        param.pageNo = this.ipagination2.current
        param.pageSize = this.ipagination2.pageSize
        return filterObj(param)
      },
      getQueryField2() {
        //TODO 字段权限控制
        var str = 'id,'
        this.columns2.forEach(function (value) {
          str += ',' + value.dataIndex
        })
        return str
      },
      handleEdit2: function (record) {
        this.$refs.modalForm2.title = '编辑'
        this.$refs.modalForm2.roleDisabled = true
        this.$refs.modalForm2.edit(record)
      },
      handleAdd2: function () {
        if (this.currentRoleId == '') {
          this.$message.error('请选择一个角色!')
        } else {
          this.$refs.modalForm2.roleDisabled = true
          this.$refs.modalForm2.selectedRole = [this.currentRoleId]

          this.$refs.modalForm2.add()

          this.$refs.modalForm2.title = '新增'
        }
      },
      modalFormOk2() {
        // 新增/修改 成功时，重载列表
        this.loadData2()
      },
      loadData2(arg) {
        if (!this.url.list2) {
          this.$message.error('请设置url.list2属性!')
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination2.current = 1
        }
        if (this.currentRoleId === '') return
        let params = this.getQueryParams2()//查询条件
        params.roleId = this.currentRoleId
        this.loading2 = true
        getAction(this.url.list2, params).then((res) => {
          if (res.success) {
            this.dataSource2 = res.result.records
            this.ipagination2.total = res.result.total

          }
          this.loading2 = false
        })

      },
      handleDelete1: function (id) {
        this.handleDelete(id)
        this.dataSource2 = []
        this.currentRoleId = ''
      },
      handleDelete2: function (id) {
        if (!this.url.delete2) {
          this.$message.error('请设置url.delete2属性!')
          return
        }
        var that = this
        deleteAction(that.url.delete2, {roleId: this.currentRoleId, userId: id}).then((res) => {
          if (res.success) {
            that.$message.success(res.message)
            that.loadData2()
          } else {
            that.$message.warning(res.message)
          }
        })
      },
      batchDel2: function () {

        if (!this.url.deleteBatch2) {
          this.$message.error('请设置url.deleteBatch2属性!')
          return
        }
        if (this.selectedRowKeys2.length <= 0) {
          this.$message.warning('请选择一条记录！')
          return
        } else {
          var ids = ''
          for (var a = 0; a < this.selectedRowKeys2.length; a++) {
            ids += this.selectedRowKeys2[a] + ','
          }
          var that = this
          console.log(this.currentDeptId)
          this.$confirm({
            title: '确认删除',
            content: '是否删除选中数据?',
            onOk: function () {
              deleteAction(that.url.deleteBatch2, {roleId: that.currentRoleId, userIds: ids}).then((res) => {
                if (res.success) {
                  that.$message.success(res.message)
                  that.loadData2()
                  that.onClearSelected()
                } else {
                  that.$message.warning(res.message)
                }
              })
            }
          })
        }
      },
      selectOK(data) {
        let params = {}
        params.roleId = this.currentRoleId
        params.userIdList = []
        for (var a = 0; a < data.length; a++) {
          params.userIdList.push(data[a])
        }
        console.log(params)
        postAction(this.url.addUserRole, params).then((res) => {
          if (res.success) {
            this.loadData2()
            this.$message.success(res.message)
          } else {
            this.$message.warning(res.message)
          }
        })
      },

      handleAddUserRole() {
        if (this.currentRoleId == '') {
          this.$message.error('请选择一个角色!')
        } else {
          this.$refs.selectUserModal.visible = true
        }
      },
      handleOpen(record) {
        this.rightcolval = 1
        this.selectedRowKeys1 = [record.id]
        this.model1 = Object.assign({}, record)
        this.currentRoleId = record.id
        this.onClearSelected2()
        this.loadData2()
      },
      searchQuery2() {
        this.loadData2(1)
      },
      searchReset2() {
        this.queryParam2 = {}
        this.loadData2(1)
      },
      handleTableChange2(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发
        //TODO 筛选
        if (Object.keys(sorter).length > 0) {
          this.isorter2.column = sorter.field
          this.isorter2.order = 'ascend' == sorter.order ? 'asc' : 'desc'
        }
        this.ipagination2 = pagination
        this.loadData2()
      },
      hideUserList() {
        //this.rightcolval = 0
        this.selectedRowKeys1 = []
      },
      handlePerssion(roleId) {
        this.$refs.modalUserRole.show(roleId);
      },
    }
  }
</script>
