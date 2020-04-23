<template>
  <a-card :bordered="false">

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>

      <a-button @click="batchDel"
                v-if="selectedRowKeys.length > 0"
                ghost
                type="primary"
                icon="delete">批量删除
      </a-button>
    </div>

    <!-- table区域-begin -->
    <div class="mainArea ">
      <el-table default-expand-all :data="dataSource" style="width: 100%; " row-key="id" border
                :tree-props="{children: 'children', hasChildren: 'menu_type'}" :loading="loading"
                :height="getHeight(250)">

        <el-table-column prop="name" label="名称" sortable>
          <template slot-scope="o">
            <span :class="{isDir:o.row.menu_type==0}"><i :class="o.row.icon"></i> {{ o.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="地址">
          <template slot-scope="o">
            <a target="_blank" :href="o.row.url" style="text-decoration: underline" v-if="o.row.menuType!=0">
              {{o.row.url}}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="60">
          <template slot-scope="o" v-if="o.row.status != null">
            <span :style="{color: o.row.status == 0 ? 'red' : 'green'}">{{ o.row.status == 0 ? '停用' : '正常' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sortNo" width="60" label="顺序" align="center"/>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="o">
            <buttonEditMini @click="handleEdit(o.row)">编辑</buttonEditMini>
            <buttonEditMini @click="handleDetail(o.row)">详情</buttonEditMini>
            <buttonDelMini @click="handleDelete(o.row.id)">删除</buttonDelMini>
            <!--            <a-menu slot="overlay">-->
            <!--              <a-menu-item>-->
            <!--                <a href="javascript:;" @click="handleDetail(record)">详情</a>-->
            <!--              </a-menu-item>-->
            <!--              <a-menu-item>-->
            <!--                <a href="javascript:;" @click="handleAddSub(record)">添加子菜单</a>-->
            <!--              </a-menu-item>-->
            <!--              <a-menu-item>-->
            <!--                <a href="javascript:;" @click="handleDataRule(record)">数据规则</a>-->
            <!--              </a-menu-item>-->

            <!--              <a-menu-item>-->
            <!--                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">-->
            <!--                  <a>删除</a>-->
            <!--                </a-popconfirm>-->
            <!--              </a-menu-item>-->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--    <div>-->
    <!--      <a-table :columns="columns"-->
    <!--               size="middle"-->
    <!--               :pagination="false"-->
    <!--               :dataSource="dataSource"-->
    <!--               :loading="loading"-->
    <!--               :expandedRowKeys="expandedRowKeys"-->
    <!--               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"-->
    <!--               @expandedRowsChange="handleExpandedRowsChange">-->

    <!--        <span slot="action" slot-scope="text, record">-->
    <!--          <a @click="handleEdit(record)">编辑</a>-->

    <!--          <a-divider type="vertical"/>-->
    <!--          <a-dropdown>-->
    <!--            <a class="ant-dropdown-link">-->
    <!--              更多 <a-icon type="down"/>-->
    <!--            </a>-->
    <!--            <a-menu slot="overlay">-->
    <!--              <a-menu-item>-->
    <!--                <a href="javascript:;" @click="handleDetail(record)">详情</a>-->
    <!--              </a-menu-item>-->
    <!--              <a-menu-item>-->
    <!--                <a href="javascript:;" @click="handleAddSub(record)">添加子菜单</a>-->
    <!--              </a-menu-item>-->
    <!--              <a-menu-item>-->
    <!--                <a href="javascript:;" @click="handleDataRule(record)">数据规则</a>-->
    <!--              </a-menu-item>-->

    <!--              <a-menu-item>-->
    <!--                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">-->
    <!--                  <a>删除</a>-->
    <!--                </a-popconfirm>-->
    <!--              </a-menu-item>-->
    <!--            </a-menu>-->
    <!--          </a-dropdown>-->
    <!--        </span>-->
    <!--        &lt;!&ndash; 字符串超长截取省略号显示 &ndash;&gt;-->
    <!--        <span slot="url" slot-scope="text">-->
    <!--          <j-ellipsis :value="text" :length="25"/>-->
    <!--        </span>-->
    <!--        &lt;!&ndash; 字符串超长截取省略号显示&ndash;&gt;-->
    <!--        <span slot="component" slot-scope="text">-->
    <!--          <j-ellipsis :value="text"/>-->
    <!--        </span>-->
    <!--      </a-table>-->

    <!--    </div>-->
    <!-- table区域-end -->
    <permission-modal ref="modalForm" @ok="modalFormOk"></permission-modal>
    <permission-data-rule-list ref="PermissionDataRuleList" @ok="modalFormOk"></permission-data-rule-list>

  </a-card>
</template>

<script>
  import PermissionModal from './modules/PermissionModal'
  import {getPermissionList} from '@/api/api'
  import {ListMixin} from '@/mixins/ListMixin'
  import PermissionDataRuleList from './PermissionDataRuleList'

  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '菜单类型',
      dataIndex: 'menuType',
      key: 'menuType',
      customRender: function (text) {
        if (text == 0) {
          return '菜单'
        } else if (text == 1) {
          return '菜单'
        } else if (text == 2) {
          return '按钮/权限'
        } else {
          return text
        }
      }
    },
    {
      title: 'icon',
      dataIndex: 'icon',
      key: 'icon'
    },
    {
      title: '组件',
      dataIndex: 'component',
      key: 'component',
      scopedSlots: {customRender: 'component'}
    },
    {
      title: '路径',
      dataIndex: 'url',
      key: 'url',
      scopedSlots: {customRender: 'url'}
    },
    {
      title: '排序',
      dataIndex: 'sortNo',
      key: 'sortNo'
    },
    {
      title: '操作',
      dataIndex: 'action',
      scopedSlots: {customRender: 'action'},
      align: 'center',
      width: 150
    }
  ]

  export default {
    name: 'PermissionList',
    mixins: [ListMixin],
    components: {
      PermissionDataRuleList,
      PermissionModal,
    },
    data() {
      return {
        description: '这是菜单管理页面',
        // 表头
        columns: columns,
        loading: false,
        // 展开的行，受控属性
        expandedRowKeys: [],
        url: {
          list: '/sys/permission/list',
          delete: '/sys/permission/delete',
          deleteBatch: '/sys/permission/deleteBatch'
        }
      }
    },
    methods: {
      loadData() {
        this.dataSource = []
        getPermissionList().then((res) => {
          if (res.success) {
            this.dataSource = res.result
          }
        })
      },
      // 打开数据规则编辑
      handleDataRule(record) {
        this.$refs.PermissionDataRuleList.edit(record)
      },
      handleAddSub(record) {
        this.$refs.modalForm.title = "添加子菜单";
        this.$refs.modalForm.localMenuType = 1;
        this.$refs.modalForm.disableSubmit = false;
        this.$refs.modalForm.edit({status: '1', permsType: '1', route: true, 'parentId': record.id});
      },
      handleExpandedRowsChange(expandedRows) {
        this.expandedRowKeys = expandedRows
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>