/**
 * 登录功能的实现
 * liushuxin
 * 2016-5-20
 */
'use strict';
var express = require('express');
var home = require('x-root-path');
var session = require('express-session');
var debug = require('debug')('jiajiao:login');
var BACKEND = require(home+'../../config/backend').BACKEND;
var request = require('superagent');
module.exports=function(router){
	//学生教师登录
	router.get("/student",function(req,res,next){
		console.log(req.session);
		if(req.session.user&& req.session.user.code==="2"){
				res.redirect("http://"+req.session.user.url);
		}else{
			res.render('login/index.ejs',{
			title:'登录',
			showtitle:'学生教师登录',
			aurl:'/register/student',
			type:"student"
		});
		}
		
	});
	//学生家长登录
		router.get("/parent",function(req,res,next){
			console.log(req.session);
			if(req.session.user&&req.session.user.code==="1"){
					res.redirect("http://"+req.session.user.url);
			}else{
				res.render('login/index.ejs',{
					title:'登录',
					showtitle:'学生家长登录',
					aurl:'/register/parent',
					type:"parent"
				});
			}
		
	});
		//注销
		router.get("/logout",function(req,res,next){
			var usertype =req.query.user;
			delete req.session.user;
		if(usertype === "student"){
				res.redirect("/login/student/");
		}else{
			res.redirect("/login/parent/");
		}
		
	});

 //登录验证
	router.post("/log_in",function(req,res,next){
		console.log(BACKEND+"/logIn.do");
		console.log(req.body);
		var user = {};
		user.username = req.body.username;
		user.password = req.body.password;
		//1代表登录，0代表未登录。
		user.state = 1;
		request.get(BACKEND+"/logIn.do")
			.query(req.body)
			.end(function(requ,resp){
				var baseurl = req.headers.host+"/";
				console.log(baseurl);
				var data={};
				if(resp.text ==="0"){
					data.code = "0";
					data.url = "";
					res.send(JSON.stringify(data));

				}else if(resp.text ==="1"){
					data.code = "1";
					data.url = baseurl+"parent";
					user.url = data.url;
					user.code = data.code;
					req.session.user=user;
					res.send(JSON.stringify(data));
				}else{
					data.code = "2";
					data.url = baseurl+"student";
					user.url = data.url;
					user.code = data.code;
					req.session.user=user;
					res.send(JSON.stringify(data));
				}
				
			});
	});

}
