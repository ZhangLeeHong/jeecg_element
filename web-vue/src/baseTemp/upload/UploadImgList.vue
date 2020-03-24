<template>
  <div :class="{showAdd:limit==value.length,uploadImgList:true}">
    <el-upload
      :disabled="readonly"
      :action="uploadUrl"
      :with-credentials="true"
      list-type="picture-card"
      :file-list="value"
      :on-preview="clickFile"
      :on-remove="fileRemove"
      :on-success="uploadSuccess"
      :before-upload="uploadFileBefore"
      :limit="limit"
      :on-exceed="outLimit"
    >
      <i slot="default" class="el-icon-plus"></i>


      <div slot="file" slot-scope="{file}">
        <label class="del el-upload-list__item-status-label">
          <i class="el-icon-close" style="" @click="fileRemove(file)"></i>
        </label>

        <viewer class="img" :images="listJsonToList(value,'url')">
          <img v-for="f in value" class="el-upload-list__item-thumbnail" style=""
               :style="{display: f.url!=file.url?'none':''}" :src="f.url" :key="f.url">
        </viewer>
        <!--<el-image v-if="file!=null"-->
        <!--:src="file.url"-->
        <!--:preview-src-list="listJsonToList(value,'url')">-->
        <!--</el-image>-->
        <!--<img class="el-upload-list__item-thumbnail" :src="file.url" alt="">-->
        <!--<span v-if="!readonly" class="el-upload-list__item-delete" @click="fileRemove(file)">-->
        <!--<i class="el-icon-delete"></i>-->
        <!--</span>-->
      </div>

    </el-upload>
    <div class="el-upload__tip" v-if="isNullStr(tip)"><i class="iconfont-tixing"></i>{{tip}}</div>
    <div v-if="tempFile!=null&&tempFile.length>0">资料下载：
      <a :href="item.url" target="_blank" style="color: royalblue" v-for="(item,ii) in tempFile">
        <span v-if="ii>0">、</span>《{{item.name}}》</a>
    </div>
  </div>
</template>
<style>
  .el-upload-list__item.is-success:hover .el-upload-list__item-status-label {
    display: block;
  }

  .el-upload-list__item.is-uploading {
    display: none;
  }

  .el-upload-list__item.is-success .el-upload-list__item-status-label {
    display: none;
  }

  .el-upload-list--picture-card .del.el-upload-list__item-status-label i {
    display: block;
    top: 0px;
    margin-top: 8px;
    margin-right: 8px;
    color: red;
    font-size: 14px;
    font-weight: bold;
  }

  .el-upload-list--picture-card .del.el-upload-list__item-status-label {
    background: #ffffffbf;
  }

  .uploadImgList .el-upload-list__item-delete i {
    font-weight: bold;
    font-size: 16px;
    color: red;
  }

  .uploadImgList .el-upload-list__item-delete {
    display: inherit;
    right: 5px;
    bottom: 5px;
    top: inherit;
    /*background-color: #60626661;*/
    /* border-color: #fff; */
    /*border-radius: 240px;*/
    text-align: center;

    /*width: 30px;*/
  }

  .showAdd .el-upload {
    display: none;
  }

  .el-upload__tip {
    color: #606266
  }

  .el-upload__tip i {
    font-size: 16px;
  }

  .readonlytrue .el-upload--picture-card {
    display: none;
  }

  .el-upload-list--picture-card .el-upload-list__item.is-uploading {
    /*display: none;*/
  }

  .el-upload-list--picture-card .el-upload-list__item .img {

    width: 148px;
    height: 148px;
    /*line-height: 148px;*/

  }

  .el-upload-list--picture-card .el-upload-list__item-thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background-image: url("../../assets/img/img_load_erro.png");
    background-size: cover;
    background-color: #fff;
  }

</style>
<script type="text/javascript">
  export default {
    data() {
      return {
        btnDisabled: false,
        readonly2: this.readonly,
      };
    },
    computed: {
      uploadUrl() {
        return this.axiosUrl(this.vueConfig.apiUrl) + this.url;
      }
    },
    mounted() {
      var $this = this;
      setTimeout(function () {
        $this.getReadonly()
      }, 100)

    },
    props: {
      title: {default: ""}
      , tip: {type: String}//文件说明,空字符串不显示
      , limit: {default: 6}
      , fileNameValidate: {type: String}
      , readonly: {type: Boolean}
      , maxFileSize: {default: 1024 * 1024 * 10}//文件大小限制
      , value: {default: Array}//默认现在的文件列表{name,url}
      , fileType: {default: ""}//上传文件类型,或后缀名逗号分隔
      , tempFile: {default: Array}//默认现在的文件列表{name,url}
      , url: {default: "/sysFile/uploadFile.do", type: String}
    },
    mounted() {
    },
    watch: { //值改变动作 valObj(val){}

    },
    methods: {

      uploadSuccess(resData, file, fileList) {//文件上传成功时的钩子res=返回结果，file文件内容
        if (this.value == null) {
          this.$set(this, "value", new Array())
        }
        var fileObj = {};
        fileObj.name = resData.obj.name;
        fileObj.url = resData.url;
        this.value.push(fileObj)
        this.$emit('change');
      },
      outLimit(files, fileList) {
        this.$message.error("最多上传文件数量：" + this.limit);
      },
      fileRemove(file, fileList) {//文件列表移除文件时的钩子
        this.delArrItem(this.value, file)
      },
      clickFile(file) {//点击文件列表中已上传的文件时的钩子
        var url = file.url;
        if (file.response != null && file.response.url != null) {
          url = file.response.url
        }
        window.open(url);
      },
      //上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
      uploadFileBefore(file) {

        if (this.fileNameValidate != null && this.fileNameValidate.trim().length > 0
          && file.name.indexOf(this.fileNameValidate) == -1) {
          this.showMsgError("文件名必须包含：" + this.fileNameValidate)
          return false;
        }
        var imageType = "jpg,jpeg,png,bmp,gif";
        var suffixList = "";
        if (this.fileType == undefined || this.fileType == "") {
          suffixList = imageType;
        } else {
          suffixList = this.fileType;
        }
        suffixList = suffixList.toLocaleLowerCase();
        var suffix = file.name.substr(file.name.lastIndexOf(".") + 1).toLocaleLowerCase();
        var suffixListTemp = "," + suffixList + ",";
        if (suffixListTemp.indexOf("," + suffix + ",") == -1) {
          this.$message.error('上传的文件类型为：' + suffixList);
          return false;
        }
        if (file.size > this.maxFileSize) {
          this.$message.error('上传的文件大小不能超过：' + this.maxFileSize / 1024 + " KB");
          return false;
        }
//              lrz(file,{ width : 600,  quality:1}).then(r=>{
//                console.log(r.formData);
//                console.log(file);
//                file=r.file;
//                return r.file;
//              });
        file = null;
        return true;
      }
    }
  }
</script>
