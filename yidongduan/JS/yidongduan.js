/**
 * Created by Dell on 2017/11/2.
 */
//顶部
{
    var swiper = new Swiper('.swiper-container', {
        loop: true,
        autoplay: 3000,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        spaceBetween: 30
    });
}
//内容
{
    var myscroll = new IScroll(".neirong", {
        scrollbars: true,
        fadeScrollbars: true,
        mouseWheel: true
    });
    myscroll.refresh();
}
//事件
{
    //添加颜色  切换
    var state = "wait";
    $(".top div").click(function () {
        if ($(this).hasClass("active")) {
            return;
        }
        $(".top div")
            .removeClass("active")
            .filter(this)
            .addClass("active");
        if (state === "wait") {
            state = "done";
            $(".neirong ul").show();
            $(".neirong .lj")
                .show()
                .css("display", "block");
        }
        else {
            state = "wait";
            $(".neirong ul").show();
            $(".neirong .lj")
                .hide()
                .css("display", "none");
        }
        reWrite();
    });

    //添加
    $("#bottom").click(function () {
        $("#main")
            .css("filter", "blur(2px)")
            .next()       //获取子元素
            .show(200)
            .find("#editarea")
            .css("display", "block")
            // .addClass("show")
            .delay(500)
            .queue(function () {
                $(this).addClass("show").dequeue();
                $("#text")[0].focus();           //转化为原生对象   1.直接加下标[0]   2.  .get(0)  获取下标
            });
    });

    //提交
    $("#submit").click(function () {
        var data = getData();
        var cl = getColor();
        var time = new Date().getTime();//转化为毫秒数
        var text = $("#text").val();
        if (text === "") {
            return;
        }
        data.push({con: text, time, isStar: 0, isDone: 0, cl});
        saveData(data);
        $("#text").val("");
        $("#editarea")
            .css("display", "none")
            .removeClass("show")
            .parent()
            .hide()
            .prev()
            .css("filter", "");
        reWrite();
        myscroll.refresh();
    });

    //关闭
    $("#close").click(function () {
        $("#text")
            .parent()   //获取上一级父元素
            .removeClass("show")
            .css("display", "none")
            .parent()
            .hide(200)
            .prev()    //获取前一个兄弟元素
            .css("filter", "")
    });
    var ind;
    //修改内容
    $(".neirong").on("click", "p", function () {
        var wz =$(this).html();
        $("#wenzi").val(wz);
        $(this).html("");
        ind= $(this).parent().attr("id");
        $("#main")
            .css("filter", "blur(2px)")
            .next()       //获取子元素
            .show(200)
            .find("#xgitarea")
            .css("display", "block")
            .delay(500)
            .queue(function () {
                $(this).addClass("show").dequeue();
                $("#wenzi")[0].focus();           //转化为原生对象   1.直接加下标[0]   2.  .get(0)  获取下标
            });
    });

    //修改
    $("#xiugai").click(function () {
        var data = getData();
        var text = $("#wenzi").val();
        $("p")[ind].html(text);
        $("#wenzi").val("");
        saveData(data);
        $("#wenzi")
            .val("")
            .parent()
            .css("display", "none")
            .removeClass("show")
            .parent()
            .hide()
            .prev()
            .css("filter", "");
        reWrite();
        myscroll.refresh();
    });

    //退出
    $("#guanbi").click(function () {

        $("#wenzi")
            .parent()   //获取上一级父元素
            .removeClass("show")
            .css("display", "none")
            .parent()
            .hide(200)
            .prev()    //获取前一个兄弟元素
            .css("filter", "")
    });

    //转移
    $(".neirong").on("click", ".right", function () {
        var data = getData();
        var index = $(this).parent().attr("id");
        data.reverse();
        data[index].isDone = 1;
        data.reverse();
        saveData(data);
        reWrite();
    });

    //删除
    $(".neirong").on("click", ".del", function () {
        var data = getData();
        var index = $(this).parent().attr("id");
        data.reverse();
        data.splice(index, 1);
        data.reverse();
        saveData(data);
        reWrite();
    });

    //全部删除
    $(".neirong").on("click", ".lj i", function () {
        var data = getData();
        var str ;
        $.each(data, function (index) {
            var isdone = data[index].isDone;
            str = $("li").filter(isdone === 0);
        });
        console.log(str);
        // $(".neirong ul").html(str);
        // saveData(data);
        // reWrite();
    });
    //星标
    $(".neirong").on("click", "ul li i", function () {
        var data = getData();
        var index = $(this).parent().attr("id");
        data.reverse();
        data[index].isStar = data[index].isStar === 0 ? 1 : 0;
        data.reverse();
        saveData(data);
        reWrite();
    });

    //方法
    //获取颜色
    function getColor() {
        var color = ["0", "3", "6", "9", "c"];
        var col = "#";
        for (var i = 0; i < 3; i++) {
            var pos = Math.floor(Math.random() * color.length);
            col += color[pos];
        }
        return col;
    }

    //获取数据
    function getData() {
        return localStorage.todo ? JSON.parse(localStorage.todo) : [];
    }

    //修改数据
    function saveData(data) {
        localStorage.todo = JSON.stringify(data);
    }

    // 添加元素
    function reWrite() {
        var cl = getColor();
        var data = getData();
        data.reverse();
        $(".neirong ul").empty();
        var str = "";
        $.each(data, function (index, val) {
            if (state === "wait") {
                if (val.isDone === 0) {
                    var className = val.isStar ? "active" : "";
                    str += "<li style='background: " + val.cl + "' id = " + index + "> <input type=\"checkbox\"> <time> <span>" + getYear(val.time) + "</span><span>" + getTime(val.time) + "</span></time> <p>" + val.con + "</p> <i class=iconfont id=" + className + ">&#xe614;</i><div class='right'>完成</div> </li>"
                }
            }
            else if (state === "done") {
                if (val.isDone === 1) {
                    var className = val.isStar ? "active" : "";
                    str += "<li style='background: #ccc' id =" + index + "> <input type=\"checkbox\"> <time><span>" + getYear(val.time) + "</span><span>" + getTime(val.time) + "</span> </time><p>" + val.con + "</p> <i class=iconfont1 id=" + className + ">&#xe614;</i><div class='del'>删除</div> </li>"
                }
            }
        });
        $(".neirong ul").html(str);
        myscroll.refresh();
        addEvent();
    }

    //横向移动
    function addEvent() {
        var max = $(window).width() / 3;
        $(".neirong li").each(function (index, ele) {
            var mm = new Hammer(ele);
            var mx;
            var state = "start";
            mm.on("panstart", function (e) {
                $(ele).css("transition", "none");
            });
            mm.on("pan", function (e) {
                mx = e.deltaX;
                if (state === "start") {
                    if (mx > 0) {
                        return;
                    }
                    if (mx < 0) {
                        return;
                    }
                }
                if (state === "end") {
                    if (mx < 0) {
                        return;
                    }
                    mx = mx - max;
                }
                if (Math.abs(mx) > max) {
                    return;
                }
                $(ele).css("transform", "translate3d(" + mx + "px,0,0)")
            });
            mm.on("panend", function () {
                $(ele).css("transition", "all 1s");
                if (Math.abs(mx) > max / 2) {
                    state = "end";
                    $(ele).css("transform", "translate3d(" + (-max) + "px,0,0)")
                } else {
                    state = "start";
                    $(ele).css("transform", "translate3d(0,0,0)")
                }
            })
        })
    }

    //获取当前时间
    //日期
    function cfon(t) {
        return t < 10 ? "0" + t : t;
    }

    function getYear(e) {
        var date = new Date();
        date.setTime(e);
        var tt = date.getFullYear();
        var rr = cfon(date.getMonth() + 1);
        var ta = cfon(date.getDate());
        return tt + "-" + rr + "-" + ta;
    }

    //时间
    function getTime(r) {
        var date = new Date();
        date.setTime(r);
        var tt = date.getHours();
        var rr = cfon(date.getMinutes());
        var ta = cfon(date.getSeconds());
        return tt + ":" + rr + ":" + ta;
    }

    reWrite();
    addEvent();
}