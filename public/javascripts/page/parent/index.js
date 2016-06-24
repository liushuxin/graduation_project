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
    } ,'lib/jquery.form': {
      deps: ['lib/jquery']
    },
    'lib/highcharts': {
        deps: ['lib/jquery']
      },
    'module/funnel': {
      deps: ['lib/highcharts']
    },
    'lib/dataTables': {
      deps: ['lib/jquery']
    }
  }
});
require([
  // util
  'lib/jquery',
  'lib/lodash',
  'lib/ractive',
  'lib/superagent','lib/moment', 'module/directory','lib/bootstrap','lib/jquery.form','lib/dataTables','lib/dataTables.scroller','lib/highcharts','module/funnel'
  
], function($, _, Ractive,request,moment,dirCompoent) {

  var config=window.config={};
  var page  ={
    run:function(){
      var self = this;
      //初始化
      self.initQuery();
      self.initEvent();
     
    },
    initQuery:function(){
     var self =this;
     //初始化字典表到config上
     initCodeToName(config,"DIR_STD_COURSE","sjkcm");
     initCodeToName(config,"DIR_STD_XQ","sjxq");
     initCodeToName(config,"DIR_STD_JJNJ","sjnj");
     initCodeToName(config,"DIR_STD_SPLC","spzt");
      initCodeToName(config,"DIR_STD_XXMC","xxmc");
     self.initFirstPage();
    },
   
    initEvent:function(){
      var self = this;
      $(document).on("click",".leftmenu .list-group a",function(event){
          $(this).addClass("active");
          $(this).siblings().removeClass("active")
      });

       //绑定点击事件
      $(document).on("click",".leftmenu .list-group a",function(event){
        //获得操作类型
        var operation =$(this).data("operation");
        if(operation === "workInfo"){
          //家教信息查询
           self.initFirstPage();
        }else if(operation === "add"){
           //发布家教信息
          self.initAddJobInfo();
        }else if(operation === "manageInfo"){
          //管理发布的家教信息删改查
          self.initManageJobInfo()
        }else if(operation === "reviewApply"){
          //审核工作申请。
          self.initReviewApply();
        }else if(operation === "engageInfo"){
          //审核工作申请。
          self.initEngageInfo();
        }

      });
      //删除操作事件绑定
      $(document).on("click","#deleteWork",function(event){
        var id =  $(this).data("id");

        var isconfirm=  confirm("确认要删除该条记录？");
        if(isconfirm){
           $.post("/parent/deleteProId", { id: id },
                 function(data){
             if(data==1){
               alert("删除成功！");
               self.initManageJobInfo();
             }else{
               alert("删除失败！");
             }
          });
         
        }else{
          return false;
        }              
      });
      //聘用事件的绑定
      $(document).on("click","#engagedStudent",function(event){
        var id =  $(this).data("id");

        var isconfirm=  confirm("确认要聘用该家教老师？");
        if(isconfirm){
          $.post("/state_process/engagedStudent", { id: id },
                 function(data){
             if(data==1){
               alert("已通知该学生！");
               //展示流程中的兼职信息。
               self.initFirstPage();
             }else{
               alert("聘用失败！");
             }
          });
         
        }else{
          return false;
        }              
      });
      
      //修改发布的信息
      $(document).on("click","#modifyWork",function(event){
          var id =  $(this).data("id");
          //获得需要修改的数据
          request
            .post("/parent_rele_info/getWorkInfo")
            .send({id:id})
            .end(function(err,res){
              if(!err){
                var data =JSON.parse(res.text)[0];
                 self.initModifyInfo(data);
              }
             
            });
      });
      //接受学生应聘的信息
      
      $(document).on("click","#acceptApply",function(event){
        var id =  $(this).data("id");

        var isconfirm=  confirm("确认要接受该学生的请求？");
        if(isconfirm){
           $.post("/state_process/updateState", { id: id,state:2 },
                 function(data){
             if(data==1){
               alert("接受成功！");
               self.initReviewApply();
             }else{
               alert("接受失败！");
             }
          });
         
        }else{
          return false;
        }             
      });
      //已驳回，不可进行操作
      $(document).on("click","#bohui",function(event){
        alert("已驳回，不可进行操作！"); 
      });
       $(document).on("click","#submitPj",function(event){
         $('#myModal').modal('hide');
         self.submitPjInfo();
      });
      //拒绝学生应聘信息
      $(document).on("click","#obeyApply",function(event){
        var id =  $(this).data("id");

        var isconfirm=  confirm("确认要驳回该学生的请求？");
        if(isconfirm){
           $.post("/state_process/updateState", { id: id,state:-1},
                 function(data){
             if(data==1){
               alert("驳回成功！");
               self.initReviewApply();
             }else{
               alert("驳回失败！");
             }
          });
         
        }else{
          return false;
        }             
      });
      //教学任务完成，进行评价
      $(document).on("click","#doneApply",function(event){
        var id =  $(this).data("id");
        //两种用户发布的兼职类型
        var type =  $(this).data("type");
        console.log(type);
        $("#info_id").val(id);
        $("#logintype").val(type);
        
      $('#myModal').modal('show');
            
      });
      //显示大学生教师的分析视图
      $(document).on("click","#detail",function(event){
        //获得该大学生的id值。
        var id =  $(this).data("id");
         var name =  $(this).text();
        //获得该老师的兼职基本信息。

      var ractDetail = self.ractiveTpl;
        //detail-tpl 详细信息渲染。
      request.get('state_process/getStuDetailDoneInfo')
        .query({stu_id:id})
        .end(function(err,res){
          if(!err){
            var temp =res.text;
            ractDetail.set("obj",JSON.parse(res.text)); 
            ractDetail.set("size",JSON.parse(res.text).length); 
            console.log(ractDetail.get("obj"));
          }

        });
        
      $('#myDetail').modal('show');
            
      });
      
    },
    initModifyInfo:function(data){
      var self =this;
      self.ractiveTpl.teardown();
      var ract = self.ractiveTpl =new Ractive({
        el:'.main-content',
        template:$("#modifyJob-tpl").html(),
        data:{
          course:{},
          xq:{},
          nj:{},
          xb:{},
          sznj:{},
          obj:data
        }
      });
      //获得下拉框数据
       //获得课程名称
         // //获得下拉框数据
      initSelect(ract,"DIR_STD_COURSE","course");
      //获得年级
      initSelect(ract,"DIR_STD_JJNJ","nj");
      //学期
      initSelect(ract,"DIR_STD_XQ","xq");
      //获得性别
      initSelect(ract,"STD_SEX","xb");
      //学期
      initSelect(ract,"DIR_STD_NJ","sznj");
      

      //绑定ajax提交表单事件
      $('#form-modify-Job').ajaxForm({  
        type:'post',
        dataType: 'json',
        success: function(data){  
          console.log(data);
          alert(data.msg);
            self.initManageJobInfo();
      
        },
        error:function(err){
          console.log(err);
        }  
     }); 
    },
    initFirstPage:function(){
      var self = this;
      if(self.ractiveTpl){
        self.ractiveTpl.teardown();
      }
      var ractiveCxjzxx=self.ractiveTpl =new Ractive({
        el:'.main-content',
        template:$("#jzjzxx-tpl").html(),
        data:{
          course:{},
          sex:{},
          zy:{},
          xq:{},
          nj:{},
          xx:{},
          obj:{},
          size:0
        }
      });
      //获得课程名称
      initSelect(ractiveCxjzxx,"DIR_STD_COURSE","course");
      //获得性别名称
      initSelect(ractiveCxjzxx,"STD_SEX","sex");
       //获得专业
      initSelect(ractiveCxjzxx,"DIR_STD_ZY","zy");
      //获得学期
      initSelect(ractiveCxjzxx,"DIR_STD_XQ","xq");
      //所教年级
        initSelect(ractiveCxjzxx,"DIR_STD_JJNJ","nj");
      //获得性别名称
      initSelect(ractiveCxjzxx,"DIR_STD_XXMC","xx");
      //绑定ajax提交表单事件
      $('#form-jjjzxx').ajaxForm({  
        type:'get',
        dataType: 'json',
        success: function(data){  
          console.log(data);
          self.PaintJzxxTable(data);
      
        },
        error:function(err){
          console.log(err);
        }  
      }); 
    },
    initAddJobInfo:function(){
      var self =this;
      self.ractiveTpl.teardown();
      var ract = self.ractiveTpl =new Ractive({
        el:'.main-content',
        template:$("#addJob-tpl").html(),
        data:{
          course:{},
          xq:{},
          sjnj:{},
          xb:{},
          nj:{}

        }
      });
      //获得下拉框数据
      initSelect(ract,"STD_SEX","xb");
      initSelect(ract,"DIR_STD_NJ","nj");
       //获得课程名称
      request
      .get("/org/getIndex")
      .query({index:"DIR_STD_COURSE"})
      .end(function(err,res){
        if(!err){
        var dataBody = JSON.parse(res.text);
          ract.set("course",dataBody);
        }
      });
      //获得年级
      request
      .get("/org/getIndex")
      .query({index:"DIR_STD_JJNJ"})
      .end(function(err,res){
        if(!err){
        var dataBody = JSON.parse(res.text);
          ract.set("sjnj",dataBody);
        }
      });
      //学期
      request
      .get("/org/getIndex")
      .query({index:"DIR_STD_XQ"})
      .end(function(err,res){
        if(!err){
        var dataBody = JSON.parse(res.text);
          ract.set("xq",dataBody);
        }
      });
      

      //绑定ajax提交表单事件
      $('#form-add-Job').ajaxForm({  
        type:'post',
        dataType: 'json',
        success: function(data){  
          console.log(data);
          alert(data.msg);
          //跳到管理页面
          self.initManageJobInfo();
        },
        error:function(err){
          console.log(err);
        }  
     }); 
    },
        /**
     * 绘制家长发布的兼职信息表格
     */
    PaintJzxxTable:function(data){
      var column = [
          { data: 'XM',title:"姓名" },
          { data: 'XBM' ,title:"性别" },
          { data: 'ZYM' ,title:"专业" },
          { data: 'SJKCMC' ,title:"所教科目" },
          { data: 'SJXQMC' ,title:"所教学期" },
          { data: 'SJNJMC' ,title:"所教年级" },
          { data: 'XXM' ,title:"所在学校" },
          { data: 'XXSZDMC' ,title:"学校所在地" },
          { data: 'TELE' ,title:"移动电话" },
          { data: 'QWXZSP' ,title:"期望薪资水平" },
          { data: 'JYMS' ,title:"以往经验描述" },
          { data: 'RESOURCE_ID' ,title:"聘用" }
      ];
        $('.main-table').html("<table class='xxtable table hover table-striped'></table>");
        $('.xxtable').DataTable({
         data: data,
         "aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "所有"]],
         columns:column,

          "columnDefs": [
          {
              
              "render": function(data, type, row) {
              
                return  '<a title="点击姓名查看兼职分析" id="detail" data-id="'+row["STU_ID"]+'" >'+data+'</a>';
              },
              "targets": 0
            },
            {
              
              "render": function(data, type, row) {
              
                return  '<span class="glyphicon glyphicon-user" aria-hidden="true" id="engagedStudent" data-id='+data+' title="聘用"></span>';
              },
              "targets": 11
            }
          ],
          "language":lanuages,
          scrollY: '50vh',
          scrollX: true,
          scrollCollapse: true,
          paging: true
      
       });
    },
    initManageJobInfo:function(){
      var self = this;
        self.ractiveTpl.teardown();
      var ract = self.ractiveTpl =new Ractive({
        el:'.main-content',
        template:$("#manageJobInfo-tpl").html(),
        data:{
          course:{},
          xq:{},
          nj:{},
          xb:{},
          sznj:{}
        }
      });
         //获得课程名称
         // //获得下拉框数据
      initSelect(ract,"DIR_STD_COURSE","course");
      //获得年级
      initSelect(ract,"DIR_STD_JJNJ","nj");
      //学期
      initSelect(ract,"DIR_STD_XQ","xq");
      //获得性别
        initSelect(ract,"STD_SEX","xb");
      //学期
      initSelect(ract,"DIR_STD_NJ","sznj");
    
      //初始化数据
      request
        .post("/parent_rele_info/getWorkInfo")
        .query({})
        .type("json")
        .accept('application/json')
        .end(function(err,res){
          if(!err){
            self.PaintJobTable(JSON.parse(res.text));
          }

        })
        //绑定ajax提交表单事件
      $('#form-manageJobInfo').ajaxForm({  
        type:'post',
        dataType: 'json',
        success: function(data){  
          console.log(data);
          self.PaintJobTable(data);
        },
        error:function(err){
          console.log(err);
        }  
      }); 
    },
    PaintJobTable:function(data){
      console.log(data);
      var column = [
          { data: 'SJKCMC',title:"所教科目" },
          { data: 'SJXQMC' ,title:"所教学期" },
          { data: 'SJNJMC' ,title:"所教年级" },
          { data: 'CDXZSP' ,title:"初定薪资水平" },
          { data: 'BZ' ,title:"备注" },
          { data: 'RESOURCE_ID' ,title:"删除" },
          { data: 'RESOURCE_ID' ,title:"修改" }
      ];
        $('.main-table').html("<table class='xxtable table hover table-striped'></table>");
        $('.xxtable').DataTable({
         data: data,
         "aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "所有"]],
         columns:column,
          "language":lanuages ,

          "columnDefs": [
            {
              
              "render": function(data, type, row) {
              
                return  '<span class="glyphicon glyphicon-trash" aria-hidden="true" id="deleteWork" data-id='+data+'></span>';
              },
              "targets": 5
            },
             {
              
              "render": function(data, type, row) {
              
                return  '<span class="glyphicon glyphicon-pencil" aria-hidden="true" id="modifyWork" data-id='+data+'></span>';
              },
              "targets": 6
            }
          ],
          scrollY: '50vh',
          scrollX: true,
          scrollCollapse: true,
          paging: true
      
       });
    },
    /**
     * 绘制审批流程图
     * @param {[type]} data [description]
     * @param {[type]} ract [description]
     */
    PaintStateSTable:function(data,ract){
      console.log(data);
      var column = [
          { data: 'XM',title:"学生姓名" },
          { data: 'SJKCM' ,title:"所教课程名" },
          { data: 'SJXQ' ,title:"所教学期" },
          { data: 'SJNJ' ,title:"所教年级" },
          { data: 'CDXZSP' ,title:"初定薪资水平" },
          { data: 'STU_TELE' ,title:"学生电话" },
          { data: 'KSSJ' ,title:"开始时间" },
          { data: 'STATE' ,title:"审批状态" },
          { data: 'STATE' ,title:"审批流程" }
      ];
        $('.main-table').html("<table class='xxtable table hover table-striped'></table>");
        $('.xxtable').DataTable({
         data: data,
         "aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "所有"]],
         columns:column,
          "language":lanuages ,

          "columnDefs": [
            {
              
              "render": function(data, type, row) {
              if(data === 1){
                return  '<span class="glyphicon glyphicon-log-in" aria-hidden="true" id="acceptApply" data-id='+row.RESOURCE_ID+' title="接受"></span> &nbsp; &nbsp;'
                 + '<span class="glyphicon glyphicon-remove" aria-hidden="true" id="obeyApply" data-id='+row.RESOURCE_ID+' title="驳回"></span>';
              }else if(data ===2){
                 return  '<span class="glyphicon glyphicon-saved" aria-hidden="true" id="doneApply" data-id="'+row.RESOURCE_ID+'" data-type="1" title="完成"></span>';
              }else if(data ===3){
                 return  '该流程已完成';
              }else{
                 return  '<span class="glyphicon glyphicon-remove-sign" aria-hidden="true" id="bohui" title="已驳回"></span>';
              }
                
              },
              "targets": 8
            },
             {
              
              "render": function(data, type, row) {
                var lc =ract.get("lc");
                for(var i=0;i<lc.length;i++){
                  if(lc[i].ID ==data){
                    return lc[i].NAME;
                  }
                }
                return  "-";
              },
              "targets": 7
            },
            {
              
              "render": function(data, type, row) {
                var lc =ract.get("course");
                for(var i=0;i<lc.length;i++){
                  if(lc[i].ID ==data){
                    return lc[i].NAME;
                  }
                }
                "-";
              },
              "targets": 1
            },
            {
              
              "render": function(data, type, row) {
                var lc =ract.get("xq");
                for(var i=0;i<lc.length;i++){
                  if(lc[i].ID ==data){
                    return lc[i].NAME;
                  }
                }
                return  "-";
              },
              "targets": 2
            },
            {
              
              "render": function(data, type, row) {
                var lc =ract.get("nj");
                for(var i=0;i<lc.length;i++){
                  if(lc[i].ID ==data){
                    return lc[i].NAME;
                  }
                }
                return "-";
              },
              "targets": 3
            }

          ],
          scrollY: '50vh',
          scrollX: true,
          scrollCollapse: true,
          paging: true
      
       });
    },
    /**
     * 审核工作请求
     * @return {[type]} [description]
     */
    initReviewApply:function(){
      var self = this;
      self.ractiveTpl.teardown();
      var ract = self.ractiveTpl =new Ractive({
        el:'.main-content',
        template:$("#reviewApply-tpl").html(),
        data:{
          course:config.sjkcm,
          xq:config.sjxq,
          nj:{},
          xb:{},
          szzy:{},
          xx:{},
          lc:config.spzt,
          myd:config.myd
        }
      });
        // //获得下拉框数据
      initSelect(ract,"DIR_STD_COURSE","course");
      //获得年级
      initSelect(ract,"DIR_STD_JJNJ","nj");
      //学期
      initSelect(ract,"DIR_STD_XQ","xq");
      //获得性别
      initSelect(ract,"STD_SEX","xb");
      //学期
      initSelect(ract,"DIR_STD_NJ","sznj");
       //获得性别
      initSelect(ract,"DIR_STD_ZY","szzy");
      //学期
      initSelect(ract,"DIR_STD_XXMC","xx");
        //流程
      initSelect(ract,"DIR_STD_SPLC","lc");
      //满意度
      initSelect(ract,"DIR_STD_MYCD","myd");
      //初始化数据
      request
        .post("/state_process/getStateInfoP")
        .query({})
        .type("json")
        .accept('application/json')
        .end(function(err,res){
          if(!err){
            //渲染学生教师申请的工作审批。
            self.PaintStateSTable(JSON.parse(res.text),ract);
          }

        })
        //绑定ajax提交表单事件
      $('#form-stateJobInfo').ajaxForm({   
        type:'post',
        dataType: 'json',
        success: function(data){  
          console.log(data);
          self.PaintStateSTable(data,ract);
        },
        error:function(err){
          console.log(err);
        }  
      }); 

    },
    /**
     * 提交最后评价
     * @return {[type]} [description]
     */
    submitPjInfo:function(){
      var self =this;
      var obj ={
        score :$("#score").val(),
        myd :$("#myd").val(),
        pj :$("#pj").val(),
        id :$("#info_id").val(),
        type :$("#logintype").val()
      }
      console.log(obj);
      request
        .post("/state_process/doneProcess")
        .send(obj)
        .end(function(err,res){
          if(!err){
            var data =res.text;
            console.log(data);
            if(data ==="1"){
              alert("评价完成！");
              if(obj.type === "1"){
                self.initReviewApply();
              }else{
                 self.initEngageInfo();
              }
              
            }else{
              alert("评价失败！");
            }
          }
        });
    },
    initEngageInfo:function(){
       var self = this;
      self.ractiveTpl.teardown();
      var ract = self.ractiveTpl =new Ractive({
        el:'.main-content',
        template:$("#engageInfo-tpl").html(),
        data:{
          course:config.sjkcm,
          xq:config.sjxq,
          nj:{},
          xb:{},
          szzy:{},
          xx:config.xxmc,
          lc:config.spzt,
          myd:config.myd
        }
      });
      //获得年级
      initSelect(ract,"DIR_STD_JJNJ","nj");
     
      //获得性别
      initSelect(ract,"STD_SEX","xb");
      //学期
      initSelect(ract,"DIR_STD_NJ","sznj");
       //获得性别
      initSelect(ract,"DIR_STD_ZY","szzy");
      //初始化数据
      request
        .get("/state_process/getEngageInfo")
        .type("json")
        .accept('application/json')
        .end(function(err,res){
          if(!err){
            //渲染学生教师申请的工作审批。
            self.PaintStatePTable(JSON.parse(res.text),ract);
          }

        })
        //绑定ajax提交表单事件
      $('#form-engageInfo').ajaxForm({   
        type:'get',
        dataType: 'json',
        success: function(data){  
          console.log(data);
          self.PaintStatePTable(data,ract);
        },
        error:function(err){
          console.log(err);
        }  
      }); 
    },
    /**
     * 绘制聘用信息表
     * @param {[type]} data [description]
     * @param {[type]} ract [description]
     */
    PaintStatePTable:function(data,ract){
      console.log(data);
      var column = [
          { data: 'XM',title:"学生姓名" },
          { data: 'STU_TELE',title:"学生电话" },
          { data: 'XXMC',title:"所在学校" },
          { data: 'SJKCM' ,title:"所教科目" },
          { data: 'SJXQ' ,title:"所教学期" },
          { data: 'SJNJ' ,title:"所教年级" },
          { data: 'QWXZSP' ,title:"期望薪资水平" },
          { data: 'JYMS' ,title:"以往经验描述" },
          { data: 'KSSJ' ,title:"开始时间" },
           { data: 'STATE' ,title:"流程状态" },
          { data: 'STATE' ,title:"选择" }
      ];
        $('.main-table').html("<table class='xxtable table hover table-striped'></table>");
        $('.xxtable').DataTable({
         data: data,
         "aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "所有"]],
         columns:column,
          "language":lanuages ,
          "columnDefs": [
            {
              
              "render": function(data, type, row) {
              if(data === "1"){
                return  '等待教师同意';
              }else if(data ==="2"){
                 return  '<span class="glyphicon glyphicon-saved" aria-hidden="true" id="doneApply" data-id="'+row.RESOURCE_ID+'" data-type="2" title="完成"></span>';
              }else if(data ==="3"){
                 return  '该流程已完成';
              }else{
                 return  '<span class="glyphicon glyphicon-remove-sign" aria-hidden="true" id="bohui" title="已驳回"></span>';
              }
                
              },
              "targets": 10
            },
             {
              
              "render": function(data, type, row) {
                var lc =ract.get("lc");
                for(var i=0;i<lc.length;i++){
                  if(lc[i].ID ==data){
                    return lc[i].NAME;
                  }
                }
                return  "-";
              },
              "targets": 9
            },
            {
              
              "render": function(data, type, row) {
                var xxmc =ract.get("xx");
                for(var i=0;i<xxmc.length;i++){
                  if(xxmc[i].ID ==data){
                    return xxmc[i].NAME;
                  }
                }
                "-";
              },
              "targets": 2
            },
            {
              
              "render": function(data, type, row) {
                var course =ract.get("course");
                for(var i=0;i<course.length;i++){
                  if(course[i].ID ==data){
                    return course[i].NAME;
                  }
                }
                "-";
              },
              "targets": 3
            },
            {
              
              "render": function(data, type, row) {
                var lc =ract.get("xq");
                for(var i=0;i<lc.length;i++){
                  if(lc[i].ID ==data){
                    return lc[i].NAME;
                  }
                }
                return  "-";
              },
              "targets": 4
            },
            {
              
              "render": function(data, type, row) {
                var lc =ract.get("nj");
                for(var i=0;i<lc.length;i++){
                  if(lc[i].ID ==data){
                    return lc[i].NAME;
                  }
                }
                return "-";
              },
              "targets": 5
            }
             
          ],
          scrollY: '50vh',
          scrollX: true,
          scrollCollapse: true,
          paging: true
      
       });

    }

  }
  //初始化页面
  var lanuages = {
            "sProcessing": "处理中...",
            "sLengthMenu": "显示 _MENU_ 项结果",
            "sZeroRecords": "没有匹配结果",
            "info": "显示第  _PAGE_ 页 ,共 _PAGES_ 项",
            "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
            "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
            "sInfoPostFix": "",
            "sSearch": "搜索:",
            "oPaginate": {
              "sFirst": "首页",
              "sPrevious": "上页",
              "sNext": "下页",
              "sLast": "末页"
            }
          };
//初始化页面
  function initSelect(ractive,tableName,param){
     request
      .get("/org/getIndex")
      .query({index:tableName})
      .end(function(err,res){
        if(!err){
        var dataBody = JSON.parse(res.text);
          ractive.set(param,dataBody);
        }
      });
  }
  function initCodeToName(config,tableName,param){
     request
      .get("/org/getIndex")
      .query({index:tableName})
      .end(function(err,res){
        if(!err){
        var dataBody = JSON.parse(res.text);
          config[param]=dataBody;
        }
      });
  }
  page.run();
});