import Vue from 'vue'

Vue.prototype.fileUrl = function (fileId) {
    return this.axiosUrl(this.$Config.apiUrl) + "/sysFile/findFile.do?id=" + fileId;
}
Vue.prototype.openFileUrl = function (fileId) {
    var url = this.axiosUrl(this.$Config.apiUrl) + "/sysFile/findFile.do?id=" + fileId;
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
Vue.prototype.axiosAuthor = function (callbackFn) {
    this.axiosPost("/sysAdmin/findAuthor.do", {menu_fullPath: this.$route.path}, function (resData) {
        this.$set(this, "author", resData.author);
        this.runCallbackFn(callbackFn, resData);
    });
}
Vue.prototype.axiosPost = function (url, data, callbackFn, errorFn) {
    try {
        this.defaultLoading = true;
        data.route = this.getRouteJson();
        this.axios({
            method: "post",
            url: url,
            data: data
        }).then(res => {
            if (this.judgeStatus(res.data)) {
                this.runCallbackFn(callbackFn, res.data);
            }else{
                this.runCallbackFn(errorFn, res.data);
            }
            this.defaultLoading = false;
        }).catch(err => {
            this.defaultLoading = false;
            this.showExceptionMsg(err);
        });
    } catch (err) {
        this.defaultLoading = false;
        this.showExceptionMsg(err);
    }
}
Vue.prototype.axiosGet = function (url, params, callbackFn,errorFn) {
    try {
        this.defaultLoading = true;
        this.axios({
            method: "GET",
            url: url,
            params: params
        }).then(res => {

            if (this.judgeStatus(res.data)) {
                this.runCallbackFn(callbackFn, res.data);
            }else{
                this.runCallbackFn(errorFn, res.data);
            }
            this.defaultLoading=false;
        }).catch(err => {
            this.defaultLoading=false;
            this.showExceptionMsg(err);
        });
    } catch (err) {
        this.defaultLoading=false;
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

    this.defaultLoading = true;
    var url = this.baseUrl + "/findPage.action";

    this.axiosPost(url, reqData, function (resData) {
        if (showResultMsg == true) {
            this.$message({message: resData._result.msg, type: 'success'});
        }
        this.$set(this, "page", resData.page);
        this.runCallbackFn(callbackFn, resData);
        this.defaultLoading = false;
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
Vue.prototype.axiosAddEdit = function (reqData, callbackFn,errorFn) {
    var formValid = false;
    this.$refs["obj"].validate((valid) => {
        if (valid) {
            formValid = true;
        }
    });
    if (!formValid) {
        return;
    }
    this.defaultLoading = true;
    var url = this.baseUrl + "/addEdit.action";
    this.axiosPost(url, reqData, function (resData) {
        if (this.showResultMsg == true) {
            if (reqData.obj.id > 0) {
                this.$message({message: "修改成功", type: 'success'});
            } else {
                this.$message({message: "新增成功", type: 'success'});
            }

        }
        this.runCallbackFn(callbackFn, resData);
        this.defaultLoading = false;
    },errorFn);

};
/**
 * 通用-查询单个对象
 * @param reqData {id:1}
 * @param callbackFn
 * @param showResultMsg
 */
Vue.prototype.axiosFind = function (reqData, callbackFn, showResultMsg) {
    this.resetFields("obj");//清除obj对象的残留验证
    this.defaultLoading = true;
    this.$set(this, "obj", {});
    var url = this.baseUrl + "/find.action";
    this.axiosPost(url, reqData, function (resData) {

        if (showResultMsg == true) {
            this.$message({message: resData._result.msg, type: 'success'});
        }
        if (resData.obj != undefined) {
            this.$set(this, "obj", resData.obj);
        }

        this.runCallbackFn(callbackFn, resData);
        this.defaultLoading = false;
    });

};
/**
 * 通用批量删除
 * @param ids id数组、json数组、单个ID
 * @param callbackFn
 * @param showResultMsg
 */
Vue.prototype.axiosDel = function (ids, callbackFn, tipMsg, showResultMsg) {
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
Vue.prototype.uuid=function() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}
/**
 * 执行回调函数，
 */
Vue.prototype.runCallbackFn = function (callbackFn, resData) {
    try {
        if (callbackFn != undefined) {
            this.callbackFn = callbackFn;
            // console.log(callbackFn)
            this.callbackFn(resData);
        }
    } catch (ex) {
        this.showExceptionMsg(ex);
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
            }else if (resData._result.code == 303) {
                this.showMsgError("会话超时，请重新登录");
                // this.$router.push({path: '/login'});
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
    //调用拨号功能

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
        if (versionMap[v] != sysConfig[v] && process.env.NODE_ENV == 'production') {
            //开发模式不提醒
            var title = "当前版本" + versionMap[v] + "，新版本" + sysConfig[v] + "，点击【升级】自动更新升级";
            // this.$confirm(title, {
            //     confirmButtonText: '升级',
            //     center: true,
            // }).then(_ => {
            //     window.location.reload(true)
            //     // $this.$router.push({path: $this.$route.fullPath,query:{"_":new Date().getTime()} });
            // }).catch(_ => {
            // });
            this.$dialog.confirm({
                title: '升级',
                message: title
            }).then(() => {
                window.location.reload(true)

            }).catch(() => {
                // on cancel
            });
        }
    }
}