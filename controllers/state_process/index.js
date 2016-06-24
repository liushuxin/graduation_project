/**
 * 学生教师应聘流程操作
 * liushuxiin
 * 2016-5-30
 */

'use strict';
var express = require('express');
var home = require('x-root-path');
var url = require('url');
var debug = require('debug')('jiajiao:state_process');
//获得后端地址
var BACKEND = require(home+'../../config/backend').BACKEND;
var request = require('superagent');
module.exports=function(router){
	//学生教师应聘某条工作。
	router.post('/stuapplyWork',function(req,resp,next){
		var itemurl = BACKEND+"/student/applyWork.do";
     console.log(itemurl);
     request
      .post(itemurl)
      .query(req.body)
       .query({username:req.session.user.username})
      .type("json")
      .end(function(req,res,next){
        // return 1 更新成功
        // return 0 更新失败
      resp.send(res.text);
       
      });
	});
  //学生教师获得审批流程信息
  router.get('/getStateInfo',function(req,resp,next){
    var itemurl = BACKEND+"/student/getStateInfo.do";
     console.log(itemurl);
     request
      .get(itemurl)
      .query({username:req.session.user.username})
      .type("json")
      .end(function(req,res,next){
        resp.send(res.text);
      });
  });
//学生家长获得审批流程
 router.post('/getStateInfoP',function(req,resp,next){
    var itemurl = BACKEND+"/student/getStateInfoP.do";
     console.log(itemurl);
     request
      .get(itemurl)
      .query(req.body)
      .query({username:req.session.user.username})
      .type("json")
      .end(function(req,res,next){
        resp.send(res.text);
      });
 });

//更新state
router.post("/updateState",function(req,resp,next){
    var itemurl = BACKEND+"/student/updateState.do";
     console.log(itemurl);
     request
      .get(itemurl)
      .query(req.body)
      .type("json")
      .end(function(req,res,next){
        resp.send(res.text);
      });
});  
//更新家长聘用的信息状态
router.post("/updateParState",function(req,resp,next){
    var itemurl = BACKEND+"/parent/updateParState.do";
     console.log(itemurl);
     request
      .get(itemurl)
      .query(req.body)
      .type("json")
      .end(function(req,res,next){
        resp.send(res.text);
      });
});  

//完成兼职（新增完成兼职信息）
router.post("/doneProcess",function(req,resp,next){
    var itemurl = BACKEND+"/student/doneProcess.do";
     console.log(itemurl);
     request
      .get(itemurl)
      .query(req.body)
      .type("json")
      .end(function(req,res,next){
        resp.send(res.text);
      });
});  
//学生教师获取完成的兼职信息
router.get('/getDoneInfo',function(req,resp,next){
    var itemurl = BACKEND+"/student/getDoneInfo.do";
     console.log(itemurl);
     request
      .get(itemurl)
      .query(req.query)
      .query({username:req.session.user.username})
      .query({logintype:"1"})//1为学生教师，2为学生家长
      .type("json")
      .end(function(req,res,next){
        resp.send(res.text);
      });
});
router.get('/getStuDetailDoneInfo',function(req,resp,next){
    var itemurl = BACKEND+"/student/getStuDetailDoneInfo.do";
     console.log(itemurl);
     request
      .get(itemurl)
      .query(req.query)
      .type("json")
      .end(function(req,res,next){
        resp.send(res.text);
      });
});

//=====================================================
//parent series of operation
//=====================================================

router.post('/engagedStudent',function(req,resp,next){
    var itemurl = BACKEND+"/parent/engagedStudent.do";
     console.log(itemurl);
     request
      .post(itemurl)
      .query(req.body)
       .query({username:req.session.user.username})
      .type("json")
      .end(function(req,res,next){
        // return 1 更新成功
        // return 0 更新失败
      resp.send(res.text);
       
      });
});
//学生获得聘用信息
router.get('/getPinYong',function(req,resp,next){
    var itemurl = BACKEND+"/parent/getPinYong.do";
     console.log(itemurl);
     request
      .post(itemurl)
      .query(req.query)
      .query({logintype:"1"})
      .query({username:req.session.user.username})
      .type("json")
      .end(function(req,res,next){
       resp.send(res.text);
       
      });
});

//家长获得聘用信息
router.get('/getEngageInfo',function(req,resp,next){
    var itemurl = BACKEND+"/parent/getPinYong.do";
     console.log(itemurl);
     request
      .post(itemurl)
      .query(req.query)
      .query({logintype:"2"})
      .query({username:req.session.user.username})
      .type("json")
      .end(function(req,res,next){
       resp.send(res.text);
       
      });
});

}