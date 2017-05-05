package com.lanccj.controller;

import com.jfinal.core.Controller;
import com.lanccj.model.Demo;

import java.util.List;

/**
 * Created by lanccj on 2017/5/5.
 */
public class IndexController extends Controller
{
    public void index(){
        render("index.jsp");
    }


}
