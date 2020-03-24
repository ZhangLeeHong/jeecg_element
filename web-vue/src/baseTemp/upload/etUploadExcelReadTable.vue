<!--npm install -S file-saver xlsx（这里其实安装了2个依赖）-->
<!--npm install -D script-loader-->
<!--<etUploadExcelReadTable v-if="1==0" @refresh="refresh" @uploadExcelJson="uploadExcelJson"-->
<!--ref="etUploadExcelReadTable"-->
<!--:filedMap="{name:'名称',tel:'电话',address:'地址',code:'纳税人识别号',bank:'开户行',account:'账号'}"-->
<!--:filedValueDefaultMap="{typeCode:typeCode}"-->
<!--/>-->
<style>
  .etUploadExcelReadTable .el-upload--text {
    width: auto;
    height: auto;
    border: 0;
  }

  .uertSpan {
    color: #cccccc;
    height: 28px;
    line-height: 28px;
    font-size: 12px;
  }

  .etUploadExcelReadTable .el-upload-list {
    display: none;
  }
</style>
<template>
  <span>
    <el-button :size="btnSize" type="primary" :loading="loadData" icon="iconfont-daoru" @click="show=true"
               style="margin-left: 10px">
              {{btnName}}
            </el-button>
  <el-dialog class="etUploadExcelReadTable" title="数据导入" width="1200px"
             top="10vh" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
             @close="closeDialog"
             :visible="show">
    <div>
      <el-upload style="float: left;margin-right: 20px"
                 action=""
                 :on-change="handleChange"
                 :on-remove="handleRemove"
                 :file-list="fileListUpload"
                 accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                 :auto-upload="false">
        <el-button type="primary" icon="iconfont-shangchuan3">上传Excel文件</el-button>

      </el-upload>
      <el-button @click="submit" type="success" :loading="loading" icon="iconfont-daoru">开始导入</el-button>
    </div>
    <slot></slot>
    <el-table v-loading="loadData" height="350" :data="outJson" class="tableInput"
              style="margin-top: 10px;width: 99%" border>

      <el-table-column label="" width="50" fixed="left" align="center">
        <template slot-scope="o">
          <el-button type="primary" @click="del(o.row)">删</el-button>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" class="index" fixed="left" align="center" width="40"/>
      <el-table-column v-for="(head,k) in headList" :key="k" class="index" align="center" width="120"
                       :show-overflow-tooltip="!isNullStr(selectFiled[head])">
        <template slot="header" slot-scope="scope">
          <el-select v-model="selectFiled[head]" style="color: #409EFF" placeholder="请选择" clearable>
            <el-option v-for="(item,key) in  filedMap" :key="key"
                       :label="filedKey==null?item:item[filedKey]" :value="key"
                       :disabled="mapValToKey(selectFiled)[key]!=null"
            >
            </el-option>
          </el-select>
        </template>
        <template slot-scope="o">
          <el-input v-if="isNullStr(selectFiled[head])" maxlength="200" style="width: 100%;" :controls="false"
                    size="mini"
                    v-model="o.row[head]"/>
          <span v-else class="uertSpan">{{o.row[head]}}</span>
        </template>
      </el-table-column>
    </el-table>

     <el-pagination @current-change="current"
                    :total="dataList.length"
                    :page-size="pageSize"
                    layout="slot,prev, pager, next">
<span v-if="dataList!=null" style="font-weight: bold">{{dataList.length}}行</span>
          </el-pagination>

  </el-dialog>
     </span>
</template>
<script>
  import FileSaver from 'file-saver'
  import xlsx from 'xlsx'

  export default {
    name: "etUploadExcelReadTable",
    data() {
      return {
        $xlsx: xlsx,
        pageIndex: 1,
        show: false,
        loading: false,
        loadData: false,
        fileListUpload: [],
        dataList: [],
        outJson: [],
        outFiledList: [],
        outJsonFiled: [],
        outFiledLength: 0,
        selectFiled: {},
        headList: {},
        price: {
          txt: "张飞"
        },
      };
    },
    props: {
      filedKey: {default: null},
      pageSize: {default: 10},
      disabled: {default: false},
      btnSize: {default: "small"},
      btnName: {default: "数据导入"},
      filedMap: {
        default: () => {
          return {};
        }
      },
      filedValueDefaultMap: {
        default: () => {
          return {};
        }
      },
    },
    computed: {},
    components: {
      /*加载组件*/
    },
    methods: {
      del(row) {
        this.current(this.pageIndex)
        this.delArrItem(this.outJson, row);
        this.delArrItem(this.dataList, row);
      },
      open() {
        this.$set(this, "show", true);
      },
      closeDialog() {
        this.$set(this, "show", false);
        Object.assign(this.$data, this.$options.data());
      },
      submit() {
        var $this = this;
        if (this.outJson.length == 0) {
          this.showMsgError("请上传Excel");
          return;
        }
        if (this.mapLength(this.selectFiled) == 0) {
          this.showMsgError("请选择对应数据列");
          return;
        }
        this.$confirm("确定批量导入当前数据吗？", '批量导入提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: "warning",
          center: true,
          confirmButtonClass: "confirmBtnOk"
        }).then((e) => {
          this.$set(this, "loading", true);
          var selectFiled = this.mapValToKey(this.selectFiled);
          var list = []
          this.dataList.forEach(o => {
            var map = {}
            for (var key in selectFiled) {
              map[key] = o[selectFiled[key]];
            }
            for (var key in this.filedValueDefaultMap) {
              if (!this.isNullStr(map[key])) {
                map[key] = this.filedValueDefaultMap[key];
              }
            }
            list.push(map);
          });
          this.$emit('uploadExcelJson', list, function () {
            $this.$set($this, "show", false);
            $this.$emit('refresh');
          }, function () {
            $this.$emit('refresh');
          });
          this.$set(this, "loading", false);
        });
      },
      // excel表上传
      handleChange(file, fileList) {
        this.fileTemp = file.raw
        // 判断上传文件格式
        if (this.fileTemp) {
          if ((this.fileTemp.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || (this.fileTemp.type == 'application/vnd.ms-excel')) {
//            this.importfxx(this.fileTemp)
            this.axiosUploadFile(null, this.fileTemp, function (resData) {
              this.axiosPost("/sysFile/readExcelJson.do", {file: resData.obj.filePath}, function (resData2) {
                this.$set(this, "loadData", true);
                this.importfxx(resData2.obj)
                ;this.$set(this, "loadData", false)
              });
            })
          } else {
            this.$message({
              type: 'warning',
              message: '附件格式错误，请删除后重新上传！'
            })
          }
        } else {
          this.$message({
            type: 'warning',
            message: '请上传附件！'
          })
        }
      },
      // 移除excel表
      handleRemove(file, fileList) {
        this.fileTemp = null
      },
      current(i) {
        this.$set(this, "pageIndex", i)
        this.$set(this, "outJson", this.dataList.slice((i - 1) * this.pageSize, i * this.pageSize));
      },
      importfxx(obj) {
        let $this = this;
        $this.$set($this, "selectFiled", {});
        var dataList = obj.dataList;
        var headList = obj.headList;
        this.$set(this, "headList", headList);
        var fmap = {};
        headList.forEach(h => {
          fmap[h] = dataList[0][h];
        })
        $this.$set($this, "dataList", dataList);
        $this.$set($this, "outFiledLength", headList.length);
        $this.$set($this, "outJsonFiled", this.listToMap(headList));
        $this.$set($this, "selectFiled", {});
        for (var k in fmap) {
          var v = fmap[k]
          for (var fk in $this.filedMap) {
            var fv = $this.filedMap[fk];
            if (k == fk || k == fv || v == fk || v == fv) {
              $this.$set($this.selectFiled, k, fk);
            }
          }
        }
        this.current(1);
      },
    }, watch: { //值改变动作 valObj(val){}
      selectFiled: {
        handler(newObj, oldObj) {

//          if (this.mapLength(this.selectFiled) > 0 && this.dataList.length != this.outJson.length) {
//            //console.log(this.mapLength(this.selectFiled))
//            this.$set(this, "outJson", this.dataList);
//          }
        }, deep: true
      }

    },
  }
  ;
</script>
