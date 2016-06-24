/**
 * 主页面逻辑
 */
'use strict';
/**
 * 配置基本库
 * @type {[type]}
 */
require.config({
  baseUrl: '/javascripts',
  shim: {
    'lib/bootstrap': {
      deps: ['lib/jquery']
    }
  }
});
require([
  // util
  'lib/jquery',
  'lib/lodash',
  'lib/ractive',
  'lib/superagent'
  
], function($, _, Ractive,request) {

  var config={};
  var page =window.page ={
    run:function(){
      var self = this;
      //初始化
      self.initQuery();
      self.initEvent();
     
    },
    initQuery:function(){
     var self =this;
     self.setConfirmMa();

    },
    setConfirmMa:function(){
       var arr = [];
      for(var i=0;i<4;i++){
        var temp = Math.random()*9;
        var inter = Math.floor(temp);
        arr.push(inter);
      }
      var str =arr.join("");
        config.code = str ;
      $("#yzm").html(str);
      
    },
    initEvent:function(){
      var self = this;
    	$(document).on('click','.btn-info',function(event){

        event.preventDefault();
        var username=$('#username').val();
        var password =$('#password').val();
        var yzm =$('#conyzm').val();
        var loginType = $("#loginType").val();
         if(username===""){
          alert("用户名不能为空");
          return;
         }
         if(password===""){
          alert("密码不能为空");
          return;
         }
         if(yzm!==config.code){
          alert("验证码输入不正确！");
          return;
         }

        $.post("/login/log_in", {username:username, password:password}, function (data) {
          var temp = JSON.parse(data);
          if(temp.code === "0"){
             alert("用户不存在或密码错误");
          }else if(temp.code === "1"){
            if(loginType === "parent"){
               window.location.href="http://"+temp.url;
             }else{
               alert("用户不存在或密码错误");
             }
          }else{
            if(loginType === "student"){
               window.location.href="http://"+temp.url;
             }else{
               alert("用户不存在或密码错误");
             }
          }
        });

      });
      $(document).on('click','#change',function(event){
           self.setConfirmMa();
      });
    }

  }
//初始化页面
  page.run();
});