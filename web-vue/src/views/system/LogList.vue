<template>
  <el-card>
    <!--导航区域-->
    <div>
      <a-tabs defaultActiveKey="1" @change="callback">
        <a-tab-pane tab="登录日志" key="1"></a-tab-pane>
        <a-tab-pane tab="操作日志" key="2"></a-tab-pane>
      </a-tabs>
    </div>

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <el-input placeholder="请输入搜索关键词" v-model="queryParam.keyWord" clearable @keyup.enter.native="loadData"
                @clear="loadData" style="width: 180px" size="small"/>
      <el-date-picker v-model="queryParam.createTimeRange" type="daterange" size="small"
                      style="width: 250px;margin:  0px 8px; " @keyup.enter.native="loadData"
                      clearable @change="loadData" value-format="yyyy-MM-dd"
                      range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间"/>
      <j-dict-select-tag v-model="queryParam.operateType" placeholder="请选择操作类型" dictCode="operate_type"/>

      <a-button type="primary" style="left: 10px" @click="loadData" icon="search">查询</a-button>
      <a-button type="primary" @click="searchReset" icon="reload"
                style="margin-left: 8px;left: 10px">重置
      </a-button>
    </div>

    <div class="mainArea">
      <el-table v-loading="loading" :data="dataSource" ref="table" border
                :default-sort="sort={prop: 'create_time', order: 'descending'}"
                @sort-change="sortChange" :height="getHeight(300)"
                @selection-change="selectionChange">
        <el-table-column type="index" align="center" width="60"/>
        <el-table-column prop="logContent" label="日志内容" width="180" show-overflow-tooltip/>
        <el-table-column prop="userid" label="操作人ID" width="140"/>
        <el-table-column prop="username" label="操作人名称" width="140"/>
        <el-table-column prop="ip" label="IP" width="140" align="center"/>
        <el-table-column prop="costTime" label="耗时(毫秒)" width="140" align="center"/>
        <el-table-column prop="logType_dictText" label="日志类型" width="120" align="center"/>
        <el-table-column prop="createTime" label="创建时间" width="140" align="center" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | moment('YYYY-MM-DD HH:mm') }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination :page="ipagination" @refresh="refresh" @setVal="setVal"/>
    </div>
    <!--<div v-show="queryParam.logType==2" slot="expandedRowRender" slot-scope="record" style="margin: 0">-->
    <!--<div style="margin-bottom: 5px">-->
    <!--<a-badge status="success" style="vertical-align: middle;"/>-->
    <!--<span style="vertical-align: middle;">请求方法:{{ record.method }}</span></div>-->
    <!--<div>-->
    <!--<a-badge status="processing" style="vertical-align: middle;"/>-->
    <!--<span style="vertical-align: middle;">请求参数:{{ record.requestParam }}</span></div>-->
    <!--</div>-->
  </el-card>
</template>

<script>
  import {filterObj} from '@/utils/util';
  import {ListMixin} from '@/mixins/ListMixin'
  import JEllipsis from '@/components/jeecg/JEllipsis'

  export default {
    name: "LogList",
    mixins: [ListMixin],
    components: {
      JEllipsis
    },
    data() {
      return {
        description: '这是日志管理页面',
        // 查询条件
        queryParam: {
          ipInfo: '',
          createTimeRange: [],
          logType: '1',
          keyWord: '',
        },
        tabKey: "1",
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '日志内容',
            align: "left",
            dataIndex: 'logContent',
            scopedSlots: {customRender: 'logContent'},
            sorter: true
          },
          {
            title: '操作人ID',
            dataIndex: 'userid',
            align: "center",
            sorter: true
          },
          {
            title: '操作人名称',
            dataIndex: 'username',
            align: "center",
            sorter: true
          },
          {
            title: 'IP',
            dataIndex: 'ip',
            align: "center",
            sorter: true
          },
          {
            title: '耗时(毫秒)',
            dataIndex: 'costTime',
            align: "center",
            sorter: true
          },
          {
            title: '日志类型',
            dataIndex: 'logType_dictText',
            align: "center",
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
            align: "center",
            sorter: true
          }
        ],
        operateColumn:
          {
            title: '操作类型',
            dataIndex: 'operateType_dictText',
            align: "center",
          },
        labelCol: {
          xs: {span: 1},
          sm: {span: 2},
        },
        wrapperCol: {
          xs: {span: 10},
          sm: {span: 16},
        },
        url: {
          list: "/sys/log/list",
        },
      }
    },
    methods: {
      getQueryParams() {
        console.log(this.queryParam.createTimeRange)
        var param = Object.assign({}, this.queryParam, this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        delete param.createTimeRange; // 时间参数不传递后台
        return filterObj(param);
      },
      searchReset() { // 重置
        var that = this;
        var logType = that.queryParam.logType;
        that.queryParam = {}; //清空查询区域参数
        that.queryParam.logType = logType;
        that.loadData(this.ipagination.current);
      },
      callback(key) {// 日志类型
        // 动态添加操作类型列
        if (key == 2) {
          this.tabKey = '2';
          this.columns.splice(7, 0, this.operateColumn);
        } else if (this.columns.length == 9) {
          this.tabKey = '1';
          this.columns.splice(7, 1);
        }
        let that = this;
        that.queryParam.logType = key;
        that.loadData();
      },
      onDateChange(value, dateString) {
        console.log(dateString[0], dateString[1]);
        this.queryParam.createTime_begin = dateString[0];
        this.queryParam.createTime_end = dateString[1];
      },
      onDateOk(value) {
        console.log(value);
      },
    }
  }
</script>
