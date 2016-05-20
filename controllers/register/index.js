/**
 * 注册操作
 */
var express = require('express');
var home = require('x-root-path');
var url = require('url');
var debug = require('debug')('jiajiao:register');
var BACKEND = require(home+'../../config/backend').BACKEND;
var request = require('superagent');
module.exports = function(router){
	var baseurl ="http://localhost:8080/jrjy";
	//学生教师注册初始化
	router.get('/student',function(req,res,next){
		res.redirect(baseurl+"/student/addStudent.do");
	});
	//学生家长注册
	router.get('/parent',function(req,res,next){
		res.redirect(baseurl+"/parent/addParent.do");
	});
	router.post('/ValidateUserName',function(req,resp,next){
		console.log(BACKEND+"/student/ValidateUserName");
		request
		.get(BACKEND+"/student/ValidateUserName.do")
		.query(req.body)
		.set('Content-Type', 'application/json')
		.accept('application/json')
		.end(function(req,res,next){
		
				//获得学校所在地
				var obj ={};
				obj.valid = res.text;
				resp.send(obj);

		});

	});
	//新增学生家长
	router.post('/addStudentTeacher',function(req,resp,next){
		console.log(BACKEND+"/student/addStudentTeacher");
		console.log(req.body);
		request
		.get(BACKEND+"/student/addStudentTeacher.do")
		.set('Content-Type', 'application/json')
		.query(req.body)
		.end(function(req,res,next){
		
				
				var data = JSON.stringify(res.text);
				console.log(data);
				if(data == "0"){
					console.log("HHHHHHHH");
					resp.render('test/success.ejs',
						{title:'注册成功'});
				}else{
					console.log("BBBBB");
				}
				
			


		});

	});

	
	
}

