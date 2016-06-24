/**
 * 学生教师页面
 */
var express = require('express');
var home = require('x-root-path');
var debug = require('debug')('jiajiao:register');
var BACKEND = require(home+'../../config/backend').BACKEND;
var request = require('superagent');
var reque = require('request');
module.exports = function(router){
  router.get('/', function(req, res, next) {
  	if(!req.session.user){
  		res.redirect("/login/student/");
  	}
    res.render('student/index.ejs',
     { title: '学生教师主页面',
     		username:req.session.user.username });
  });
  router.get('/modifyPersonInfo', function(req, resp, next) {
      if(!req.session.user){
      resp.redirect("/login/student/");
    }
   var username = req.session.user.username;
   var itemurl = BACKEND+"/student/modifyPersonInfo.do";
   console.log(itemurl);
   request
   	.get(itemurl)
   	.query({username:username})
   	.type("json")
   	.end(function(req,res,next){
   		console.log(res.text);
   		console.log(res.body);
   		resp.render("student/modify_info.ejs",
   			{
   				title:"家睿教育-个人信息修改",
   				data:JSON.parse(res.text)[0],
          imgUrl:"http://localhost:8080/jrjy/"

   			});
   	});
  });

  router.post('/updatePerson', function(req, resp, next) {

   var username = req.session.user.username;
   var itemurl = BACKEND+"/student/updatePerson.do";
   console.log(itemurl);
   request
    .get(itemurl)
    .query(req.body)
    .type("json")
    .end(function(req,res,next){
      // return 0 更新成功
      // return 1 更新失败
     resp.send(res.text);
    });
  });
//头像上传
   router.post('/updateImage',function(req,res,next){
    console.log(req.body);
    var backReq = reque.post({
      url:'http://localhost:8080/jrjy/student/uploadImage.do?resource_id='+req.body.resource_id
    });
    req.pipe(backReq);
    req.on('error', next);
    backReq.on('error', next);
    backReq.pipe(res);
  });
   
  router.post('/uploadLearnFile',function(req,res,next){
    console.log(req.body);
    var backReq = reque.post({
      url:'http://localhost:8080/jrjy/student/uploadLearnFile.do?username='+req.session.user.username
    });
    req.pipe(backReq);
    req.on('error', next);
    backReq.on('error', next);
    backReq.pipe(res);
  });
  router.get('/shareExprience',function(req,res,next){
    res.render("student/exprience.ejs",{
      title:"经验分享"
    });
    
  });
  //文章添加
  router.post('/addBlog', function(req, resp, next) {

     var username = req.session.user.username;
     var itemurl = BACKEND+"/student/addBlog.do";
     console.log(itemurl);
     request
      .post(itemurl)
      .query(req.body)
      .query({username:username})
      .type("json")
      .end(function(req,res,next){
        // return 0 更新成功
        // return -1 更新失败
        var data =JSON.parse(res.text);
        if(data.msg ==="0"){
          resp.redirect("/student");
        }else{
          console.log("新增失败！");
        }
       
      });
  });
//删除兼职信息
   router.post('/deleteProId', function(req, resp, next) {
     var itemurl = BACKEND+"/student/deleteProId.do";
     console.log(itemurl);
     request
      .post(itemurl)
      .query(req.body)
      .type("json")
      .end(function(req,res,next){
        // return 0 更新成功
        // return -1 更新失败
      resp.send(res.text);
       
      });
  });
   //获得信息资源
  router.get("/getMySum",function(req,resp,next){
    var getschoolplaceurl = BACKEND+"/student/getMySum.do";
    console.log(getschoolplaceurl);
    console.log(req.query);
      request
        .get(getschoolplaceurl)
        .query(req.query)
        .query({username:req.session.user.username})
        .set('Content-Type', 'application/json')
        .accept('application/json')
        .end(function(req,res,next){
          console.log(res.text);
            resp.send(res.text);

        });

  });


  router.get("/getStuAndTeah",function(req,resp,next){
    var getschoolplaceurl = BACKEND+"/student/getStuAndTeah.do";
    console.log(getschoolplaceurl);
      request
        .get(getschoolplaceurl)
        .set('Content-Type', 'application/json')
        .accept('application/json')
        .end(function(req,res,next){
          console.log(res.text);
            resp.send(res.text);

        });

  });
   
};