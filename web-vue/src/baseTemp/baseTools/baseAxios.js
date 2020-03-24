import Vue from 'vue'

Vue.prototype.fileUrl = function (fileId) {
  return this.axiosUrl(this.vueConfig.apiUrl) + "/sysFile/findFile.do?id=" + fileId;
}
Vue.prototype.openFileUrl = function (fileId) {
  var url = this.axiosUrl(this.vueConfig.apiUrl) + "/sysFile/findFile.do?id=" + fileId;
  window.open(url);
}
Vue.prototype.axiosUrl = function (apiUrl) {
  var url = "http://" + document.domain;
  if (apiUrl > 0) {
    url = url + ":" + apiUrl

  } else {
    url = apiUrl;
  }
  return url;
}
Vue.prototype.addEditStatus = function () {
  return this.funStatus(this.baseUrl + "/addEdit.action");
}
Vue.prototype.funStatus = function (url) {
  var status = this.author[url];
  return status == undefined ? false : status;
}
Vue.prototype.delStatus = function () {
  return this.funStatus(this.baseUrl + "/delete.action");
}
Vue.prototype.axiosAuthor = function (callbackFn) {
  this.axiosPost("/sysAdmin/findAuthor.do", {menu_fullPath: this.$route.fullPath}, function (resData) {
    this.$set(this, "author", resData.author);
    this.runCallbackFn(callbackFn, resData);
  });
}


Vue.prototype.axiosPost = function (url, data, callbackFn) {
  try {
    data.route = this.getRouteJson();
    this.axios({
      method: "post",
      url: url,
      data: data
    }).then(res => {
      if (this.judgeStatus(res.data)) {
        this.runCallbackFn(callbackFn, res.data);
      }
      this.submitLoading = false;
    }).catch(err => {
      console.log(err)
      this.showExceptionMsg(err);
    });
  } catch (err) {
    console.log(err)
    this.showExceptionMsg(err);
  }
}
Vue.prototype.axiosGet = function (url, params, callbackFn) {
  try {
    this.axios({
      method: "GET",
      url: url,
      params: params
    }).then(res => {
      if (this.judgeStatus(res.data)) {
        this.runCallbackFn(callbackFn, res.data);
      }
    }).catch(err => {
      this.showExceptionMsg(err);
    });
  } catch (err) {
    this.showExceptionMsg(err);
  }
}
/**
 * 初始化请求参数
 * @param params
 * @returns {*}
 */
Vue.prototype.getRouteJson = function () {

  var route = {};
// console.log(this.$route)
  route.fullPath = this.$route.fullPath;
  route.path = this.$route.path;
  for (var item in this.$route.query) {
    route["query." + item] = this.$route.query[item];
  }
  // console.log("route",route)
  return route;
}
/**
 * 分页查询
 * @param obj {pageNumber:当前页码,pageSize:页大小,其他查询条件}
 * @param callbackFn
 */
Vue.prototype.axiosPage = function (reqData, callbackFn, showResultMsg) {
  // console.log(this.initParams())

  this.loading = true;
  var url = this.baseUrl + "/findPage.action";
  if (this.urlDo == true) {
    url = this.baseUrl + "/findPage.do";
  }
  this.axiosPost(url, reqData, function (resData) {
    if (showResultMsg == true) {
      this.$message({message: resData._result.msg, type: 'success'});
    }
    this.$set(this, "page", resData.page);
    this.runCallbackFn(callbackFn, resData);
    this.loading = false;
    this.jsHeight();
  });

};
Vue.prototype.axiosUpdate = function (reqData, callbackFn) {
  var url = this.baseUrl + "/addEdit.action";
  this.axiosPost(url, reqData, function (resData) {
    if (this.showResultMsg == true) {
      this.$message({message: "修改成功", type: 'success'});
    }
    this.runCallbackFn(callbackFn, resData);
  });

};
/**
 * 新增修改
 * @param obj {obj:{对象属性}}
 * @param callbackFn
 */
Vue.prototype.axiosAddEdit = function (reqData, callbackFn) {

  this.$refs["obj"].validate((valid, noFieldList) => {
    console.log("valid==" + valid)
    if (valid) {
      this.loading = true;
      var url = this.baseUrl + "/addEdit.action";
      if (this.urlDo == true) {
        url = this.baseUrl + "/addEdit.do";
      }
      this.axiosPost(url, reqData, function (resData) {
        if (this.showResultMsg == true) {
          if (reqData.obj.id > 0) {
            this.$message({message: "修改成功", type: 'success'});
          } else {
            this.$message({message: "新增成功", type: 'success'});
          }
        }
        this.runCallbackFn(callbackFn, resData);
        this.loading = false;
      });
    } else {
      this.validScroll("obj", noFieldList);
    }
  });
};
/**
 * 通用-查询单个对象
 * @param reqData {id:1}
 * @param callbackFn
 * @param showResultMsg
 */
Vue.prototype.axiosFind = function (reqData, callbackFn, showResultMsg) {

  this.loading = true;
  this.$set(this, "obj", {});
  var url = this.baseUrl + "/find.action";
  if (this.urlDo == true) {
    url = this.baseUrl + "/find.do";
  }
  this.axiosPost(url, reqData, function (resData) {

    if (showResultMsg == true) {
      this.$message({message: resData._result.msg, type: 'success'});
    }
    if (resData.obj != undefined) {
      this.$set(this, "obj", resData.obj);
      this.resetFieldsBase("obj");//清除obj对象的残留验证
    }

    this.runCallbackFn(callbackFn, resData);
    this.loading = false;
  });

};
Vue.prototype.axiosUploadFile = function (url, file, callbackFn, errorFn) {
  try {
    if (url == null) {
      url = "/sysFile/uploadFile.do"
    }
    let formData = new FormData();
    formData.append("file", file);
    this.axios({
      method: "post",
      url: url,
      data: formData,
      headers: {'Content-Type': "multipart/form-data;boundary=" + new Date().getTime()}
    }).then(res => {
      if (this.judgeStatus(res.data)) {
        this.runCallbackFn(callbackFn, res.data);
      } else {
        this.runCallbackFn(errorFn, res.data);
      }
    }).catch(err => {
      ////console.log(err)
      this.runCallbackFn(errorFn);
      this.showMsgError(err);
      //console.log(err)
    });
  } catch (err) {
    //console.log(err)
    this.showMsgError(err);
  }
}
/**
 * 通用批量删除
 * @param ids id数组、json数组、单个ID
 * @param callbackFn
 * @param showResultMsg
 */
Vue.prototype.axiosDel = function (ids, callbackFn, tipMsg, showResultMsg) {
  this.axiosBaseDel(null, ids, callbackFn, tipMsg, showResultMsg)
}
Vue.prototype.axiosBaseDel = function (url2, ids, callbackFn, tipMsg, showResultMsg) {
  try {
    if (ids.length == undefined) {//判断是不是数组，不是数组进行组装
      ids = this.strToArray(ids + "", ",");
    }
    if (ids.length == 0) {
      this.$message({message: "请选择要删除的数据", type: 'warning'});
      return;
    } else {
      if (ids[0].id != undefined) {
        ids = this.arrayJoinArray(ids, "id")
      }
      var confimMsg = "您确定要删除【" + tipMsg + "】吗？";
      if (tipMsg == undefined) {
        confimMsg = "您确定要删除该信息吗？";
      }
      this.$confirm(confimMsg, '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: "warning",
        center: true,
        confirmButtonClass: "confirmBtnOk"
      }).then((e) => {
        var params = {};
        params.ids = ids;
        var url = this.baseUrl + "/delete.action";
        if (this.urlDo == true) {
          url = this.baseUrl + "/delete.do";
        }
        if (url2 != null) {
          url = url2;
        }
        this.axiosPost(url, params, function (resData) {
          if (this.judgeStatus(resData)) {
            if (showResultMsg != false) {
              this.$message({message: "删除成功", type: 'success'});
            }
            this.runCallbackFn(callbackFn, resData);
          }
        });

      });
    }
  } catch (err) {
    this.showExceptionMsg(err);
  }
};
Vue.prototype.callbackFn = function () {
}
/**
 * 执行回调函数，
 */
Vue.prototype.runCallbackFn = function (callbackFn, resData) {
  if (callbackFn != undefined) {
    this.callbackFn = callbackFn;
    // console.log(callbackFn)
    this.callbackFn(resData);
  }

}
/**
 * 验证data._result状态
 */
Vue.prototype.judgeStatus = function (resData) {
  try {
    this.judgeVersion(resData);
    if (resData != null && resData._result != null && resData._result.code != null) {
      if (resData._result.code == 301) {
        this.showMsgError("会话超时，请重新登录");
        this.$router.push({path: '/login'});
        return false;
      } else if (resData._result.code == 300) {
        this.showExceptionMsg(resData._result.msg);
        return false;
      } else if (resData._result.code != 200) {
        this.showExceptionMsg("异常错误：" + resData._result.msg);
        return false;
      }
    }
    return true;
  } catch (ex) {
    this.showExceptionMsg(ex);
    return false;
  }
}

Vue.prototype.judgeVersion = function (resData) {
  if (resData == null || resData._result == null) {
    return null;
  }

  var versionMap = this.vueConfig.versionMap;
  var sysConfig = resData._result.sysConfig;
  if (sysConfig == null || versionMap == null) {
    return;
  }
  for (var v in versionMap) {
    console.log(versionMap[v], sysConfig[v])
    // if (versionMap[v] != sysConfig[v] && process.env.NODE_ENV == 'production') {
    if (versionMap[v] != sysConfig[v]) {
      //开发模式不提醒
      var title = "当前版本" + versionMap[v] + "，新版本" + sysConfig[v] + "，点击【升级】自动更新升级";
      this.$confirm(title, {
        confirmButtonText: '升级',
        center: true,
      }).then(_ => {
        window.location.reload(true)
        // $this.$router.push({path: $this.$route.fullPath,query:{"_":new Date().getTime()} });
      }).catch(_ => {
      });
      // this.$dialog.confirm({
      //     title: '升级',
      //     message: title
      // }).then(() => {
      //     window.location.reload(true)
      //
      // }).catch(() => {
      //     // on cancel
      // });
    }
  }

}