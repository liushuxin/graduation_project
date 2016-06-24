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
     'lib/dataTables': {
      deps: ['lib/jquery']
    },
 
    
  }
});
require([
  // util
  'lib/jquery',
  'lib/lodash',
  'lib/ractive',
  'lib/superagent',
  'lib/dataTables','lib/bootstrap'
  
], function($, _, Ractive,request) {
  var page =window.page ={
    run:function(){
      var self = this;
      //初始化
      self.initBanner();
      self.initEvent();
      self.initGold();
    },
    initEvent:function(){
        $(".scroll").click(function(event){   
          event.preventDefault();
          $('html,body').animate({scrollTop:$(this.hash).offset().top},1000);
        });

        //banner

        //end banner
        //

      //选择注册类型
      $('.modal-body').on('click','button.btn',function(event){
        $('#myModal').modal('hide');
      });
    },
    initBanner:function(){
    },
    initGold:function(){
      request
        .get("/getGoldTeacher")
        .end(function(err,res){
          if(!err){
            var data = JSON.parse(res.text);
            console.log(data);
            //绘制金牌教师
            var rac = Ractive({
              el:'.gold-stu',
              template:$("#gold-stu-tpl").html(),
              data:{
                obj:data,
                imgUrl:"http://localhost:8080/jrjy/"
              }
            });
          }
        });
      
    }
  }
//初始化页面
  page.run();
});