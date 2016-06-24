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
    },
    'lib/dataTables': {
      deps: ['lib/jquery']
    },
   'lib/bootstrap-datetimepicker':{
      deps: ['lib/moment','lib/jquery','lib/bootstrap']
    }
  }
});
require([
  // util
  'lib/jquery',
  'lib/lodash',
  'lib/ractive',
  'lib/superagent','lib/moment','module/directory','lib/bootstrap','lib/jquery.form','lib/dataTables','lib/dataTables.scroller','lib/highcharts','module/funnel', 'lib/bootstrap-datetimepicker'
  
], function($, _, Ractive,request,moment,dirCompoent) {

   var config=window.config={};
  var page =window.page ={
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
      self.initFirstPage();
    },
   
    initEvent:function(){
      var self = this;
      $(document).on("click",".leftmenu .list-group a",function(event){
          $(this).addClass("active");
          $(this).siblings().removeClass("active")
      });
      $('[data-toggle="tooltip"]').tooltip();
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
          //删改查家教信息
          self.initManageJobInfo();
        }else if(operation === "onWorkStream"){
          //删改查家教信息
          self.initStateJobInfo();
          
        }else if(operation === "pinyongApplication"){
          //删改查家教信息
          self.pinyongApplication();
          
        }else if(operation === "doneWorkStream"){
          //已完成的家教信息
          self.initDoneJobInfo();
          
        }else if(operation === "uploadLearnFile"){
          //学习资料上传
          self.inituploadLearnFile();
        }else if(operation === "myShare"){
          self.initMyShare();
        }
      });
      //删除操作事件绑定
      $(document).on("click","#deleteWork",function(event){
        var id =  $(this).data("id");

        var isconfirm=  confirm("确认要删除该条记录？");
        if(isconfirm){
           $.post("/student/deleteProId", { id: id },
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
      //应聘工作
      $(document).on("click","#applyWork",function(event){
        var id =  $(this).data("id");

        var isconfirm=  confirm("确认要应聘该条兼职？");
        if(isconfirm){
           $.post("/state_process/stuapplyWork", { id: id },
                 function(data){
             if(data==1){
               alert("已通知该家长！");
               //展示流程中的兼职信息。
               self.initStateJobInfo();
             }else{
               alert("应聘失败！");
             }
          });
         
        }else{
          return false;
        }
                  
      });
      
      //修改发布的工作信息。
      $(document).on("click","#modifyWork",function(event){
          var id =  $(this).data("id");
          //获得需要修改的数据
          request
            .get("/student_rele_info/getJobInfo")
            .query({id:id})
            .end(function(err,res){
              if(!err){
                var data =JSON.parse(res.text)[0];
                console.log(data);
                 self.initModifyInfo(data);
              }
            });
      });
      //接受工作。
      $(document).on("click","#acceptApply",function(event){
        var id =  $(this).data("id");

        var isconfirm=  confirm("确认要接受该份工作？");
        if(isconfirm){
           $.post("/state_process/updateParState", { id: id,state:2 },
                 function(data){
             if(data==1){
               alert("接受成功！");
               self.pinyongApplication();
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
      //拒绝家长的聘用
      $(document).on("click","#obeyApply",function(event){
        var id =  $(this).data("id");

        var isconfirm=  confirm("确认要拒绝该用户的聘用？");
        if(isconfirm){
           $.post("/state_process/updateParState", { id: id,state:-1},
                 function(data){
             if(data==1){
               alert("拒绝成功！");
               self.pinyongApplication();
             }else{
               alert("拒绝失败！");
             }
          });
         
        }else{
          return false;
        }             
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
          obj:data
        }
      });
      //获得下拉框数据
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
          ract.set("nj",dataBody);
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
      $('#form-modify-Job').ajaxForm({  
        type:'post',
        dataType: 'json',
        success: function(data){  
          console.log(data);
          alert(data.msg);
          if(data.msg === "修改成功"){
            self.initManageJobInfo();
          }
      
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
          xq:{},
          nj:{},
          xb:{},
          lsnj:{}
        }
      });
       //获得课程名称
      initSelect(ractiveCxjzxx,"DIR_STD_COURSE","course");
      //获得性别名称
      initSelect(ractiveCxjzxx,"STD_SEX","xb");
      //获得学期
      initSelect(ractiveCxjzxx,"DIR_STD_XQ","xq");
      //所教年级
      initSelect(ractiveCxjzxx,"DIR_STD_JJNJ","nj");
      //获得老师年级
      initSelect(ractiveCxjzxx,"DIR_STD_NJ","lsnj");
      //绑定ajax提交表单事件
      $('#form-jjjzxx').ajaxForm({  
        type:'post',
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
    /**
     * 绘制家长发布的兼职信息表格
     */
    PaintJzxxTable:function(data){
      var column = [
          { data: 'SJKCMC',title:"要求课程名" },
          { data: 'SJXQMC' ,title:"要求学期" },
          { data: 'SJNJMC' ,title:"要求所教年级" },
          { data: 'NJ' ,title:"老师年级要求" },
          { data: 'CDXZSP' ,title:"初定薪资水平" },
         // { data: 'BZ' ,title:"备注" },
          { data: 'TELE' ,title:"移动电话" },
          { data: 'ADDRESS' ,title:"家庭住址" },
           { data: 'RESOURCE_ID' ,title:"应聘" }
      ];
        $('.main-table').html("<table class='xxtable table hover table-striped'></table>");
        $('.xxtable').DataTable({
         data: data,
         "aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "所有"]],
         columns:column,
          "language":lanuages,
          scrollY: '50vh',
          scrollX: true,
          scrollCollapse: true,
          paging: true,
          "columnDefs": [
            {
              
              "render": function(data, type, row) {
              
                return  '<a class="glyphicon glyphicon-phone-alt" aria-hidden="true" id="applyWork" data-id='+data+' title="应聘"></a>';
              },
              "targets": 7
            } 
          ]
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
          nj:{}
        }
      });
      //获得下拉框数据
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
          ract.set("nj",dataBody);
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
          if(data.msg === "添加成功"){
            self.initManageJobInfo();
          }
      
        },
        error:function(err){
          console.log(err);
        }  
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
          nj:{}
        }
      });
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
          ract.set("nj",dataBody);
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
      //初始化数据
      request
        .get("/student_rele_info/getJobInfo")
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
        type:'get',
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
      var column = [
          { data: 'SJKCMC',title:"所教科目" },
          { data: 'SJXQMC' ,title:"所教学期" },
          { data: 'SJNJMC' ,title:"所教年级" },
          { data: 'QWXZSP' ,title:"初定薪资水平" },
          { data: 'JYMS' ,title:"以往经验描述" },
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
    inituploadLearnFile:function(){
        var self = this;
        self.ractiveTpl.teardown();
        var ract = self.ractiveTpl =new Ractive({
          el:'.main-content',
          template:$("#upload-file-tpl").html(),
          data:{
           
          }
        });
        $('#form-add-file').ajaxForm({  
          type:'post',
          dataType: 'json',
          enctype:'multipart/form-data',  
          success: function(data){  
            console.log(data);
            //alert(data.msg);
            if(data.msg === "0"){
              alert("上传成功");
            }
          },
          error:function(err){
            console.log(err);
          }  
        }); 
    
    },
    initMyShare:function(){
      var self = this;
      self.ractiveTpl.teardown();
      var ract = self.ractiveTpl =new Ractive({
        el:'.main-content',
        template:$("#myshare-tpl").html(),
        data:{
        }
      });
      //////////////////////////////////////////////
      //处理数据使适应折线图
      var data =1;
        var category =[];
      for(var i=6;i>=0;i--){
        var singleDay = moment().subtract(i,'days').format("YYYYMMDD");
        category.push(singleDay);
      }
      var start_dt =category[0];
      var end_dt =category[category.length-1];
      //获得文章和文件数
      request
      .get("/student/getMySum")
      .query({startdt:start_dt})
      .query({enddt:end_dt})
      .end(function(err,res){
        if(!err){
          var data =JSON.parse(res.text)[0];
         self.paintShareChart(data,category);
        }
      });
      /////////////////////////////////
    },
    paintShareChart:function(data,category){
      //获得近十天的日期
     //构造并补全数据
     var filelist =data.flist;
      var bloglist =data.blist;
      var farr =[];
      var barr =[];
      for(var i=0;i<category.length;i++){
        var temp =_.filter(filelist,{'CJSJ':category[i]});
        farr.push(temp.length);
         var temp1 =_.filter(bloglist,{'CJSJ':category[i]});
        barr.push(temp1.length);
      }
       $('#chart_line').highcharts({
        chart: {
            type: "spline",
            style: {
                fontFamily: "",
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#006cee'
            },
            zoomType:'xy'
        },

        title: {
            text: '我的近七天分享趋势图',
            x: -20 ,//center
            useHTML:true,
            style:{
                color:'#286090'
            }
        },
        subtitle: {
            text: '分享，使自己快速成长',
            x: -20
        },
        xAxis: {
            categories:category,
            gridLineWidth:'1',
            //gridLineDashStyle:'Dash',
        },
        yAxis: {
            title: {
                text: '次数'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            shared:true,
            crosschairs:true,
            valueSuffix: '次',
            //backgroundColor: '#FCFFC5', // 背景颜色
            //borderColor: 'black', // 边框颜色
            borderRadius: 10, // 边框圆角
            borderWidth: 3, // 边框宽度
            shadow: true, // 是否显示阴影
            animation: true, // 是否启用动画效果
            style: { // 文字内容相关样式
             //   color: "#ff0000",
                fontSize: "12px",
                fontWeight: "blod",
                fontFamily: "Courir new"
            }
        },
        legend: {
            layout: 'horizontal',
            align: 'middle',
            verticalAlign: 'bottom',
            borderWidth:0,
            x: 300, 
            y: 20
        },
        series: [
            
        {
            name: '经验博文',
            data: barr,
            
        }, {
            name: '学习资源',
            data:farr,
             
        }],
        credits: {
          enabled: false
        } 

      });
    },
    /**
     * 学生所应聘信息的审批流程显示。
     * @return {[type]} [description]
     */
    initStateJobInfo:function(){
      var self = this;
      self.ractiveTpl.teardown();
      var ract = self.ractiveTpl =new Ractive({
        el:'.main-content',
        template:$("#applywork-tpl").html(),
        data:{
          wait:{},//等待接受
          onway:{},//正在进行
          sayno:{},//驳回。
          course:{},
          nj:{},
          xq:{}
        }
      });
      //绘制流程图
      request
        .get("/state_process/getStateInfo")
        .end(function(err,res){
        if(!err){
          var data =JSON.parse(res.text);
          //=====================
          //对流程信息进行分类
          //=====================
          var obj = _.groupBy(data,'STATE');
         
          var arr1 = obj["1"];
          if(arr1){
             ract.set("wait",arr1);
          }
         
          var arr2 = obj["2"];
          if(arr2){
             ract.set("onway",arr2);
          }
          var arr_1 = obj["-1"];
          if(arr_1){
             ract.set("sayno",arr_1);
          }
           //获得课程名称
        initSelect(ract,"DIR_STD_COURSE","course");
        //获得学期
        initSelect(ract,"DIR_STD_XQ","xq");
        //所教年级
        initSelect(ract,"DIR_STD_JJNJ","nj");

          console.log(arr1);
          console.log(arr2);
          console.log(arr_1);
        }
      });
    },
    /**
     * 获得学生完成的兼职
     * @return {[type]} [description]
     */
    initDoneJobInfo:function(){
      var self = this;
      self.ractiveTpl.teardown();
      var ract = self.ractiveTpl =new Ractive({
        el:'.main-content',
        template:$("#donework-tpl").html(),
        data:{
          obj:{},//等待接受
          course:config['sjkm'],
          nj:{},
          xq:{}
        },
        components: {
          widget: dirCompoent
        }
      });
      $(document).on('click','#cxDoneInfo',function(event){
       var stdt ='';
       var enddt ='';
        console.log($("#jssj").val());
        if($("#kssj").val()){
         stdt =moment($("#kssj").val()).format('YYYYMMDD');
        }
        if($("#jssj").val()){
          enddt =moment($("#jssj").val()).format('YYYYMMDD');
        }
        
         console.log(stdt);
          request
            .get("/state_process/getDoneInfo")
            .query({kssj:stdt ,
                   jssj:enddt})
            .end(function(err,res){
              if(!err){
                var data =JSON.parse(res.text);
                ract.set("obj",data);
                console.log(data);
              }
          });
      });

      ////////////////////////
      ///获得信息
      /////////////////////////
      request
        .get("/state_process/getDoneInfo")
        .send({})
        .end(function(err,res){
          if(!err){
            var data =JSON.parse(res.text);
            ract.set("obj",data);
            console.log(data);
          }
        });
    },
    /**
     * 学生处理聘用申请
     * @return {[type]} [description]
     */
    pinyongApplication:function(){
      var self = this;
      self.ractiveTpl.teardown();
      var ract = self.ractiveTpl =new Ractive({
        el:'.main-content',
        template:$("#pinYong-tpl").html(),
        data:{
          obj:{},//等待接受
          course:config.sjkcm,
          nj:config.sjnj,
          xq:config.sjxq,
          lc:config.spzt
        },
        components: {
          widget: dirCompoent
        }
      });
       //初始化数据
      request
        .get("/state_process/getPinYong")
        .query({})
        .type("json")
        .accept('application/json')
        .end(function(err,res){
          if(!err){
            self.PaintPinyongTable(JSON.parse(res.text),ract);
          }

        })
        //绑定ajax提交表单事件
      $('#form-pinyong').ajaxForm({  
        type:'get',
        dataType: 'json',
        success: function(data){  
          console.log(data);
          self.PaintPinyongTable(data,ract);
        },
        error:function(err){
          console.log(err);
        }  
      }); 

    },
    /**
     * 绘制聘用图标。
     */
    PaintPinyongTable:function(data,ract){
      console.log(data);
      var column = [
          { data: 'PAR_NAME',title:"家长用户名" },
          { data: 'PAR_TELE',title:"家长电话" },
          { data: 'SJKCM' ,title:"所教科目" },
          { data: 'SJXQ' ,title:"所教学期" },
          { data: 'SJNJ' ,title:"所教年级" },
          { data: 'QWXZSP' ,title:"期望薪资水平" },
          { data: 'JYMS' ,title:"以往经验描述" },
          { data: 'ADDRESS' ,title:"家长具体住址" },
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
                return  '<span class="glyphicon glyphicon-log-in" aria-hidden="true" id="acceptApply" data-id='+row.RESOURCE_ID+' title="接受"></span> &nbsp; &nbsp;'
                 + '<span class="glyphicon glyphicon-remove" aria-hidden="true" id="obeyApply" data-id='+row.RESOURCE_ID+' title="驳回"></span>';
              }else if(data ==="2"){
                 return  '正在进行';
              }else if(data ==="3"){
                 return  '该流程已完成';
              }else{
                 return  '<span class="glyphicon glyphicon-remove-sign" aria-hidden="true" id="bohui" title="已驳回"></span>';
              }
                
              },
              "targets": 9
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
              "targets": 8
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
              "targets": 2
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
              "targets": 3
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
              "targets": 4
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