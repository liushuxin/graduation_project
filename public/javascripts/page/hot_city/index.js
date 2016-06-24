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
      .get("/org/getIndex")
      .query({index:"DIR_STD_XXSZD"})
      .end(function(err,res){
        if(!err){
        var dataBody = JSON.parse(res.text);
         config.Provience = dataBody
          request
            .get("/student/getStuAndTeah")
            //.accept()
            .end(function(err,res){
              if(!err){
                var data =JSON.parse(res.text);
                self.buildData(data);
              }
            });
         
        }
      });
    
    },
    initEvent:function(){

    },
    buildData:function(data){

      var self = this;
      var typeObj = _.groupBy(data,'TYPE');
      //学生教师
      var arrStu = typeObj['2'];
       //学生家长
      var arrPar = typeObj['1'];
      console.log(config.Provience);
      var category =_.pluck(config.Provience,'NAME');
      var series1 =[];
      var series2 =[];
      config.Provience.forEach(function(item){
       var temp = _.filter(arrStu,'PROV',item.ID);
       series1.push({name:item.NAME,y:temp.length});
       //学生家长
       var temp1 = _.filter(arrPar,'PROV',item.ID);
       series2.push({name:item.NAME,y:temp1.length});
      });

      self.paintColumn(series1,series2,category);
      self.paintPie1(series1);
      self.paintPie2(series1,series2,category);      
    },
    paintColumn:function(series1,series2,category){
             $('#chart_column').highcharts({
        chart: {
            type: "column",
            style: {
                fontFamily: "",
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#006cee'
            },
            zoomType:'xy'
        },

        title: {
            text: '热门城市注册情况',
            x: -20 ,//center
            useHTML:true,
            style:{
                color:'#286090'
            }
        },
        subtitle: {
            text: '我们在成长',
            x: -20
        },
        xAxis: {
            categories:category,
            gridLineWidth:'1',
            //gridLineDashStyle:'Dash',
        },
        yAxis: {
            title: {
                text: '人数'
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
            valueSuffix: '人',
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
            name: '学生教师',
            data: series1,
            
        }, {
            name: '学生家长',
            data: series2,
             
        }],
        credits: {
          enabled: false
        } 

      });
    },
    paintPie1:function(series1,series2,category){
             $('#chart_pie1').highcharts({
        chart: {
            type: "pie",
            style: {
                fontFamily: "",
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#006cee'
            },
            zoomType:'xy'
        },

        title: {
            text: '热门城市注册情况',
            x: -20 ,//center
            useHTML:true,
            style:{
                color:'#286090'
            }
        },
        subtitle: {
            text: '学生教师注册情况',
            x: -20
        },
        xAxis: {
            categories:category,
            gridLineWidth:'1',
            //gridLineDashStyle:'Dash',
        },
        yAxis: {
            title: {
                text: '人数'
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
            valueSuffix: '人',
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
            },
              pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b><br>{series.name}: <b>{point.y}</b>'
        },
        legend: {
            layout: 'horizontal',
            align: 'middle',
            verticalAlign: 'bottom',
            borderWidth:0,
            x: 300, 
            y: 20
        },
        series: [{
            name: '注册人数',
            colorByPoint: true,
            data:series1
          }],
        credits: {
          enabled: false
        } 

      });
},
 paintPie2:function(series1,series2,category){
             $('#chart_pie2').highcharts({
        chart: {
            type: "pie",
            style: {
                fontFamily: "",
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#006cee'
            },
            zoomType:'xy'
        },

        title: {
            text: '热门城市注册情况',
            x: -20 ,//center
            useHTML:true,
            style:{
                color:'#286090'
            }
        },
        subtitle: {
            text: '学生家长注册情况',
            x: -20
        },
        xAxis: {
            categories:category,
            gridLineWidth:'1',
            //gridLineDashStyle:'Dash',
        },
        yAxis: {
            title: {
                text: '人数'
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
            valueSuffix: '人',
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
            },
             pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b><br>{series.name}: <b>{point.y}</b>'
        },
        legend: {
            layout: 'horizontal',
            align: 'middle',
            verticalAlign: 'bottom',
            borderWidth:0,
            x: 300, 
            y: 20
        },
        series: [{
            name: '注册人数',
            colorByPoint: true,
            data:series2
          }],
        credits: {
          enabled: false
        } 

      });
}
  }
//初始化页面
  page.run();
});