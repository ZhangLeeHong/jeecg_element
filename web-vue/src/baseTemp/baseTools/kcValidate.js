import Vue from 'vue'

Vue.prototype.requiredMsg = function (msg) {
    var map = this.copyObj(this.required);
    if (msg) {
        map.message = msg;
    }
    return map;
}

Vue.prototype.required = {required: true, message: "必填", trigger: "blur"};
Vue.prototype.number = {type: "number", message: "必须为数字值", trigger: "blur"};
var validateUsername = (rule, value, callback) => {
    if (!/^[a-zA-Z0-9_]{2,16}$/.test(value)) {
        callback(new Error('必须是（字母，数字，下划线），4到16位'));
    } else {
        callback();
    }
};

Vue.prototype.username = {min: 2, max: 16, validator: validateUsername, trigger: 'blur'};
Vue.prototype.vPhone = function (str) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(str)) {
        return false;
    } else {
        return true;
    }
}
Vue.prototype.vArray = function (value){
    if (value == null || value == undefined || value == '[]') {
        return false;
    }
    if (value instanceof Array) {
        if (value.length == 0) {
            return false;
        } else {
            return true;
        }
    }
    if (value instanceof String && value.trim().length == 0) {
        return false;
    }
    return true;
}

