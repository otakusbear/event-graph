<script>
</script>

<template>
<div class="navbar navbar-default menu-top" >
    <div class="container">
        <div class="navbar-header"> 
            <!-- <a href="#" class="navbar-brand" >
            <h2 style="background: linear-gradient(to right,#3464e0, #9214f4);-webkit-background-clip: text;color: transparent; width: 500px ">群体性事件演化机制研究系统</h2>
            </a> -->
            <div class="menu_wrap mainmenu" >
                <nav id="navigation">
                    <ul>
                    <li><a href="#">主页</a></li>
<!--                    <li><a href="/src/static/index.html">NLP平台</a></li>-->
<!--                    <li><a href="/#/Input">构建事理图谱</a></li>-->
                    <li><a href="/#/Events">群体性事件语料库</a></li>
                    <li><a href="/#/lepton">群体性事件事理图谱</a></li>
<!--                    <li><a href="/#/chart">特征分析</a></li>-->
<!--                      <li><a href="/#/pattern">模式挖掘</a></li>-->
                    </ul>
                </nav>
            </div>
        </div>
    </div>
</div>
</template>

<style>
.navbar{
    background: #fff;
    padding-top: 10px;
    border: 3px solid #f0f0f0;
    border-radius: 8px;
}
.navbar-header{
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: justify;
    justify-content: space-between;
}
.container {
    width: 100%;
    padding-right: 50px;
    padding-left: 50px;
}
.navbar-collapse.collapse.in{
    background-color: #fff;
    padding: 0px 30px;
}
.navbar-collapse.collapse.in #navigation li a{
    color: #313131;
}
.navbar-default .navbar-nav>.current>a,
.navbar-default .navbar-nav>.active>a,
.navbar-default .navbar-nav>.active>a:hover,
.navbar-default .navbar-nav>.active>a:focus {
    color: #3464e0;
    background-color: transparent;
}
.navbar-default .navbar-nav>.open>a,
.navbar-default .navbar-nav>.open>a:hover,
.navbar-default .navbar-nav>.open>a:focus {
    color: #3464e0 ;
    background-color: transparent;
}
.navbar-default .navbar-collapse, .navbar-default .navbar-form {
    border-color: #fff;
}
.menu-top li{
    display: inline-block;
}
.menu-top li a {
    color: #222 ;
    font-size: 16px;
    font-weight: 600;
    text-transform: capitalize;
    font-family: 'Quicksand', sans-serif;
    letter-spacing: .5px;
    padding-left: 35px;

}
.navbar-default .navbar-nav > li > a{
    color: #333 ;
}
.navbar-default .navbar-nav > li > a:hover,
.navbar-default .navbar-nav > li > a:focus,
.menu-top li a:hover{
    color: #3464e0;
}
#navigation .nav > li > a{
    padding: 10px 20px;
}
.footer_top {
    color: #fff;
    padding: 80px 0 50px;
    background: #10232f;
    border-bottom: 1px solid #283546;
}
</style>
