import Vue from 'vue'

Vue.prototype.isNullArray = function (arrayList) {
  if (arrayList == null || arrayList.length == 0) {
    return true;
  }
  return false;
}
Vue.prototype.jsHeight = function (val) {/*固化行高*/
  var val2 = this.tHeight;
  this.$set(this, "tHeight", val);
  var $this = this;
  setTimeout(function () {
    $this.$set($this, "tHeight", val2);
  }, 500);
}
Vue.prototype.printDiv = function (key) {
  this.printOpen = true;
  var newstr = document.getElementById(key).innerHTML;
  this.printHtml = newstr;
  var $this = this;
  setTimeout(function () {
    window.print();
    $this.printOpen = false;
  }, 100)
}
Vue.prototype.numberCn = function (num) {
  if (num > 10000) {
    return (num / 10000).toFixed(2) + "万";
  } else if (num > 10000 * 10000) {
    return (num / 100000000).toFixed(2) + "亿";
  }
  return num.toFixed(2);
}
/**清除表单残留验证提示*/
Vue.prototype.resetFieldsBase = function (name) {
  if (this.$refs[name] !== undefined) {
    this.$refs[name].resetFields();//清除表单残留验证提示
  }
}
/**删除*/
Vue.prototype.delArrItem = function (arr, item) {
  arr.forEach((o, i) => {
    if (o == item) {
      arr.splice(i, 1);
      return;
    }
  })
}
/**
 *  数组字符串连接
 * @param arrayList 数组对象
 * @param sep 转换后的分隔符
 * @param col 取值的字段，不填则返回全值
 * @returns {string}
 */
Vue.prototype.mapLength = function (map) {
  var length = 0;
  for (var k in map) {
    length += 1;
  }
  return length;
}
Vue.prototype.exportxXlsx = function (filename, filterList, headList, dataList) {
  var formatJson = function (filterVal, jsonData) {
    return jsonData.map(v => filterVal.map(j => v[j]))
  }
  var dataListTemp = (formatJson(filterList, dataList));
  dataListTemp.unshift(headList);
  const ws = this.xlsx.utils.aoa_to_sheet(dataListTemp)
  //	 ws['!cols'] = wscols
  const wb = this.xlsx.utils.book_new()
  this.xlsx.utils.book_append_sheet(wb, ws, filename)
  this.xlsx.writeFile(wb, filename + ".xls")
}

Vue.prototype.isPc = function () {

  var userAgentInfo = navigator.userAgent;
  var Agents = ["" +
  "", "iPhone",
    "SymbianOS", "Windows Phone",
    "iPad", "iPod"];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;

}
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
Vue.prototype.toHtmlBr = function (str) {
  if (str == undefined) {
    return null;
  }
  //console.log(str)
  var regs = new RegExp("\n", "g");
  //     var reg=new RegExp("\n", "g");
  var str1 = str.replace(regs, "<br/>")
  return str1;
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
Vue.prototype.jsonToList = function (json, key) {
  var list = [];
  if (json != null && json != undefined) {
    for (var k in json) {
      if (key == null) {
        list.push(k)
      } else {
        list.push(json[k][key])
      }
    }

  }
  return list;
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
Vue.prototype.listJsonToMap = function (listJson, key) {
  var map = {};

  if (listJson != null && listJson != undefined) {
    listJson.forEach(function (o, i) {
      if (key == null) {
        map[o] = o;
      } else {
        map[o[key]] = o;
      }
    });
  }
  return map;
}
Vue.prototype.listToMap = function (list) {
  var map = {};

  if (list != null && list != undefined) {
    list.forEach(function (o, i) {
      map[o] = o;
    });
  }
  return map;
}
Vue.prototype.mapToList = function (map) {
  var list = [];
  for (var key in map) {
    list.push(map[key])
  }
  return list;
};

Vue.prototype.mapKeyToList = function (map) {
  var list = [];
  for (var key in map) {
    list.push(key)
  }
  return list;
};

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
  try {
    if (str instanceof Array) {
      return str;
    }
    if (!this.isNullStr(str)) {
      return new Array();
    } else {
      //console.log(str)
      return JSON.parse(str);
    }
  } catch (e) {
    //alert(JSON.stringify(str))
    console.log(e, str);
    return new Array();
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
  if (!this.isPc()) {
    val = val + 185;
  } else {
    val = val + 30;
  }
  return "calc(100vh - " + val + "px)";
}
/**日期时间格式化函数*/
Vue.prototype.formatDate = function (date, fmt) {

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
  this.$set(obj, vals[vals.length - 2], vals[vals.length - 1]);
  console.log(obj)
  try {
    this.$refs[vals[0]].validateField(vals[vals.length - 2]);
  } catch (e) {

  }
}
/**复制对象*/
Vue.prototype.copyObj = function (val) {
  return JSON.parse(JSON.stringify(val));
}
Vue.prototype.copyArray = function (arr) {
  var i, length = arr.length,
    copy = new Array(length);

  for (i = 0; i < length; i++) {
    copy[i] = arr[i];
  }
  return copy;
},
  /**初始化参数*/

  Vue.prototype.isNullStr = function (str) {
    if (str == null || str == undefined || str.trim().length == 0) {
      return false;
    }
    return true;
  }
Vue.prototype.initPara2 = function (obj, key, defaultVal) {
  if (obj.id == undefined) {
    this.$set(obj, key, defaultVal);
  }
}
Vue.prototype.initPara = function (key, defaultVal, compel) {
  if (this.obj.id == undefined || (this.obj[key] == null && compel == true)) {
    this.$set(this.obj, key, defaultVal);
  }
}
/**初始化vue页面的数据*/
Vue.prototype.initData = function () {
  Object.assign(this.$data, this.$options.data());
}
/**验证权限*/
Vue.prototype.btnDisabledValidate = function ($this) {
  var author = $this.parentData.author;
  var baseUrl = $this.parentData.baseUrl;
  // //console.log($this.parentData["author"])
  // //console.log(author[baseUrl + $this.method])
  if (author[baseUrl + $this.method] == true) {
    $this.btnDisabled = false;

  }
}

Vue.prototype.jsonToStr = function (json) {
  return JSON.stringify(json)
}
Vue.prototype.strToJson = function (str) {
  return JSON.parse(str)
}

Vue.prototype.setSysConfig = function (data) {
  this.setSession('sysConfig', data)
}
Vue.prototype.getSysConfig = function () {
  return this.getSession('sysConfig');
}

Vue.prototype.setTitle = function (title) {
  window.document.title = title;
}
Vue.prototype.delTabMenu = function (path) {
  this.setSession("delTabMenu", path)
}
Vue.prototype.getDelTabMenu = function () {
  var delTabMenu = this.getSession("delTabMenu");
  return delTabMenu;
}


Vue.prototype.setSession = function (key, jsonData) {
  try {
    localStorage.setItem(key, JSON.stringify(jsonData));
  } catch (oException) {
    // if(oException.name == 'QuotaExceededError'){
    //     //console.log('超出本地存储限额！');
    alert("超出本地存储限额,请重新登录")
    //如果历史信息不重要了，可清空后再设置
    localStorage.clear();
    // localStorage.setItem(key,value);
    // }
  }
}
Vue.prototype.getSession = function (key) {
  return JSON.parse(localStorage.getItem(key))
}
Vue.prototype.setLoginUser = function (data) {
  this.setSession('loginSysUser', data);
}
Vue.prototype.getLoginUser = function () {
  return this.getSession("loginSysUser");
}

Vue.prototype.setTagData = function (key, obj) {
  if (key == null) {
    return null;
  }
  this.setSession('tagData' + key, obj)
}
Vue.prototype.saveTagData = function (to) {
  // //console.log("保存", to.fullPath)
  this.setTagData(to.fullPath, this.$data)
}

Vue.prototype.getTagData = function (key, str) {
  if (key == null) {
    return null;
  }
  var data = this.getSession('tagData' + key);
  if (data == null) {
    return null;
  }
  // //console.log("查询1", key)
  return this.getSession('tagData' + key)
}
// Vue.prototype.tagsMenuList = [];
// Vue.prototype.removeTabMenu=function(targetName) {
//   alert(targetName)
//   const curItem = this.tagsMenuList.filter(item => {
//     if (item.path == targetName) {
//       this.removeTagData(item.path)
//       return false;
//     }
//     return true;
//   })
//   this.tagsMenuList = curItem;
//   this.$router.push(curItem[curItem.length - 1].path)
// },
Vue.prototype.removeTagData = function (key) {
  //console.log("删除1", key)
  localStorage.removeItem('tagData' + key)
}
Vue.prototype.findTagData = function (to) {

  if (this.fullPath == to.fullPath) {
    return;
  }
  var $this = this;
  // Object.assign(this.$data, this.$options.data())
  var $dataJson = this.getTagData(to.fullPath);
  if ($dataJson == null) {

    for (var key in this.$data) {
      // alert(key)
    }
    return;
  }

  // //console.log("查询2", to.fullPath)
  for (var key in $dataJson) {
    // if (key == 'rules') {
    //     //console.log(this[key])
    //     //console.log($dataJson[key])
    // }
    try {
      this.$set(this, key, $dataJson[key]);
    } catch (e) {

    }
  }

  setTimeout(function () {
    // // $this.resetFieldsBase("obj");
    if ($this.$refs["obj"] != undefined) {
      $this.$refs["obj"].clearValidate();
    }
    try {
      $this.getRules();
    } catch (e) {

    }
  }, 50)

  // this.$refs.obj.resetFields();
}

Vue.prototype.datetimeFormat = function (date, fmt) {
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
Vue.prototype.routeTagData = function (to, from, vueUrl) {
  // //console.log("to", to.fullPath)
  // //console.log("toData", this.getTagData(to.fullPath));
  var $this = this;


  if (this.$route.path == vueUrl) {
    if (this.$route.fullPath == to.fullPath && this.getTagData(to.fullPath) != null) {
      this.findTagData(this.$route);
    } else if (this.$route.path == vueUrl) {
      this.initTagData();
    }
    this.fullPath = this.$route.fullPath;
    if (this.taskStatusVisible != null) {
      setTimeout(function () {
        $this.taskStatusVisible = true;
      }, 500)
    }
  }


}

/**
 * 表单验证错误，滚动到错误位置
 * @param refs  表单的ref
 * @param noFieldList 表单验证失败的字段来源：this.$refs["obj"].validate((valid, noFieldList)
 */
Vue.prototype.validScroll = function (refs, noFieldList) {
  var dom = null;
  for (let i in noFieldList) {
    if (dom != null) {
      break;
    }
    var fields = this.$refs[refs].fields
    fields.forEach(f => {
      if (dom == null && i == f._props.prop) {
        dom = f;
      }
    })
  }
  if (dom != null) {
    dom.$el.scrollIntoView({　　//滚动到指定节点
      block: 'center',　　　　　//值有start,center,end，nearest，当前显示在视图区域中间
      behavior: 'smooth'　　　　//值有auto、instant,smooth，缓动动画（当前是慢速的）
    })
  } else {
    console.error("prop不存在，无法滚动定位！");
  }
}

/* hasValInArrayObj: function (arr,key,val) {
     for (let i = 0;i<arr.length;i++){
         if(arr[i][key] == val)
             return i;
     }
     return -1;
 }*/
