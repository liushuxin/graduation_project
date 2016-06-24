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
     self.paintColumn();
     
    },
     paintColumn:function(){
      var category  =[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
     var  series1 = [];
      var myDate = new Date();
      var date =myDate.getHours();       //获取当前小时数(0-23)
      for(var i=0;i<24;i++){
        
        if(i<date){
          var data =Math.random()*100;
          series1.push(Math.floor(data));
        }else{
          series1.push(null);
        }
        
      }
        $('#chart_1').highcharts({
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
            text: '实时流量',
            x: -20 ,//center
            useHTML:true,
            style:{
                color:'#286090'
            }
        },
        subtitle: {
            text: '网站实时流量',
            x: -20
        },
        xAxis: {
            categories:category,
            gridLineWidth:'1',
            //gridLineDashStyle:'Dash',
        },
        yAxis: {
            title: {
                text: '访问量'
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
            name: '实时流量',
            data: series1,
            
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