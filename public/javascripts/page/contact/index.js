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
    },
     'lib/jquery.form': {
      deps: ['lib/jquery']
    },
    'lib/highcharts': {
        deps: ['lib/jquery']
      },
    'module/funnel': {
      deps: ['lib/highcharts']
    }
  }
});
require([
  // util
  'lib/jquery',
  'lib/lodash',
  'lib/ractive',
  'lib/superagent','lib/jquery.form','lib/highcharts','module/funnel'
  
], function($, _, Ractive,request) {

  var config={};
  var page =window.page ={
    run:function(){
      var self = this;
      //初始化
      self.initQuery();
     
    },
    initQuery:function(){
     var self =this;
        //绑定ajax提交表单事件
      $('#yijianfankun').ajaxForm({  
        type:'post',
        dataType: 'json',
        success: function(data){  
          console.log(data);
         if(data=="0"){
         	alert("反馈成功！");
         	window.location.href="/";
         }
        },
        error:function(err){
          console.log(err);
        }  
      });
     
    }


  }
//初始化页面
  page.run();
});