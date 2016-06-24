/**
 * 学生教师页面
 */
var express = require('express');
var home = require('x-root-path');
var BACKEND = require(home+'../../config/backend').BACKEND;
var request = require('superagent');
module.exports = function(router){
	//登录首页
  router.get('/', function(req, res, next) {
  	if(!req.session.user){
  		res.redirect("/login/parent/");
  	}
    res.render('parent/index.ejs', 
    	{ title: '学生家长主页面' ,
    		username:req.session.user.username });
  });

	 router.post('/deleteProId', function(req, resp, next) {
     var itemurl = BACKEND+"/parent/deleteProId.do";
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

};