<!DOCTYPE html>
<html lang="zh-CN">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- 上述3个meta标签*必须*放在最前面，任何其他内容都*必须*跟随其后！ -->
        <title>Bootstrap Table 数据及数据导出DEMO</title>

        <!-- Bootstrap -->
        <link href="/static/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet">

        <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
        <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
        <!--[if lt IE 9]>
        <script src="https://cdn.bootcss.com/html5shiv/3.7.3/html5shiv.min.js"></script>
        <script src="https://cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
        <![endif]-->


        <!--bootstrap table css -->
        <link href="/static/plugins/bootstrap-table/bootstrap-table.css" rel="stylesheet">
    </head>
    <body>

        <div class="panel panel-primary">
            <!-- Default panel contents -->
            <div class="panel-heading">Bootstrap Table分页数据请求加服务器端分页导出全部数据</div>
            <div class="panel-body">
                <!-- Table -->
                <table id="table">
                </table>
            </div>
        </div>



        <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
        <script src="https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js"></script>
        <!-- Include all compiled plugins (below), or include individual files as needed -->
        <script src="/static/plugins/bootstrap/js/bootstrap.min.js"></script>

        <!--引入bootstrap table js-->
        <script src="/static/plugins/bootstrap-table/bootstrap-table.js" type="application/javascript"></script>
        <script src="/static/plugins/bootstrap-table/locale/bootstrap-table-zh-CN.js"></script>
        <!--引入bootstrap table export-->
        <script src="/static/plugins/bootstrap-table/extensions/export/bootstrap-table-export.js"
                type="application/javascript"></script>
        <script src="/static/plugins/bootstrap-table-export/tableExport.js" type="application/javascript"></script>
        <script src="/static/plugins/bootstrap-table-export/libs/FileSaver/FileSaver.min.js"
                type="application/javascript"></script>
        <!--excel还需这个看excel版本引入2007+以上需要-->
        <script src="/static/plugins/bootstrap-table-export/libs/js-xlsx/xlsx.core.min.js"
                type="application/javascript"></script>

        <script>
            $(function(){
                $('#table').bootstrapTable({
                    url: '/bootstrap/data',
                    dataType:'json',
                    method:'get',
                    striped:true,
                    pagination:true,
                    sidePagination:'server',
                    queryParamsType:'undefined',//设置不同的类型获取的参数就不同
                    queryParams:function(params){
                        var param={
                            pageCurrent:params.pageNumber,
                            pageSize:params.pageSize
                        }
                        return param;
                    },
                    pageNumber: 1,                       //初始化加载第一页，默认第一页
                    pageSize: 10,                       //每页的记录行数
                    pageList: [10, 25, 50,'全部数据'],        //可供选择的每页的行数
                    strictSearch: true,
                    showExport:true,
                    exportDataType:'all',
                    exportOptions:{
                        fileName:'导出EXCEL名'
                    },
                    showRefresh: true,                  //是否显示刷新按钮
                    clickToSelect: true,                //是否启用点击选中行
                    uniqueId: "id",                     //每一行的唯一标识，一般为主键列
                    responseHandler:function(res){
                        return {
                            "total":res.totalRow,//总数
                            "rows":res.list//数据数据
                        }
                    },
                    columns: [
                        {
                            field: 'id',
                            title: 'id'
                        },
                        {
                            field: 'col1',
                            title: 'col1'
                        },
                        {
                            field: 'col2',
                            title: 'col2'
                        },
                        {
                            field: 'col3',
                            title: 'col3'
                        }
                    ]
                });
            });
        </script>
    </body>
</html>

