/**
 * 公共方法
 */
var express = require('express');
var home = require('x-root-path');
var url = require('url');
var debug = require('debug')('jiajiao:org');
//获得后端地址
var BACKEND = require(home+'../../config/backend').BACKEND;
var request = require('superagent');
module.exports = function(router){
	//获得学校所在地
	router.get("/getIndex",function(req,resp,next){
		var getschoolplaceurl = BACKEND+"/student/QueryIndexBack.do";
		console.log(getschoolplaceurl);
			request
				.get(getschoolplaceurl)
				.query(req.query)
				.set('Content-Type', 'application/json')
				.accept('application/json')
				.end(function(req,res,next){
						resp.send(res.text);

				});

	});
	//获得学校名称
	router.get("/getXXMC",function(req,resp,next){
		var getschoolurl = BACKEND+"/student/QuerySchoolBack.do";
		console.log(getschoolurl);
			request
				.get(getschoolurl)
				.query(req.query)
				.set('Content-Type', 'application/json')
				.accept('application/json')
				.end(function(req,res,next){
						resp.send(res.text);
				});

	});
	
	
}

