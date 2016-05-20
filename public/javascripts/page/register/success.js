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
   '/lib/bootstrapValidator':{
       deps: ['lib/jquery','lib/bootstrap']
     },
    'module/amazeui.min': {
      deps: ['lib/jquery.min']
    }

  }
});
require([
  // util
  'lib/jquery',
  'lib/ractive',
  'lib/superagent',
  'lib/bootstrap',
  
], function($,Ractive,request) {
  var ee =$(document);
  var page =window.page ={
    run:function(){
      var self = this;
      //初始化
      self.initEvent();
    },

    initEvent:function(){

	var ractive = new Ractive({
		el:'#message',
		template:$('#message-tpl').html(),
		data:{
			time:3
		}
	});
	var i=3;
	setInternal(function(ractive,i){
	i--;
	if(i==0){
		request.get("/");
	}else{
		ractive.set('time',i);
	}
	},1000);
    }
  }
//初始化页面
  page.run();
});