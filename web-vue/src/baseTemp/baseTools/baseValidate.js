import Vue from 'vue'

var validateUpload = (rule, value, callback) => {
  if (JSON.stringify(value) == '{}') {
    callback(new Error('必填'));
  } else {
    callback();
  }
};
var validateUsername = (rule, value, callback) => {
  if (!/^[a-zA-Z0-9_]{2,16}$/.test(value)) {
    callback(new Error('必须是（字母，数字，下划线），4到16位'));
  } else {
    callback();
  }
};
var validatePassword = (rule, value, callback) => {
  if (value == null || value.length == 0) {
    callback();
    return;
  }
  if (!/^(?=.*[a-zA-Z]+)(?=.*[0-9]+)[a-zA-Z0-9]+$/.test(value)) {
    callback(new Error('密码必须包含（字母，数字）'));
  } else {
    callback();
  }
};
var validateFload = (rule, value, callback) => {
  if (!/^(-?\d+)(\.\d+)?$/.test(value)) {
    callback(new Error('必须是浮点数'));
  } else {
    callback();
  }
};
var validatePlusFload = (rule, value, callback) => {
  if (!/^\d+(\.\d+)?$/.test(value)) {
    callback(new Error('必须是正浮点数'));
  } else {
    callback();
  }
};
var validateNumber = (rule, value, callback) => {
  if (!/^-?\d+$/.test(value)) {
    callback(new Error('必须是数字'));
  } else {
    callback();
  }
};
var validatePlusNumber = (rule, value, callback) => {
  if (!/^[0-9]*$$/.test(value)) {
    callback(new Error('必须是正数'));
  } else {
    callback();
  }
};

var validatePlusIdCard = (rule, value, callback) => {
  if (value != null && value != '' && value != undefined) {
    if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
      callback(new Error('身份证格式不正确'));
    } else {
      callback();
    }
  } else {
    callback();
  }
};
var validatePlusPhone = function (rule, value, callback) {
  if (value != null && value != '' && value != undefined) {
    if (!/^1[3456789]\d{9}$/.test(value)) {
      callback(new Error('手机号码格式不正确'));
    } else {
      callback();
    }
  } else {
    callback();
  }
};
var validateEMail = function (rule, value, callback) {
  if (value != null && value != '' && value != undefined) {
    if (!/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
      callback(new Error('邮箱格式不正确'));
    } else {
      callback();
    }
  } else {
    callback();
  }
};
Vue.prototype.vEMail = {validator: validateEMail, trigger: 'change'};
Vue.prototype.required = {required: true, message: "必填", trigger: "change"};
Vue.prototype.vRequired = {required: true, message: "必填", trigger: "change"};
Vue.prototype.number = {type: "number", message: "必须是整数", trigger: "change"};
Vue.prototype.vUsername = {min: 2, max: 16, validator: validateUsername, trigger: 'change'};
Vue.prototype.vPassword = {validator: validatePassword, trigger: 'change'};
Vue.prototype.vFload = {validator: validateFload, trigger: 'change'};
Vue.prototype.vPlusFload = {validator: validatePlusFload, trigger: 'change'};
Vue.prototype.vNumber = {validator: validateNumber, trigger: 'change'};
Vue.prototype.vPlusNumber = {validator: validatePlusNumber, trigger: 'change'};
Vue.prototype.vPhone = {validator: validatePlusPhone, trigger: 'change'};
Vue.prototype.vIdCard = {validator: validatePlusIdCard, trigger: 'change'};
Vue.prototype.vUpload = {validator: validateUpload, trigger: "change"};
Vue.prototype.requiredMsg = function (msg) {
  var map = this.copyObj(this.vRequired);
  if (msg) {
    map.message = msg;
  }
  return map;
}


Vue.prototype.validateMap = {
  "vPhone": {name: "手机号码验证", validate: {validator: validatePlusPhone, trigger: 'change'}},
  "vIdCard": {name: "身份证号码验证", validate: {validator: validatePlusIdCard, trigger: 'change'}},
}

