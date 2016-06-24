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
      self.initEvent();
     
    },
    initQuery:function(){
     var self =this;
      request
      .get("/student_rele_info/getLearn")
      .end(function(err,res){
        if(!err){
        var dataBody = JSON.parse(res.text);
        console.log(dataBody)
        self.initZiyuan(dataBody);
  
        }
      });
    
    },
    initEvent:function(){

    },
    initZiyuan:function(data){
    		var rect = new Ractive({
    				el:'.domtbody',
    				template:$("#learn-tpl").html(),
    				data:{
    					obj:data,
    					url:'http://localhost:8080/jrjy/'
    				}
    		});
    }
   

  }
//初始化页面
  page.run();
});