import Vue from 'vue'

Vue.prototype.jsonToStr = function (jsonObj) {
    return JSON.stringify(jsonObj);
}
/**清除表单残留验证提示*/
Vue.prototype.resetFields = function (name) {
    if (this.$refs[name] !== undefined) {
        this.$refs[name].resetFields();//清除表单残留验证提示
    }
}
//短信倒计时
Vue.prototype.countDown = function (count) {
    var $this = this;
    this.$set(this, "waitTime", count);
    var interval = window.setInterval(function () {
        $this.$set($this, "waitTime", $this.waitTime - 1);
        if ($this.waitTime == 0) {
            $this.$set($this, "waitTime", $this.waitTime);
            window.clearInterval(interval);
        }
    }, 1000);
}
Vue.prototype.listJsonToMap = function (listJson, key) {
    var map = {};
    if (listJson != null) {
        listJson.forEach(function (o, i) {
            map[o[key]] = o;
        });
    }
    return map;
}
/**
 *  数组字符串连接
 * @param arrayList 数组对象
 * @param sep 转换后的分隔符
 * @param col 取值的字段，不填则返回全值
 * @returns {string}
 */
Vue.prototype.arrayJoinStr = function (arrayList, sep, col) {
    var ids = "0";
    arrayList.forEach(function (o, i) {
        if (col) {
            ids += sep + o[col];
        } else {
            ids += sep + o;
        }
    });
    if (ids.length <= 1) {
        ids = "";
    } else {
        ids += sep + "0";
    }
    return ids;
}
Vue.prototype.arrayJoinArray = function (arrayList, col) {
    var ids = new Array();
    arrayList.forEach(function (o, i) {
        ids.push(o[col]);

    });

    return ids;
}
Vue.prototype.base64Encode = function (str) {
    let Base64 = require('js-base64').Base64;
    var str = Base64.encode(str);
    return str;
}
Vue.prototype.base64Decode = function (str) {
    let Base64 = require('js-base64').Base64;
    var str = Base64.decode(str);
    return str;
}
Vue.prototype.listJsonToList = function (listJson, key) {
    var list = [];
    if (listJson != null && listJson != undefined) {
        listJson.forEach(function (o, i) {
            if (key == null) {
                list.push(o)
            } else {
                list.push(o[key]);
            }
        });
    }
    return list;
}
Vue.prototype.datetimeFormat = function (date, fmt) {
    date = new Date(date)
    var o = {
        "M+": date.getMonth() + 1,                 //月份
        "d+": date.getDate(),                    //日
        "h+": date.getHours(),                   //小时
        "m+": date.getMinutes(),                 //分
        "s+": date.getSeconds(),                 //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}
/**
 * 字符串转数组
 * @param str 字符串
 * @param sep 分隔符，默认逗号
 * @returns {Array}
 */
Vue.prototype.strToArray = function (str, sep) {
    if (sep == undefined) {
        sep = ",";
    }
    var ids = new Array();
    if (str != null && str != undefined) {
        str.split(sep).forEach(function (o, i) {
            o = o.trim();
            if (o.length > 0 && o != "0") {
                ids.push(o);
            }
        });
    }

    return ids;
}
/**
 * 字符串分隔数组转map
 * @param str 字符串
 * @param sep 分隔符，默认逗号
 * @returns {Array}
 */
Vue.prototype.strListToMap = function (str, sep) {
    if (sep == undefined) {
        sep = ",";
    }
    var map = {};
    if (str != null && str != undefined) {
        str.split(sep).forEach(function (o, i) {
            o = o.trim();
            if (o.length > 0 && o != "0") {
                // ids.push(o);
                map[o] = o;
            }
        });
    }
    return map;
}

Vue.prototype.listJsonToMapList = function (listJson, key) {
    var map = {};
    var $this = this;
    if (listJson != null && listJson != undefined) {
        listJson.forEach(function (o, i) {
            var kayVal = o[key];
            if (map[kayVal] == null) {
                map[kayVal] = [];
            }
            map[kayVal].push(o);
        });
    }
    return map;
}

Vue.prototype.compareArray = function (arr1, arr2) {
    if (arr1 == undefined) {
        arr1 = [];
    }
    if (arr2 == undefined) {
        arr2 = [];
    }
    let diff1 = arr2.filter(val => {
        return arr1.indexOf(val) == -1
    })
    if (diff1 != null && diff1.length > 0) {//为有错选
        return null;
    }
    let diff2 = arr1.filter(val => {//length为0为有全对 length大于0为有半对
        return arr2.indexOf(val) == -1
    });
    return diff2;
}
/**
 * 字符串转Int数组
 * @param str 字符串
 * @param sep 分隔符，默认逗号
 * @returns {Array}
 */
Vue.prototype.strToIntArray = function (str, sep) {
    if (sep == undefined) {
        sep = ",";
    }
    var ids = new Array();
    if (str != null && str != undefined) {
        str.split(sep).forEach(function (o, i) {
            o = o.trim();
            if (o.length > 0) {
                ids.push(o * 1);
            }
        });
    }

    return ids;
}
/**
 * 字符串转JSON数组，
 * @param str 字符串
 * @returns {Array} 默认空数组
 */
Vue.prototype.strToJsonArray = function (str) {
    if (str == undefined) {
        return new Array();
    } else {
        return JSON.parse(str);
    }
}
/**
 * Map取值连接
 * @param ids key值，逗号分隔
 * @param map map对象
 * @param sep 转换后的分隔符
 * @param col 取值的字段，不填则返回全值
 * @returns {string}
 */
Vue.prototype.mapJoin = function (ids, map, sep, col) {
    var vals = "";
    if (ids) {
        ids.split(",").forEach(function (o, i) {
            if (o.length > 0) {
                var obj = map[o];
                if (obj != undefined) {
                    if (col) {
                        vals += sep + obj[col];
                    } else {
                        vals += sep + obj;
                    }
                }
            }

        });
        if (vals != '') {
            vals = vals.substr(1);
        }
    }
    return vals;
}
/*生成UUID*/
Vue.prototype.getUuid = function () {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}
/**固定元素高度*/
Vue.prototype.getHeight = function (val) {/*固化行高*/
    val = val + 12;
    var switchTabBar = localStorage.getItem('switchTabBar') ? true : false;
    if (switchTabBar) {
        val = val + 40;
    }
    return "calc(100vh - " + val + "px)";
}
/**日期时间格式化函数*/
Vue.prototype.formatDate = function (date2, fmt) {
    var date = new Date(date2);
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
};
/**通用子组件返回值填充父组件*/
Vue.prototype.baseSetVal = function (vals) {
    if (vals.length == 1) {
        vals = vals[0];
    }
    var obj = this;
    for (var i = 0; i < vals.length - 2; i++) {
        obj = obj[vals[i]];
    }
    obj[vals[vals.length - 2]] = vals[vals.length - 1];
    //    this.$set(obj,vals[vals.length - 2],vals[vals.length - 1])
}
/**复制对象*/
Vue.prototype.copyObj = function (val) {
    return JSON.parse(JSON.stringify(val));
}
/**初始化vue页面的数据*/
Vue.prototype.initData = function () {
    Object.assign(this.$data, this.$options.data());
}
/**验证权限*/
Vue.prototype.btnDisabledValidate = function ($this) {
    var author = $this.parentData.author;
    var baseUrl = $this.parentData.baseUrl;
    console.log($this.parentData["author"])
    console.log(author[baseUrl + $this.method])
    if (author[baseUrl + $this.method] == true) {
        $this.btnDisabled = false;

    }
}

Vue.prototype.setLoginUser = function (data) {
    console.log(data)
    sessionStorage.setItem('loginSysUser', JSON.stringify(data))
}
Vue.prototype.getLoginUser = function () {
    return JSON.parse(sessionStorage.getItem('loginSysUser'))
}
Vue.prototype.setSysConfig = function (data) {
    sessionStorage.setItem('sysConfig', JSON.stringify(data))
}
Vue.prototype.getSysConfig = function () {

    if (sessionStorage.getItem('sysConfig') == undefined) {
        return {};
    }
    return JSON.parse(sessionStorage.getItem('sysConfig'))
}
Vue.prototype.setTitle = function (title) {
    window.document.title = title;
}
Vue.prototype.fixed = function (val) {
    var res = parseInt(val * 100) / 100;//保留两位、三位小数 同理
    return res;

}
Vue.prototype.amount2end = function (d) {
    try {
        var str = d.toFixed(2);
        return str.substring(str.indexOf("."));
    } catch (e) {
        return null;
    }
}
Vue.prototype.amount2begin = function (d) {
    try {
        var str = d.toFixed(2);
        return str.substring(0, str.indexOf("."));
    } catch (e) {
        return null;
    }
}
Vue.prototype.isNullStr = function (str) {
    if (str == null || str.trim().length == 0) {
        return false;
    }
    return true;
}
Vue.prototype.copyTxt = function (txt) {
    var input = document.createElement("input");     // 直接构建input
    input.value = txt;   // 设置内容
    document.body.appendChild(input);        // 添加临时实例
    input.select();      // 选择实例内容
    document.execCommand("Copy");     // 执行复制
    document.body.removeChild(input);  // 删除临时实例
    this.showMsgSuccess("复制成功");

}
/* hasValInArrayObj: function (arr,key,val) {
     for (let i = 0;i<arr.length;i++){
         if(arr[i][key] == val)
             return i;
     }
     return -1;
 }*/
Vue.prototype.toHtmlBr = function (str) {
    if (str == undefined) {
        return null;
    }
    console.log(str)
    var regs = new RegExp("\n", "g");
    //     var reg=new RegExp("\n", "g");
    var str1 = str.replace(regs, "<br/>")
    return str1;
}
Vue.prototype.callPhone = function (phoneNumber) {
    window.location.href = 'tel:' + phoneNumber
}