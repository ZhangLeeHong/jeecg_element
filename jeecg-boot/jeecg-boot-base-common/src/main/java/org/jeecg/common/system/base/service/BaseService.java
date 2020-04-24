package org.jeecg.common.system.base.service;


import com.alibaba.fastjson.JSONObject;
import org.jeecg.common.util.NumberTools;
import org.jeecg.common.util.StringTools;

public class BaseService {
    protected String sortField = "";
    protected String parentField = null;
    protected String tableName = "";

    public void dataSort(JSONObject oldObj, JSONObject newObj) {
        String sql = null;
        String parentWhere = "";
        if (!StringTools.isNullOrEmpty(parentField) && newObj != null) {
            String[] parentFieldList = parentField.split(",");
            for (String pf : parentFieldList) {
                parentWhere += " and " + pf + " =? ";
            }
        }
        if (!StringTools.isNullOrEmpty(sortField)) {
            if (oldObj == null && newObj != null) {
                sql = "update " + tableName + " set " + sortField + "=" + sortField + "+1 where " + sortField + ">=" + newObj.get(sortField) + " and id!=" + newObj.getLong("id");
            }
            if (oldObj != null && newObj != null) {
                Integer pastObjValue = NumberTools.toInt(oldObj.get(sortField), 0);
                Integer newObjValue = NumberTools.toInt(newObj.get(sortField), 0);
                if (pastObjValue != null && newObjValue != null) {
                    if (newObjValue > pastObjValue) {
                        sql = "update " + tableName + " set " + sortField + "=" + sortField + "-1 where " + sortField + ">=" + newObj.get(sortField) + " and id!=" + newObj.getLong("id");
                    } else {
                        sql = "update " + tableName + " set " + sortField + "=" + sortField + "+1 where " + sortField + ">=" + newObj.get(sortField) + " and id!=" + newObj.getLong("id");
                    }
                }
            }
            if (!StringTools.isNullOrEmpty(sql)) {

            }
            sql = "select id from " + tableName + " o where 1=1 " + parentWhere + "   order by " + sortField + " asc";
        }

    }


}
