<template>
  <div class="avatar-uploader_img">
    <el-upload
      :disabled="readonly"
      :action="uploadUrl"
      :with-credentials="true"
      :show-file-list="false"
      :on-preview="clickFile"
      :on-remove="fileRemove"
      :on-success="uploadSuccess"
      :before-upload="uploadFileBefore">
      <img v-if="uploadFile.url" :src.sync="uploadFile.url" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader_img-icon"></i>

    </el-upload>
    <el-button @click="clickFile" circle><i class="el-icon-search"></i></el-button>
    <span v-if="isNullStr(tip)"><i class="iconfont-tixing"></i>{{tip}}</span>
  </div>
</template>
<style>
  .avatar-uploader_img {
    width: 160px;
    height: auto;
    float: left;
  }

  .avatar-uploader_img .el-upload {
    border: 1px dashed #d9d9d9;
    padding: 1px;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    height: 148px;
    width: 148px;
    line-height: 148px;
  }

  .avatar-uploader_img .el-upload:hover {

    border-color: #409EFF;
  }

  .avatar-uploader_img-icon {
    font-size: 28px;
    color: #8c939d;
    /*width: 138px;*/
    /*height: 105px;*/
    /*line-height: 105px;*/
    text-align: center;
  }

  .avatar {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
<script type="text/javascript">
  export default {
    data() {
      return {
        btnDisabled: false
      };
    },
    computed: {
      uploadUrl() {
        return this.axiosUrl(this.vueConfig.apiUrl) + "/sysFile/uploadFile.do";
      }
    },
    mounted() {
    },
    props: {

      title: {default: ""}
      , readonly: {type: Boolean}
      , tip: {default: ""}//文件说明,空字符串不显示
      , maxFileSize: {default: 1024 * 1024 * 10}//文件大小限制
      , uploadFile: {
        default: function () {
          return {id: "", url: ""}
        }
      }//默认现在的文件列表{name,url}
      , uploadFileName: {default: "uploadFile"}//父组件的对应的数据名称
      , fileType: {default: ""}//上传文件类型,或后缀名逗号分隔
    },
    methods: {
      uploadSuccess(resData, file, fileList) {//文件上传成功时的钩子res=返回结果，file文件内容
        var obj = resData.obj;
        var fileObj = {};
        fileObj.id = obj.id;
        fileObj.url = resData.url;
        this.$set(this, "uploadFile", fileObj)
        var list = this.strToArray(this.uploadFileName, ".");
        list.push(fileObj);
        this.$emit('setVal', list);
      },
      fileRemove(file, fileList) {//文件列表移除文件时的钩子
        this.uploadFile = {};
      },
      clickFile() {//点击文件列表中已上传的文件时的钩子
        var url = this.uploadFile.url;
        if (this.uploadFile.response != null && this.uploadFile.response.url != null) {
          url = this.uploadFile.response.url
        }
        window.open(url);
      },
      //上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
      uploadFileBefore(file) {
        if (file.size == 0) {
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
        return true;
      }
    }
  }
</script>
