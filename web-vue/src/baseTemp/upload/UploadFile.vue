<template>
    <span class="uploadFile">
        <el-upload
          :disabled="readonly"
          class="avatar-uploader_file"
          :action="uploadUrl"
          :with-credentials="true"
          :on-success="uploadSuccess"
          :on-remove="fileRemove"
          :on-preview="clickFile"
          :before-upload="uploadFile"
          :file-list="fileList"
          :limit="limit"
          :list-type="listType"
          :on-exceed="outLimit">
            <el-button size="small" v-if="listType!='picture-card'&&!readonly" type="primary">{{btnName}}</el-button>
            <div class="el-upload__tip" v-if="tip!=''"
                 v-html="'<i class=\'iconfont-tixing\'></i>'+tip.replace('\n','</br>')"><i class="iconfont-tixing"></i></div>
            <div v-if="tempFile!=null&&tempFile.length>0">资料下载：
            <a :href="item.url" target="_blank" style="color: royalblue" v-for="(item,ii) in tempFile">
                <span v-if="ii>0">、</span>《{{item.name}}》</a>
            </div>
        </el-upload>
    </span>
</template>
<style>
  .el-upload__tip {
    color: #999;
    margin-top: 0
  }

  .el-upload__tip i {
    font-size: 16px;
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
      btnName: {default: "点击上传"}//按钮名称
      , tip: {default: ""}//文件说明,空字符串不显示
      , fileNameValidate: {type: String}
      , fileType: {default: "all"}//上传文件类型,或后缀名逗号分隔
      , maxFileSize: {default: 1024 * 1024 * 10}//文件大小限制
      , fileListName: {default: "fileList"}//父组件的对应的数据名称
      , fileList: {default: Array}//默认现在的文件列表{name,url}
      , tempFile: {default: Array}//默认现在的文件列表{name,url}
      , limit: {default: 6}
      , readonly: {default: false}
      , listType: {default: "picture"}//文件列表的类型text/picture/picture-card
      , showFileList: false//是否显示文件列表
    },
    methods: {
      uploadSuccess(resData, file, fileList) {//文件上传成功时的钩子res=返回结果，file文件内容
        if (this.fileList == undefined) {
          this.fileList = [];
        }
        var fileObj = resData.obj;
        var fileObjTemp = {};
        fileObjTemp.id = fileObj.id;
        fileObjTemp.url = resData.url;
        fileObjTemp.name = fileObj.name;
        this.$set(this.fileList, this.fileList.length, fileObjTemp);
        var list = this.strToArray(this.fileListName, ".");
//                alert(this.fileListName)
        list.push(this.fileList);
//                console.log("文件：" + list)
        this.$emit('setVal', list);
      },
      fileRemove(file, fileList) {//文件列表移除文件时的钩子
        this.fileList.splice(0);
        var this$ = this;
        fileList.forEach(function (f, i) {
          this$.$set(this$.fileList, i, f);
        });
      },
      outLimit(files, fileList) {
        this.$message.error("最多上传文件数量：" + this.limit);
      },
      clickFile(file) {//点击文件列表中已上传的文件时的钩子
        var url = file.url;
        if (file.response != null && file.response.url != null) {
          url = file.response.url
        }
        window.open(url);
      },
      //上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
      uploadFile(file) {
        if (this.fileNameValidate != null && this.fileNameValidate.trim().length > 0
          && file.name != null && file.name.indexOf(this.fileNameValidate) == -1) {
          this.showMsgError("文件名必须包含：" + this.fileNameValidate)
          return false;
        }
        var imageType = "jpg,jpeg,png,bmp,gif";
        var flashType = "swf,flv";
        var mediaType = "swf,flv,mp3,wav,wma,wmv,mid,avi,mpg,asf,rm,rmvb,mp4";
        var fileType = "doc,docx,xls,xlsx,ppt,txt,zip,rar,gz,bz2,pdf";
        var fileList2 = "jpg,jpeg,png,bmp,gif,pdf";
        var typeMap = {
          "image": imageType
          , "flash": flashType
          , "media": mediaType
          , "file": fileType
          , "rfFile": fileList2
          , "all": imageType + "," + flashType + "," + mediaType + "," + fileType
        };
        var suffixList = "";
        if (typeMap[this.fileType] != undefined) {
          suffixList = typeMap[this.fileType];
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
<style>
  .avatar-uploader_file .el-upload--text {
    width: auto;
    height: auto;
    border: 0;

  }

  .uploadFile .el-upload {
    display: inline-block;
    text-align: inherit;
    cursor: default;
    outline: 0
  }
</style>
