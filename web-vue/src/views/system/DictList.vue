<template>
  <a-card :bordered="false">

    <!-- 左侧面板 -->
    <div class="table-page-search-wrapper">
      <el-input placeholder="输入字典名称、字典编号查询" v-model="queryParam.keyStr" clearable @keyup.enter.native="loadData"
                @clear="loadData" style="width: 280px" size="small"/>
      <a-button type="primary" @click="loadData" icon="search">查询</a-button>
      <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>

      <div class="table-operator" style="border-top: 5px">
        <a-button @click="handleAdd" type="primary" icon="plus">添加</a-button>
        <a-button type="primary" icon="download" @click="handleExportXls('字典信息')">导出</a-button>
        <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                  @change="handleImportExcel">
          <a-button type="primary" icon="import">导入</a-button>
        </a-upload>
        <a-button type="primary" icon="sync" @click="refleshCache()">刷新缓存</a-button>

        <a-button type="primary" icon="hdd" @click="openDeleteList">回收站</a-button>
      </div>
      <div class="mainArea">
        <el-table v-loading="loading" :data="dataSource" ref="table" border
                  :default-sort="sort={prop: 'create_time', order: 'descending'}"
                  @sort-change="sortChange" :height="getHeight(340)"
                  @selection-change="selectionChange" @row-dblclick="rowDblClick">
          <el-table-column type="index" align="center" width="60"/>
          <el-table-column prop="dictName" label="字典名称" width="160"/>
          <el-table-column prop="dictCode" label="字典编号" width="160"/>
          <el-table-column prop="description" label="描述" width="160" show-overflow-tooltip/>
          <el-table-column prop="createTime" label="创建时间" width="140" align="center" sortable>
            <template slot-scope="scope">
              <span>{{ scope.row.createTime | moment('YYYY-MM-DD HH:mm') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220" align="left" fixed="right">
            <template slot-scope="scope">
              <a @click="handleEdit(scope.row)">
                <a-icon type="edit"/>
                编辑
              </a>
              <a-divider type="vertical"/>
              <a @click="editDictItem(scope.row)">
                <a-icon type="setting"/>
                字典配置
              </a>
              <a-divider type="vertical"/>
              <a-popconfirm title="确定删除吗?" @confirm="() =>handleDelete(scope.row.id)">
                <a>删除</a>
              </a-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <pagination :page="ipagination" @refresh="refresh" @setVal="setVal"/>
      </div>

    </div>
    <dict-modal ref="modalForm" @ok="modalFormOk"></dict-modal>  <!-- 字典类型 -->
    <dict-item-list ref="dictItemList"></dict-item-list>
    <dict-delete-list ref="dictDeleteList"></dict-delete-list>
  </a-card>
</template>

<script>
  import {filterObj} from '@/utils/util';
  import {ListMixin} from '@/mixins/ListMixin'
  import DictModal from './modules/DictModal'
  import DictItemList from './DictItemList'
  import DictDeleteList from './DictDeleteList'
  import {getAction} from '@/api/manage'

  export default {
    name: "DictList",
    mixins: [ListMixin],
    components: {DictModal, DictItemList, DictDeleteList},
    data() {
      return {
        description: '这是数据字典页面',
        visible: false,
        // 查询条件
        queryParam: {},
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 120,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '字典名称',
            align: "left",
            dataIndex: 'dictName',
          },
          {
            title: '字典编号',
            align: "left",
            dataIndex: 'dictCode',
          },
          {
            title: '描述',
            align: "left",
            dataIndex: 'description',
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        dict: "",
        url: {
          list: "/sys/dict/list",
          delete: "/sys/dict/delete",
          exportXlsUrl: "sys/dict/exportXls",
          importExcelUrl: "sys/dict/importExcel",
          refleshCache: "sys/dict/refleshCache",
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      rowDblClick(row) {/*双击行编辑*/
        this.handleEdit(row)
      },
      getQueryParams() {
        var param = Object.assign({}, this.queryParam, this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        return filterObj(param);
      },
      //取消选择
      cancelDict() {
        this.dict = "";
        this.visible = false;
        this.loadData();
      },
      //编辑字典数据
      editDictItem(record) {
        this.$refs.dictItemList.edit(record);
      },
      // 重置字典类型搜索框的内容
      searchReset() {
        var that = this;
        that.queryParam.dictName = "";
        that.queryParam.dictCode = "";
        that.loadData(this.ipagination.current);
      },
      openDeleteList() {
        this.$refs.dictDeleteList.show()
      },
      refleshCache() {
        getAction(this.url.refleshCache).then((res) => {
          if (res.success) {
            this.$message.success("刷新缓存完成！");
          }
        }).catch(e => {
          this.$message.warn("刷新缓存失败！");
          console.log("刷新失败", e)
        })
      }
    },
    watch: {
      openKeys(val) {
        console.log('openKeys', val)
      },
    },
  }
</script>
