<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">

      <el-input placeholder="输入账号、真实姓名或手机号模糊查询" v-model="queryParam.keyStr" clearable @keyup.enter.native="loadData"
                @clear="loadData" style="width: 280px" size="small"/>

      <el-select v-model="queryParam.sex" placeholder="性别" clearable @change="loadData"
                 style="width: 100px" @clear="loadData" size="small">
        <el-option v-for="(item,key) in  {1:'男性',2:'女性'}" :key="key" :label="item" :value="key"/>
      </el-select>


      <el-select v-model="queryParam.status" placeholder="用户状态" clearable @change="loadData"
                 style="width: 100px" size="small" @clear="loadData">
        <el-option v-for="(item,key) in  {1:'正常',2:'冻结'}" :key="key" :label="item" :value="key"/>
      </el-select>
      <a-button type="primary" @click="loadData" icon="search">查询</a-button>
      <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>

    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator" style="border-top: 5px">
      <a-button @click="handleAdd" type="primary" icon="plus" v-has="'user:add'">添加用户</a-button>
      <a-button @click="handleSyncUser" v-has="'user:syncbpm'" type="primary" icon="plus">同步流程</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('用户信息')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-button type="primary" icon="hdd" @click="recycleBinVisible=true">回收站</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay" @click="handleMenuClick">
          <a-menu-item key="1">
            <a-icon type="delete" @click="batchDel"/>
            删除
          </a-menu-item>
          <a-menu-item key="2">
            <a-icon type="lock" @click="batchFrozen('2')"/>
            冻结
          </a-menu-item>
          <a-menu-item key="3">
            <a-icon type="unlock" @click="batchFrozen('1')"/>
            解冻
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
    </div>
    <div class="mainArea">
      <el-table v-loading="loading" :data="dataSource" ref="table" border
                :default-sort="sort={prop: 'create_time', order: 'descending'}"
                @sort-change="sortChange" :height="getHeight(tHeight)"
                @selection-change="selectionChange" @row-dblclick="rowDblClick">
        <el-table-column type="index" align="center" width="60"/>
        <el-table-column prop="username" label="用户账号" width="140"/>
        <el-table-column prop="realname" label="用户姓名" width="140"/>
        <el-table-column prop="birthday" label="生日" width="140"/>
        <el-table-column prop="sex" label="性别" width="60" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.sex==1">男</div>
            <div v-if="scope.row.sex==2">女</div>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号码" width="140" align="center"/>
        <el-table-column prop="orgCode" label="部门" width="140" align="center"/>
        <el-table-column prop="create_time" label="创建时间" width="140" align="center" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | moment('YYYY-MM-DD HH:mm') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="left" fixed="right">
          <template slot-scope="scope">
            <buttonEditMini @click="handleEdit(scope.row)">查看</buttonEditMini>
            <a-divider type="vertical"/>

            <a-dropdown>
              <a class="ant-dropdown-link">
                更多
                <a-icon type="down"/>
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="javascript:;" @click="handleDetail(scope.row)">详情</a>
                </a-menu-item>

                <a-menu-item>
                  <a href="javascript:;" @click="handleChangePassword(scope.row.username)">密码</a>
                </a-menu-item>

                <a-menu-item v-has="'user:delete'">
                  <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(scope.row.id)">
                    <a>删除</a>
                  </a-popconfirm>
                </a-menu-item>

                <a-menu-item v-if="scope.row.status==1">
                  <a-popconfirm title="确定冻结吗?" @confirm="() => handleFrozen(scope.row.id,2,scope.row.username)">
                    <a>冻结</a>
                  </a-popconfirm>
                </a-menu-item>

                <a-menu-item v-if="scope.row.status==2">
                  <a-popconfirm title="确定解冻吗?" @confirm="() => handleFrozen(scope.row.id,1,scope.row.username)">
                    <a>解冻</a>
                  </a-popconfirm>
                </a-menu-item>

                <a-menu-item>
                  <a href="javascript:;" @click="handleAgentSettings(scope.row.username)">代理人</a>
                </a-menu-item>

              </a-menu>
            </a-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <pagination :page="ipagination" @refresh="refresh" @setVal="setVal"/>
    </div>
    <user-modal ref="modalForm" @ok="modalFormOk"></user-modal>

    <password-modal ref="passwordmodal" @ok="passwordModalOk"></password-modal>

    <sys-user-agent-modal ref="sysUserAgentModal"></sys-user-agent-modal>

    <!-- 用户回收站 -->
    <user-recycle-bin-modal :visible.sync="recycleBinVisible" @ok="modalFormOk"/>

  </a-card>
</template>

<script>
  import UserModal from './modules/UserModal'
  import PasswordModal from './modules/PasswordModal'
  import {putAction, getFileAccessHttpUrl, postAction} from '@/api/manage';
  import {frozenBatch} from '@/api/api'
  import {ListMixin} from '@/mixins/ListMixin'
  import SysUserAgentModal from "./modules/SysUserAgentModal";
  import UserRecycleBinModal from './modules/UserRecycleBinModal'

  export default {
    name: "index",
    mixins: [ListMixin],
    components: {
      SysUserAgentModal,
      UserModal,
      PasswordModal,
      UserRecycleBinModal
    },
    data() {
      return {
        tHeight: 325,
        description: '用户管理页面',
        queryParam: {},
        recycleBinVisible: false,
        loading: false,
        sort: {},
        columns: [
          {
            title: '用户账号',
            align: "center",
            dataIndex: 'username',
            width: 120
          },
          {
            title: '用户姓名',
            align: "center",
            width: 100,
            dataIndex: 'realname',
          },
          {
            title: '头像',
            align: "center",
            width: 120,
            dataIndex: 'avatar',
            scopedSlots: {customRender: "avatarslot"}
          },
          {
            title: '性别',
            align: "center",
            width: 80,
            dataIndex: 'sex_dictText',
            sorter: true
          },
          {
            title: '生日',
            align: "center",
            width: 100,
            dataIndex: 'birthday'
          },
          {
            title: '手机号码',
            align: "center",
            width: 100,
            dataIndex: 'phone'
          },
          {
            title: '部门',
            align: "center",
            width: 180,
            dataIndex: 'orgCode'
          },
          {
            title: '状态',
            align: "center",
            width: 80,
            dataIndex: 'status_dictText'
          },
          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
            align: "center",
            width: 170
          }

        ],
        url: {
          imgerver: window._CONFIG['staticDomainURL'],
          syncUser: "/process/extActProcess/doSyncUser",
          list: "/sys/user/list",
          delete: "/sys/user/delete",
          deleteBatch: "/sys/user/deleteBatch",
          exportXlsUrl: "/sys/user/exportXls",
          importExcelUrl: "sys/user/importExcel",
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    mounted() {
    },
    methods: {
      rowDblClick(row) {/*双击行编辑*/
        this.handleEdit(row)
      },
      getAvatarView(avatar) {
        return getFileAccessHttpUrl(avatar, this.url.imgerver, "http")
      },
      batchFrozen(status) {
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！');
          return false;
        } else {
          let ids = "";
          let that = this;
          let isAdmin = false;
          that.selectionRows.forEach(function (row) {
            if (row.username == 'admin') {
              isAdmin = true;
            }
          });
          if (isAdmin) {
            that.$message.warning('管理员账号不允许此操作,请重新选择！');
            return;
          }
          that.selectedRowKeys.forEach(function (val) {
            ids += val + ",";
          });
          that.$confirm({
            title: "确认操作",
            content: "是否" + (status == 1 ? "解冻" : "冻结") + "选中账号?",
            onOk: function () {
              frozenBatch({ids: ids, status: status}).then((res) => {
                if (res.success) {
                  that.$message.success(res.message);
                  that.loadData();
                  that.onClearSelected();
                } else {
                  that.$message.warning(res.message);
                }
              });
            }
          });
        }
      },
      handleMenuClick(e) {
        if (e.key == 1) {
          this.batchDel();
        } else if (e.key == 2) {
          this.batchFrozen(2);
        } else if (e.key == 3) {
          this.batchFrozen(1);
        }
      },
      handleFrozen(id, status, username) {
        let that = this;
        //TODO 后台校验管理员角色
        if ('admin' == username) {
          that.$message.warning('管理员账号不允许此操作！');
          return;
        }
        frozenBatch({ids: id, status: status}).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData();
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      handleChangePassword(username) {
        this.$refs.passwordmodal.show(username);
      },
      handleAgentSettings(username) {
        this.$refs.sysUserAgentModal.agentSettings(username);
        this.$refs.sysUserAgentModal.title = "用户代理人设置";
      },
      handleSyncUser() {
      },
      passwordModalOk() {
        //TODO 密码修改完成 不需要刷新页面，可以把datasource中的数据更新一下
      }
    }

  }
</script>
<style scoped>
  /*@import '~@assets/less/common.less'*/
</style>