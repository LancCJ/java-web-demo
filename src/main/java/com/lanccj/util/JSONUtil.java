package com.lanccj.util;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;

/**
 *处理JSON工具类
 * @author LancCJ
 *
 */
public class JSONUtil {

	
	/**
	 * 将查询结果转换为bootstrap table 接收格式json
	 */
	public static JSONObject convert2TableJson(Page obj){
		if(obj.getList().size()>0){
			if(obj.getList().get(0) instanceof Record){
				JSONArray Jarray=new JSONArray();
				for (int i = 0; i < obj.getList().size(); i++) {
					Record record=(Record)obj.getList().get(i);
					Map<String,Object> columnsMap=record.getColumns();
					Jarray.add(columnsMap);
				}
				JSONObject jObj=new JSONObject();
				jObj.put("total", obj.getTotalRow());
				jObj.put("rows", Jarray);
				return jObj;
			}
		}else{
			JSONObject jObj=new JSONObject();
			jObj.put("total", 0);
			jObj.put("rows",new JSONArray());
			return jObj;
		}
		return null;
	}
	
	
	/**
	 * 将结果转换为suggest js插件接受的JSON
	 * @param obj
	 * @return
	 */
	public static JSONArray convert2SuggestJson(List obj){
		JSONArray Jarray=new JSONArray();
		if(obj.size()>0){
			if(obj.get(0) instanceof Record){
				for (int i = 0; i < obj.size(); i++) {
					Record record=(Record)obj.get(i);
					Map<String,Object> columnsMap=record.getColumns();
					Jarray.add(columnsMap);
				}
			}
		}
		return Jarray;
	}
}
