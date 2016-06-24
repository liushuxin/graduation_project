/**
 *评价操作。
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
	router.get("/",function(req,res,next){

res.render("contact/index.ejs",{
	title:"合作交流"
})
	});
	//获得学校名称
	router.post("/addYijian",function(req,resp,next){
		var getschoolurl = BACKEND+"/addPJ.do";
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

