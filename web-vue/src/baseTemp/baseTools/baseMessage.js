import Vue from 'vue'
import {Toast} from 'vant';

Vue.use(Toast);

/**
 * 展示成功提示
 */
Vue.prototype.toastSuccess = function (txt) {
    Toast.success(txt);
};
/**
 * 展示失败提示
 */
Vue.prototype.toastFail = function (txt) {
    Toast.fail(txt);
};
/**
 * @param txt 消息内容
 * @param type 消息类型:success,warning,error
 */
Vue.prototype.showMsg = function (txt, type, duration) {
    if (!type) {
        type = "success";
    }
    if (!duration) {
        duration = 500;
    }

    if (this.$vant != undefined || this.$vant == true) {
        this.$dialog.alert({
            title: txt,
            className: type
        }).then(() => {
        });
    } else {

        this.$message({
            message: txt,//显示消息
            type: type,//消息类型
            duration: duration,//关闭时间
            showClose: true,//显示关闭按钮
        });
    }
};
/**
 * 成功消息
 */
Vue.prototype.showMsgSuccess = function (txt, times) {
    if (times == undefined) {
        times = 1000;
    }
    this.showMsg(txt, "success", 1000);
};
/**警告消息*/
Vue.prototype.showMsgWarning = function (txt, times) {
    if (times == undefined) {
        times = 3000;
    }
    this.showMsg(txt, "warning", 3000);
};
/**错误消息*/
Vue.prototype.showMsgError = function (txt, times) {
    if (times == undefined) {
        times = 5000;
    }
    this.showMsg(txt, "error", 5000);
};
/**异常提示*/
Vue.prototype.showExceptionMsg = function (ex) {
    this.showMsgError(ex + "");
    this.closeLoading();
}
Vue.prototype.closeLoading = function () {
    if (this.defaultLoading) {
        this.$set(this, "loading", false);
    }
}
Vue.prototype.closeLoading = function () {
    if (this.defaultLoading) {
        this.$set(this, "loading", false);
    }
}
