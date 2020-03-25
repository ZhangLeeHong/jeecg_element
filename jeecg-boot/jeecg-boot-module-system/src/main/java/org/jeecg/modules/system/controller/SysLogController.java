package org.jeecg.modules.system.controller;


import java.util.Arrays;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.util.oConvertUtils;
import org.jeecg.modules.system.entity.SysLog;
import org.jeecg.modules.system.entity.SysRole;
import org.jeecg.modules.system.service.ISysLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import lombok.extern.slf4j.Slf4j;

/**
 * 系统日志表
 */
@RestController
@RequestMapping("/sys/log")
@Slf4j
public class SysLogController {

    @Autowired
    private ISysLogService sysLogService;

    /**
     * 查询日志记录
     */
    @RequestMapping(value = "/list", method = RequestMethod.POST)
    public Result<IPage<SysLog>> queryPageList(@RequestBody JSONObject jsonObject) {
        JSONObject json = jsonObject.getJSONObject("queryParam");
        Result<IPage<SysLog>> result = new Result<>();
        QueryWrapper<SysLog> queryWrapper = QueryGenerator.initQueryWrapper(new SysLog(), (JSONObject) null);
        QueryGenerator.andEqual(queryWrapper, "log_type", "logType", json);
        JSONArray createTimeRange = json.getJSONArray("createTimeRange");
        if (createTimeRange != null && createTimeRange.size() > 0) {
            queryWrapper.ge("create_time", createTimeRange.get(0));
            queryWrapper.le("create_time", createTimeRange.get(1) + " 23:59:59");
        }
        QueryGenerator.getSort(queryWrapper, jsonObject);
        Page<SysLog> page = new Page<>(jsonObject.getInteger("pageNo"), jsonObject.getInteger("pageSize"));
        String keyWord = json.getString("keyWord");//日志关键词
        if (oConvertUtils.isNotEmpty(keyWord)) {
            queryWrapper.like("log_content", keyWord);
        }
        //TODO begin、end逻辑处理
        IPage<SysLog> pageList = sysLogService.page(page, queryWrapper);
        result.setSuccess(true);
        result.setResult(pageList);
        return result;
    }

    /**
     * @param id
     * @return
     * @功能：删除单个日志记录
     */
    @RequestMapping(value = "/delete", method = RequestMethod.DELETE)
    public Result<SysLog> delete(@RequestParam(name = "id", required = true) String id) {
        Result<SysLog> result = new Result<SysLog>();
        SysLog sysLog = sysLogService.getById(id);
        if (sysLog == null) {
            result.error500("未找到对应实体");
        } else {
            boolean ok = sysLogService.removeById(id);
            if (ok) {
                result.success("删除成功!");
            }
        }
        return result;
    }

    /**
     * @param ids
     * @return
     * @功能：批量，全部清空日志记录
     */
    @RequestMapping(value = "/deleteBatch", method = RequestMethod.DELETE)
    public Result<SysRole> deleteBatch(@RequestParam(name = "ids", required = true) String ids) {
        Result<SysRole> result = new Result<SysRole>();
        if (ids == null || "".equals(ids.trim())) {
            result.error500("参数不识别！");
        } else {
            if ("allclear".equals(ids)) {
                this.sysLogService.removeAll();
                result.success("清除成功!");
            }
            this.sysLogService.removeByIds(Arrays.asList(ids.split(",")));
            result.success("删除成功!");
        }
        return result;
    }


}
