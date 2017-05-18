/**
 * Bootstrap Depart  
 * @desc    bootstrap式机构选择插件  需要使用Bootstrap-Treeview
 * @author  LanCCJ
 * @github  
 * @since   2017年5月2日
 *===============================================================================
 ********************************************************************************/
(function (factory) {
    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object' && typeof module === 'object') {
        factory(require('jquery'));
    } else if (window.jQuery) {
        factory(window.jQuery);
    } else {
        throw new Error('Not found jQuery.');
    }
})(function($) {
    var $window = $(window);
    var isIe = 'ActiveXObject' in window; // 用于对 IE 的兼容判断
    var inputLock; // 用于中文输入法输入时锁定搜索

    // ie 下和 chrome 51 以上浏览器版本，出现滚动条时不计算 padding
    var notNeedCalcPadding;
    var chromeVer = navigator.userAgent.match(/Chrome\/(\d+)/);
    if (chromeVer) {
        chromeVer = Number(chromeVer[1]);
    }
    notNeedCalcPadding = isIe || chromeVer > 51;

    /**
     * 错误处理
     */
    function handleError(e1, e2) {
        if (!window.console || !window.console.trace) {
            return;
        }
        console.trace(e1);
        if (e2) {
            console.trace(e2);
        }
    }
    
    /**
     * 设置输入框背景色
     * 当设置了 indexId，而输入框的 data-id 为空时，输入框加载警告色
     */
    function setBackground($input, options) {
        var inputbg, bg, warnbg;

        if ((options.indexId === -1 && !options.idField) || options.multiWord) {
            return $input;
        }

        inputbg = $input.css('background-color').replace(/ /g, '').split(',', 3).join(',');
        // console.log(inputbg);
        bg = options.inputBgColor || 'rgba(255,255,255,0.1)';
        warnbg = options.inputWarnColor || 'rgba(255,255,0,0.1)';

        if ($input.attr('data-id') || !$input.val()) {
            return $input.css('background', bg);
        }

        // 自由输入的内容，设置背景色
        if (!~warnbg.indexOf(inputbg)) {
            $input.trigger('onUnsetSelectValue') // 触发取消data-id事件
                .css('background', warnbg);
        }

        return $input;
    }
    
    /**
     * 调整选择菜单位置
     * @param {Object} $input
     * @param {Object} $dropdownMenu
     * @param {Object} options
     */
    function adjustDropMenuPos($input, $dropdownMenu, options) {
    	
        if (!$dropdownMenu.is(':visible')) {
            return;
        }

        if (options.autoDropup) {
            setTimeout(function() {
                var $inputGroup = $dropdownMenu.parents('.input-group');

                if ( // 自动判断菜单向上展开
                    ($window.height() + $window.scrollTop() - $input.offset().top) < $dropdownMenu.height() && // 假如向下会撑长页面
                    $input.offset().top > ($dropdownMenu.height() + $window.scrollTop()) // 而且向上不会撑到顶部
                ) {
                    $inputGroup.addClass('dropup');
                } else {
                    $inputGroup.removeClass('dropup');
                }
            }, 10);
        }

        // 列表对齐方式
        var dmcss = {};
        if (options.listAlign === 'left') {
            dmcss = {
                'left': $input.siblings('div').width() - $input.parent().width(),
                'right': 'auto'
            };
        } else if (options.listAlign === 'right') {
            dmcss = {
                'left': 'auto',
                'right': 0
            };
        }

        // ie 下，不显示按钮时的 top/bottom
        if (isIe && !options.showBtn) {
            if (!$dropdownMenu.parents('.input-group').hasClass('dropup')) {
                dmcss.top = $input.parent().height();
                dmcss.bottom = 'auto';
            } else {
                dmcss.top = 'auto';
                dmcss.bottom = $input.parent().height();
            }
        }

        // 是否自动最小宽度
        if (!options.autoMinWidth) {
            dmcss['min-width'] = $input.parent().width();
        }
        /* else {
            dmcss['width'] = 'auto';
        }*/

        $dropdownMenu.css(dmcss);

        return $input;
    }
    
    /**
     * 数据格式检测
     * 检测 ajax 返回成功数据或 data 参数数据是否有效
     * data 格式：{"value": [{}, {}...]}
     */
    function checkData(data) {
        var isEmpty = true, o;

        for (o in data) {
            if (o === 'data') {
                isEmpty = false;
                break;
            }
        }
        if (isEmpty) {
            handleError('返回数据格式错误!');
            return false;
        }
        if (!data.data.length) {
            // handleError('返回数据为空!');
            return false;
        }

        return data;
    }
        
    /**
     * 下拉列表刷新
     * 作为 fnGetData 的 callback 函数调用
     */
    function refreshDropMenu($input, data, options) {
        var $dropdownMenu = $input.parent().find('ul.dropdown-menu'),
            len, i, j, index = 0,
            tds,
            html = ['<div id=\"depart\" class=\"test\"></div>'],
            idValue, keyValue; // 作为输入框 data-id 和内容的字段值

        if (!data || !(len = data.data.length)) {
            $dropdownMenu.empty().hide();
            return $input;
        }

        var dataList = $.parseJSON(data.data);

        // 相同数据，不用继续渲染了
        if (
            options._lastData &&
            JSON.stringify(options._lastData) === JSON.stringify(dataList) 
        ) {
            $dropdownMenu.show();
            adjustDropMenuPos($input, $dropdownMenu, options);
            return $input;
        }
        options._lastData = dataList;
        
        //alert(dataList);
        
        $dropdownMenu.html(html.join('')).show();
        
        $('#depart').treeview(
				{
					levels:1,
					showBorder : false,
					data : dataList,//这里需要对象而不是字符串
					onNodeSelected : function(event, node) {
						console.log('点击事件');
						//TODO 
						//这里选中机构需要把选中的传递出去
						//$('#id').val(node.id);
						//$('#code').val(node.code);
						//$('#name').val(node.text);
						//$('#parent_id').val(node.parent_id);
					}
				});

        adjustDropMenuPos($input, $dropdownMenu, options);

        return $input;
    }
    /**
     * ajax 获取数据
     * @param  {Object} options
     * @return {Object}         $.Deferred
     */
    function ajax(options, keyword) {
        keyword = keyword || '';

        var ajaxParam = {
            type: 'GET',
            dataType: options.jsonp ? 'jsonp' : 'json',
            timeout: 5000
        };

        // jsonp
        if (options.jsonp) {
            ajaxParam.jsonp = options.jsonp;
        }

        // 自定义 ajax 请求参数生成方法
        if ($.isFunction(options.fnAdjustAjaxParam)) {
            ajaxParam = $.extend(ajaxParam, options.fnAdjustAjaxParam(keyword, options));
        }

        // url 调整
        ajaxParam.url = function() {
            if (! keyword || ajaxParam.data) {
                return ajaxParam.url || options.url;
            }

            var type = '?';
            if (/=$/.test(options.url)) {
                type = '';
            } else if (/\?/.test(options.url)) {
                type = '&';
            }

            return options.url + type + keyword;
        }();

        return $.ajax(ajaxParam).done(function(result) {
            options.data = options.fnProcessData(result);
        }).fail(handleError);
    }
    
    /**
     * 通过 ajax 或 json 参数获取数据
     */
    function getData(keyword, $input, callback, options) {
        var data, validData, filterData = {
                value: []
            },
            i, key, len;

        keyword = keyword || '';
        // 获取数据前对关键字预处理方法
        if ($.isFunction(options.fnPreprocessKeyword)) {
            keyword = options.fnPreprocessKeyword(keyword, options);
        }

        // 给了url参数，则从服务器 ajax 请求
        // console.log(options.url + keyword);
        if (options.url) {
            ajax(options, keyword).done(function(result) {
                callback($input, options.data, options); // 为 refreshDropMenu
                $input.trigger('onDataRequestSuccess', result);
                if (options.getDataMethod === 'firstByUrl') {
                    options.url = null;
                }
            });
        } else {
            // 没有给出 url 参数，则从 data 参数获取
            data = options.data;
            validData = checkData(data);
            // 本地的 data 数据，则在本地过滤
            if (validData) {
                if (!keyword) {
                    filterData = data;
                } else {
                    // 输入不为空时则进行匹配
                    
                }
            }

            callback($input, filterData, options);
        } // else
    }
    /**
     * 数据处理
     * url 获取数据时，对数据的处理，作为 fnGetData 之后的回调处理
     */
    function processData(data) {
        return checkData(data);
    }
    
    
    /**
     * 取得 clearable 清除按钮
     */
    function getIClear($input, options) {
        var $iClear = $input.prev('i.clearable');

        // 是否可清除已输入的内容(添加清除按钮)
        if (options.clearable && !$iClear.length) {
                $iClear = $('<i class="clearable glyphicon glyphicon-remove"></i>')
                    .prependTo($input.parent());
        }

        return $iClear.css({
            position: 'absolute',
            top: 12,
            right: options.showBtn ? ($input.next('.input-group-btn').width() || 33) + 2 : 12,
            zIndex: 4,
            cursor: 'pointer',
            fontSize: 12
        }).hide();
    }
    
    /**
     * 默认的配置选项
     * @type {Object}
     */
    var defaultOptions = {
        url: null,                      // 请求数据的 URL 地址
        jsonp: null,                    // 设置此参数名，将开启jsonp功能，否则使用json数据结构
        data: {
            value: []
        },
        /* UI */
        autoDropup: false,              // 选择菜单是否自动判断向上展开。设为 true，则当下拉菜单高度超过窗体，且向上方向不会被窗体覆盖，则选择菜单向上弹出
        autoMinWidth: false,            // 是否自动最小宽度，设为 false 则最小宽度不小于输入框宽度
        showBtn: true,                  // 是否显示下拉按钮
        inputBgColor: '',               // 输入框背景色，当与容器背景色不同时，可能需要该项的配置
        inputWarnColor: 'rgba(255,0,0,.1)', // 输入框内容不是下拉列表选择时的警告色
        listStyle: {
            'padding-top': 0,
            'max-height': '375px',
            'max-width': '800px',
            'overflow': 'auto',
            'width': 'auto',
            'transition': '0.3s',
            '-webkit-transition': '0.3s',
            '-moz-transition': '0.3s',
            '-o-transition': '0.3s'
        },                              // 列表的样式控制
        listAlign: 'left',              // 提示列表对齐位置，left/right/auto
        listHoverStyle: 'background: #07d; color:#fff', // 提示框列表鼠标悬浮的样式
        listHoverCSS: 'jhover',         // 提示框列表鼠标悬浮的样式名称
        clearable: false,               // 是否可清除已输入的内容

        /* methods */
        fnProcessData: processData,     // 格式化数据的方法，返回数据格式参考 data 参数
        fnGetData: getData,             // 获取数据的方法，无特殊需求一般不作设置
        fnAdjustAjaxParam: null,        // 调整 ajax 请求参数方法，用于更多的请求配置需求。如对请求关键字作进一步处理、修改超时时间等
        fnPreprocessKeyword: null       // 搜索过滤数据前，对输入关键字作进一步处理方法。注意，应返回字符串
    };

    var methods = {
        init: function(options) {
        	
            // 参数设置
            var self = this;
            options = options || {};

            options = $.extend(true, {}, defaultOptions, options);

            // 旧的方法兼容
            if (options.processData) {
                options.fnProcessData = options.processData;
            }

            if (options.getData) {
                options.fnGetData = options.getData;
            }

            if (options.getDataMethod === 'firstByUrl' && options.url && !options.delayUntilKeyup) {
                ajax(options).done(function(result) {
                    options.url = null;
                    self.trigger('onDataRequestSuccess', result);
                });
            }
            
            return self.each(function() {
                var $input = $(this),
                    $iClear = getIClear($input, options),
                    mouseenterDropdownMenu,
                    keyupTimer, // keyup 与 input 事件延时定时器
                    $dropdownMenu = $input.parents('.input-group').find('ul.dropdown-menu:eq(0)');

                // 是否显示 button 按钮
                if (!options.showBtn) {
                    $input.css('border-radius', '4px')
                        .parents('.input-group:eq(0)').css('width', '100%')
                        .find('.btn:eq(0)').hide();
                }

                // 移除 disabled 类，并禁用自动完成
                $input.removeClass('disabled').prop('disabled', false).attr('autocomplete', 'off');
                // dropdown-menu 增加修饰
                $dropdownMenu.css(options.listStyle);

                // 默认背景色
                if (!options.inputBgColor) {
                    options.inputBgColor = $input.css('background-color');
                }

             // 开始事件处理
                $input.on('keydown', function(event) {
                    var currentList, tipsKeyword; // 提示列表上被选中的关键字

                    // $input.attr('data-id', '');

                    // 当提示层显示时才对键盘事件处理
                    if (!$dropdownMenu.is(':visible')) {
                        return;
                    }
                }).on('compositionstart', function(event) {
                    // 中文输入开始，锁定
                    // console.log('compositionstart');
                    inputLock = true;
                }).on('compositionend', function(event) {
                    // 中文输入结束，解除锁定
                    // console.log('compositionend');
                    inputLock = false;
                }).on('keyup input paste', function(event) {
                    var word;

                    // 如果弹起的键是回车、向上或向下方向键则返回
                    if (~$.inArray(event.keyCode, [options.keyDown, options.keyUp, options.keyEnter])) {
                        $input.val($input.val()); // 让鼠标输入跳到最后
                        setBackground($input, options);
                        return;
                    }

                    if (event.keyCode) {
                        // $input.attr('data-id', '');
                        setBackground($input, options);
                    }

                    clearTimeout(keyupTimer);
                    keyupTimer = setTimeout(function() {
                        // console.log('input keyup', event);

                        // 锁定状态，返回
                        if (inputLock) {
                            return;
                        }

                        word = $input.val();

                        // 若输入框值没有改变则返回
                        if ($.trim(word) && word === $input.attr('alt')) {
                            return;
                        }

                        // 当按下键之前记录输入框值,以方便查看键弹起时值有没有变
                        $input.attr('alt', word);

                        if (options.multiWord) {
                            word = word.split(options.separator).reverse()[0];
                        }

                        // 是否允许空数据查询
                        if (!word.length && !options.allowNoKeyword) {
                            return;
                        }

                        options.fnGetData($.trim(word), $input, refreshDropMenu, options);
                    }, options.delay || 300);
                }).on('focus', function() {
                    //console.log('input focus');
                    adjustDropMenuPos($input, $dropdownMenu, options);
                }).on('blur', function() {
                    if (!mouseenterDropdownMenu) { // 不是进入下拉列表状态，则隐藏列表
                        $dropdownMenu.css('display', '');
                    }
                }).on('click', function() {
                    // console.log('input click');
                    var word = $input.val();

                    if (
                        $.trim(word) &&
                        word === $input.attr('alt')
                    ) {
                        return $dropdownMenu.show();
                    }

                    // if ($dropdownMenu.css('display') !== 'none') {
                    if ($dropdownMenu.is(':visible')) {
                        return;
                    }

                    if (options.multiWord) {
                        word = word.split(options.separator).reverse()[0];
                    }

                    // 是否允许空数据查询
                    if (!word.length && !options.allowNoKeyword) {
                        return;
                    }

                     //console.log('word', word);
                    options.fnGetData($.trim(word), $input, refreshDropMenu, options);
                });
                
                // 下拉按钮点击时
                $input.parent().find('.btn:eq(0)').attr('data-toggle', '').click(function() {
                    var display = 'none';
                    // if ($dropdownMenu.is(':visible')) {
                    if ($dropdownMenu.css('display') === display) {
                        display = 'block';
                        if (options.url) {
                            $input.click().focus();
                                display = 'none';
                        } else {
                            // 不以 keyword 作为过滤，展示所有的数据
                            refreshDropMenu($input, options.data, options);
                        }
                    }

                    $dropdownMenu.css('display', display);
                    return false;
                });

                
                // 存在清空按钮
                if ($iClear.length) {
                    $iClear.click(function () {
                        $input.val('').attr('data-id', '');
                        setBackground($input, options);
                    });

                    $input.parent().mouseenter(function() {
                        if (!$input.prop('disabled')) {
                            $iClear.show();
                        }
                    }).mouseleave(function() {
                        $iClear.hide();
                    });
                }
                
            });
        },
        show: function() {
            return this.each(function() {
                $(this).click();
            });
        },
        hide: function() {
            return this.each(function() {
                $(this).parent().find('ul.dropdown-menu').css('display', '');
            });
        },
        disable: function() {
            return this.each(function() {
                $(this).attr('disabled', true)
                    .parent().find('.btn:eq(0)').prop('disabled', true);
            });
        },
        enable: function() {
            return this.each(function() {
                $(this).attr('disabled', false)
                    .parent().find('.btn:eq(0)').prop('disabled', false);
            });
        },
        destroy: function() {
            return this.each(function() {
                $(this).off().removeData('bsDepart').removeAttr('style')
                    .parent().find('.btn:eq(0)').off().show().attr('data-toggle', 'dropdown').prop('disabled', false) // .addClass('disabled');
                    .next().css('display', '').off();
            });
        },
        version: function() {
            return '0.0.1';
        }
    };

    //新增bsDepart
    $.fn.bsDepart = function(options) {
        // 方法判断
        if (typeof options === 'string' && methods[options]) {
            var inited = true;
            this.each(function() {
                if (!$(this).data('bsDepart')) {
                    return inited = false;
                }
            });
            // 只要有一个未初始化，则全部都不执行方法，除非是 init 或 version
            if (!inited && 'init' !== options && 'version' !== options) {
                return this;
            }
            // 如果是方法，则参数第一个为函数名，从第二个开始为函数参数
            return methods[options].apply(this, [].slice.call(arguments, 1));
        } else {
            // 调用初始化方法
            return methods.init.apply(this, arguments);
        }
    }
});
