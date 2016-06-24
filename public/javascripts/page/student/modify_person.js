/**
 * 个人信息修改
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
    'lib/fileinput': {
      deps: ['lib/jquery','lib/bootstrap']
    }
  }
});
require([
  // util
  'lib/jquery',
  'lib/bootstrap',
  'lib/lodash',
  'lib/ractive',
  'lib/superagent', 'lib/fileinput','lib/jquery.form'
  
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
  		var id = $("#resid").val();
    

initFileInput("file-Portrait", "/student/updateImage");

},
   
    initEvent:function(){
    var self = this;
    $(document).on("click","#personInfo button[type=submit]",function(event){
    	event.preventDefault();
    	self.submitForm();
    });
    $(document).on("click","button.fileinput-upload-button",function(event){
     
      $('#imageForm').ajaxForm({  
        type:'post',
      //  data:{resource_id:$("resource_id")},
        dataType: 'json',
        enctype:'multipart/form-data',  
        success: function(data){  

       if(data.msg ==="0"){
        alert("上传成功");
        location.reload();
       } 
        },
        error:function(err){
          alert(err);
        }  
    });  

    });
    },
    submitForm:function(){
    	var action= "/student/updatePerson/";

    	$.post(action, $("#personInfo").serialize(), function(data) {

			     if(data ==="修改成功"){
			     	 	alert("更新成功！");

			     }else{
			     	alert("更新失败！");
			    };
			});
    	    	
    }

  }
  //初始化fileinput控件（第一次初始化）
function initFileInput(ctrlName, uploadUrl) {    
    var control = $('#' + ctrlName); 
    control.fileinput({
                language: 'zh', //设置语言
                uploadUrl: "/FileUpload/Upload", //上传的地址
                allowedFileExtensions : ['jpg', 'png','gif'],//接收的文件后缀,
                maxFileCount: 100,
                enctype: 'multipart/form-data',
                showUpload: true, //是否显示上传按钮
                showCaption: false,//是否显示标题
                browseClass: "btn btn-primary btn-mybtn", //按钮样式             
                previewFileIcon: "<i class='glyphicon glyphicon-king'></i>", 
                msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
            });
}

//初始化页面
  page.run();
});