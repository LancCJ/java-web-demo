package com.lanccj.controller;

import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Page;
import com.lanccj.model.Demo;
import com.lanccj.util.ExecuteResult;

/**
 * Created by lanccj on 2017/5/5.
 */
public class BootstrapController extends Controller {
    private ExecuteResult executeResult = new ExecuteResult();

    public void table(){
        render("table.jsp");
    }

    public void data(){
        Page<Demo> page=Demo.dao.paginate(getParaToInt("pageCurrent", 1), getParaToInt("pageSize",10)," select *  "," from demo ");
        renderJson(page);
    }
}
