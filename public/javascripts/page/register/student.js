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
   /*'/lib/bootstrapValidator':{
       deps: ['lib/jquery','lib/bootstrap']
     },*/
    'module/amazeui.min': {
      deps: ['lib/jquery.min']
    }

  }
});
require([
  // util
  'lib/jquery',
  'lib/lodash',
  'lib/ractive',
  'lib/superagent',
  //'lib/events',
  'lib/bootstrap',
  //'lib/bootstrap-datetimepicker',
  'module/amazeui.min',
  'lib/bootstrapValidator'
  
], function($, _, Ractive,request) {
 /* var EventEmitter = events.EventEmitter;
  var ee = new EventEmitter();*/
  var ee =$(document);
  var page =window.page ={
    run:function(){
      var self = this;
      //初始化
      self.initFields();
      self.initEvent();
      ee.on('validate',function(){
         self.initValidate();
      })
     
    },
    initEvent:function(){

      var self =this;
     // $('#datetimePicker').datetimepicker();
      //点击事件样式切换
      $('#collapse-head').on('click','ul.am-nav li',function(e){
        $(this).addClass('am-active');
        $(this).siblings().removeClass('am-active');
      });
      //绑定选择不同区域显示不同学校
    /*  $('#IdxxszdDom').on('change','#xxszd',function(){
        alert(1)
       // console.log($(this).val());
      });*/
   
    },
      initValidate:function(){
      var self = this;
      if(!self.XXSZD || !self.SXZY || !self.XB)
        return;
      $('#register-form')
        .bootstrapValidator({
          message: '输入不正确',
          submitButtons: 'button[type="submit"]',
          feedbackIcons: {
              valid: 'glyphicon glyphicon-ok',
              invalid: 'glyphicon glyphicon-remove',
              validating: 'glyphicon glyphicon-refresh'
          },
          submitHandler:function(validator, form, submitButton) {
          
              // Use Ajax to submit form data
              $.post('/register/addStudentTeacher', form.serialize(), function(result) {
                 alert(result)
              }, 'json');
          },
          fields: {
              USER_NAME: {
                  validators: {
                      notEmpty: {
                          message: '用户名不能为空'
                      },
                      stringLength: {
                        min: 6,
                        max: 30,
                        message: '用户名必须介于6~30个字符'
                    },  
                      remote: {
                        message: '该用户已存在',
                        url: '/register/ValidateUserName/'
                    }
                    /*,
                    regexp: {
                        regexp: /^[a-zA-Z0-9_]+$/,
                        message: 'The username can only consist of alphabetical, number and underscore'
                    }*/
                  }
              },
              PASSWORD: {
                  validators: {
                      notEmpty: {
                          message: '密码不能为空'
                      },
                      stringLength: {
                        min: 6,
                        max: 30,
                        message: '密码必须介于6~30个字符'
                    }
                  }
              },
              conpassword: {
                  validators: {
                      notEmpty: {
                          message: '确认密码不能为空'
                      },
                       callback: {
                        message: '两次密码不一致',
                        callback: function(value, validator) {
                            // Determine the numbers which are generated in captchaOperation
                            var items = $('#psd').val();
                                
                            return value == items;
                        }
                    }
                  }
              },
              XB: {
                  validators: {
                      notEmpty: {
                          message: '性别不能为空'
                      }
                  }
              },
              QQ: {
                  validators: {
                      notEmpty:{
                          message: 'QQ号码不能为空'
                      }
                  }
              },
              TELE: {
                  validators: {
                      notEmpty: {
                          message: '移动电话不能为空'
                      },
                       integer: {
                        message: '输入格式不正确号码应该是数字'
                      },
                       stringLength: {
                        min: 11,
                        max: 11,
                        message: '电话号码必须为11位'
                    }

                  }
              },
               E_MAIL: {
                validators: {
                    notEmpty: {
                        message: 'Emial 地址不能为空'
                    },
                    emailAddress: {
                        message: 'Emial 地址输入不正确'
                    }
                }
            },
            XM: {
                  validators: {
                      notEmpty: {
                          message: '姓名不能为空'
                      }
                  }
              },
              XH: {
                  validators: {
                      notEmpty: {
                          message: '学号不能为空'
                      },
                      integer: {
                        message: '输入格式不正确号码应该是数字'
                      },
                  }
              },
              XXMC: {
                  validators: {
                      notEmpty: {
                          message: '学校名称不能为空'
                      }
                      
                  }
              },
              XXSZD: {
                  validators: {
                      notEmpty: {
                          message: '学校所在地不能为空'
                      }
                      
                  }
              },
              ZY: {
                  validators: {
                      notEmpty: {
                          message: '专业不能为空'
                      }
                      
                  }
              },
               /*datetimePicker: {
                  validators: {
                      notEmpty: {
                          message: '出生年月不能为空'
                      },
                      date: {
                          format: 'MM/DD/YYYY h:m A'
                      }
                  }
              }*/
          }
      });
    },
    initFields:function(){
      var self = this;
      //学校所在地
      request
        .get('/org/getIndex')
        .query({index:'DIR_STD_XXSZD'})
        .end(function(err,res){
          if(!err){
          var dataBody = JSON.parse(res.text);
          //渲染学校所在地
           self.xxszdRactive = Ractive({
            el:'#xxszdDom',
            template:$('#xxszdDom').next('script').html(),
            data:{
              obj:dataBody,
              xxmc:{}
            }
           });
           self.XXSZD =true;
           ee.trigger('validate');
           self.xxszdRactive.on('changeschool', function ( event ) {
              //根据学校所在地获得学校名称
            self.initXXMC(event.node.value);
          });
           
          }
        });
        //性别
        request
        .get('/org/getIndex')
        .query({index:'STD_SEX'})
        .end(function(err,res){
          if(!err){
          var dataBody = JSON.parse(res.text);
          //渲染学校所在地
           Ractive({
            el:'#xbDOM',
            template:$('#xb-tpl').html(),
            data:{
              obj:dataBody
            }
           });
            self.XB =true;
            ee.trigger('validate');
          }
        });

        //所学专业
        request
        .get('/org/getIndex')
        .query({index:'DIR_STD_ZY'})
        .end(function(err,res){
          if(!err){
          var dataBody = JSON.parse(res.text);
          //渲染所学专业
           Ractive({
            el:'#sszyDOM',
            template:$('#sxzy-tpl').html(),
            data:{
              obj:dataBody
            }
           });
            self.SXZY =true;
            ee.trigger('validate');
          }
        });
        
    },
    initXXMC:function(placeId){
      var self =this;
       request
        .get('/org/getXXMC')
        .query({index:placeId})
        .end(function(err,res){
          if(!err){
          var dataBody = JSON.parse(res.text);
          //渲染学校名称
          self.xxszdRactive.set('xxmc',dataBody);
           self.XXMC =true;
           ee.trigger('validate');
          }
        });

    }
  }
//初始化页面
  page.run();
});