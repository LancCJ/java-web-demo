package com.lanccj.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.lanccj.model.Demo;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import com.jfinal.plugin.activerecord.Model;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 * Created by lanccj on 2017/5/7.
 */
public class PoiUtil {

    private static int sheetSize = 4000;

    private final static String excel2003L = ".xls"; // 2003- 版本的excel
    private final static String excel2007U = ".xlsx"; // 2007+ 版本的excel

    public PoiUtil() {
    }

    /**
     * 描述：根据文件后缀，自适应上传文件的版本
     *
     * @param inStr,fileName
     * @return
     * @throws Exception
     */
    public static Workbook getWorkbook(InputStream inStr, String fileName) throws Exception {
        Workbook wb = null;
        String fileType = fileName.substring(fileName.lastIndexOf("."));
        if (excel2003L.equals(fileType)) {
            wb = new HSSFWorkbook(inStr); // 2003-
        } else if (excel2007U.equals(fileType)) {
            wb = new XSSFWorkbook(inStr); // 2007+
        } else {
            throw new Exception("解析的文件格式有误！");
        }
        return wb;
    }

    public static Sheet getSheet(File file, int sheetNo) throws Exception {
        if (!file.exists()) {
            throw new Exception("文件不存在！");
        }

        InputStream in = new FileInputStream(file);
        Workbook workbook = getWorkbook(in, file.getName());
        return workbook.getSheetAt(sheetNo);
    }

    public static List<Map<Integer, String>> getData(Sheet sheet, int offsetRow) {
        List<Map<Integer, String>> list = null;
        int total = sheet.getLastRowNum() + 1;
        if (total > 1) {
            list = new ArrayList<Map<Integer, String>>();
            for (int i = offsetRow; i < total; i++) {
                System.out.println(i);
                Row row = sheet.getRow(i);
                int cells = row.getLastCellNum();

                Map<Integer, String> map = new HashMap<Integer, String>();
                for (int j = 0; j < cells; j++) {
                    map.put(j, row.getCell(j) != null ? row.getCell(j).getStringCellValue() : "");
                }
                list.add(map);
            }
        }
        return list;
    }

    public static List<Map<Integer, String>> parseExcel(File file, int sheetNo, int offsetRow) throws Exception {
        Sheet sheet = getSheet(file, sheetNo);
        return getData(sheet, offsetRow);
    }

    public static void buildTitle(HSSFSheet sheet, List<String> titleValue) {
        HSSFRow row = sheet.createRow(0);
        HSSFCell cell = null;
        for (int i = 0; i < titleValue.size(); i++) {
            cell = row.createCell(i, CellType.STRING);
            cell.setCellValue(titleValue.get(i));
        }
    }

    public static HSSFWorkbook buildXlsExcel(Map map) {

        String columns = (String) map.get("columns");

        List<String> titleKey = new ArrayList<String>();
        List<String> titleValue = new ArrayList<String>();
        JSONArray json = JSONArray.fromObject(columns);
        Object o = JSONArray.toArray(json, Demo.class);
        for (int i = 0; i < json.size(); i++) {
            JSONObject obj = json.getJSONObject(i);
            String key = (String) obj.get("field");
            if (StringUtils.isNotEmpty(key) && !key.equals("state")) {
                Boolean visible = (Boolean) obj.get("visible");
                if (visible == null || visible) {
                    titleKey.add(key);
                    titleValue.add((String) obj.get("title"));
                }
            }
        }

        List list = (List) map.get("dataList");
        int listNum = Integer.parseInt(map.get("dataNum").toString());

        HSSFWorkbook workbook = null;
        HSSFSheet sheet = null;
        HSSFRow row = null;
        HSSFCell cell = null;

        if (list != null && list.size() > 0) {

            // 已4000行为一个sheet,判断有多少sheet
            int sheetNum = listNum % sheetSize == 0 ? listNum / sheetSize : listNum / sheetSize + 1;
            for (int i = 0; i < sheetNum; i++) {
                workbook = new HSSFWorkbook();
                sheet = workbook.createSheet();

                // 创建第一行标题行
                buildTitle(sheet, titleValue);

                // 插入数据行
                for (int j = i * sheetSize; j < (listNum <= (i + 1) * sheetSize ? listNum : (i + 1) * sheetSize); j++) {
                    Model m = (Model) list.get(j);
                    row = sheet.createRow(j + 1);

                    int colsNum = titleKey.size();
                    for (int l = 0; l < colsNum; l++) {
                        cell = row.createCell(l, CellType.STRING);
                        cell.setCellValue(String.valueOf(m.get(titleKey.get(l))));
                    }
                }
            }
        }

        return workbook;

    }

}
