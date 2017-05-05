package com.lanccj.util;

/**
 * Created by lanccj on 2017/5/5.
 */

import java.util.HashMap;
import java.util.Map;
import org.codehaus.jackson.map.ObjectMapper;
import com.alibaba.fastjson.JSON;
import com.jfinal.plugin.activerecord.Page;

public class ExecuteResult {

    public String jsonReturn(int statusCode) {
        Map<String, Object> jsonObj = new HashMap<String, Object>();
        if(statusCode == 200) {
            jsonObj.put("statusCode", "200");
            jsonObj.put("message", "操作成功");
        } else if (statusCode == 300) {
            jsonObj.put("statusCode", "300");
            jsonObj.put("message", "操作失败，请重试");
        }
        jsonObj.put("closeCurrent", true);
        try {
            return new ObjectMapper().writeValueAsString(jsonObj);
        } catch (Exception e) {
            e.printStackTrace();
            return getFinallyJson(e.getMessage());
        }
    }

    public String jsonReturnMsg(int statusCode, boolean closeCurrent,String msg) {
        Map<String, Object> jsonObj = new HashMap<String, Object>();
        if(statusCode == 200) {
            jsonObj.put("statusCode", "200");
        } else if (statusCode == 300) {
            jsonObj.put("statusCode", "300");
        }
        jsonObj.put("message", msg);
        jsonObj.put("closeCurrent", closeCurrent);
        try {
            return new ObjectMapper().writeValueAsString(jsonObj);
        } catch (Exception e) {
            e.printStackTrace();
            return getFinallyJson(e.getMessage());
        }
    }

    public String jsonReturn(int statusCode, boolean closeCurrent) {
        Map<String, Object> jsonObj = new HashMap<String, Object>();
        if(statusCode == 200) {
            jsonObj.put("statusCode", "200");
            jsonObj.put("message", "操作成功");
        } else if (statusCode == 300) {
            jsonObj.put("statusCode", "300");
            jsonObj.put("message", "操作失败，请重试");
        }
        jsonObj.put("closeCurrent", closeCurrent);
        try {
            return new ObjectMapper().writeValueAsString(jsonObj);
        } catch (Exception e) {
            e.printStackTrace();
            return getFinallyJson(e.getMessage());
        }
    }

    private String getFinallyJson(String errorMsg) {
        return "{\"statusCode\":\"300\",\"message\":\""+errorMsg+"\",\"closeCurrent\":\"false\"}";
    }

    public String jsonReturn(int statusCode, String msg) {
        Map<String, Object> jsonObj = new HashMap<String, Object>();
        if(statusCode == 200) {
            jsonObj.put("statusCode", "200");
            jsonObj.put("message", "操作成功 " + msg);
        } else if (statusCode == 300) {
            jsonObj.put("statusCode", "300");
            jsonObj.put("message", "操作失败:" + msg);
        }
        jsonObj.put("closeCurrent", true);
        try {
            return new ObjectMapper().writeValueAsString(jsonObj);
        } catch (Exception e) {
            e.printStackTrace();
            return getFinallyJson(e.getMessage());
        }
    }

    /**
     * 将msg类型转换为 Object这样就能传对象格式的JSON了
     * @param statusCode
     * @param msg
     * @param closeCurrent
     * @return
     */
    public String jsonReturn(int statusCode, Object msg, boolean closeCurrent) {
        Map<String, Object> jsonObj = new HashMap<String, Object>();
        if(statusCode == 200) {
            jsonObj.put("statusCode", "200");
            jsonObj.put("message", "操作成功 " + msg);
        } else if (statusCode == 300) {
            jsonObj.put("statusCode", "300");
            jsonObj.put("message", "操作失败:" + msg);
        }else if (statusCode == 201) {
            jsonObj.put("statusCode", "200");
            jsonObj.put("data",msg);
        }else if (statusCode == 202) {
            jsonObj.put("statusCode", "200");
            jsonObj.put("value",msg);
        }
        jsonObj.put("closeCurrent", closeCurrent);
        try {
            return new ObjectMapper().writeValueAsString(jsonObj);
        } catch (Exception e) {
            e.printStackTrace();
            return getFinallyJson(e.getMessage());
        }
    }

    /**Page对象转换成datagrid适用的格式
     * 将 P
     * @param page
     * @return
     */
    public String jsonReturn(Page page){
        return null;
    }

}

