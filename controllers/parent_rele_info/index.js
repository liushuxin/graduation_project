/**
 * 学生家长发布的兼职信息操作逻辑。
 */
var express = require('express');
var home = require('x-root-path');
var url = require('url');
var debug = require('debug')('jiajiao:prent_rele_info');
//获得后端地址
var BACKEND = require(home+'../../config/backend').BACKEND;
var request = require('superagent');
module.exports = function(router){
	//获得自己发布的兼职信息
	router.post("/getWorkInfo",function(req,resp,next){
		var getschoolplaceurl = BACKEND+"/parent/QueryJianzhiP.do";
		console.log(getschoolplaceurl);
		console.log(req.body);
			request
				.get(getschoolplaceurl)
				.query(req.body)
				.query({username:req.session.user.username})
				.set('Content-Type', 'application/json')
				.accept('application/json')
				.end(function(req,res,next){
					console.log(res.text);
						resp.send(res.text);

				});

	});
		router.post("/getWorkInfoS",function(req,resp,next){
		var getschoolplaceurl = BACKEND+"/parent/QueryJianzhiS.do";
		console.log(getschoolplaceurl);
		console.log(req.body);
			request
				.get(getschoolplaceurl)
				.query(req.body)
				.query({username:req.session.user.username})
				.set('Content-Type', 'application/json')
				.accept('application/json')
				.end(function(req,res,next){
					console.log(res.text);
						resp.send(res.text);

				});

	});
//新增兼职信息
	router.post("/addJobInfo",function(req,resp,next){
		var getschoolplaceurl = BACKEND+"/parent/addJobInfo.do";
		console.log(getschoolplaceurl);
		console.log(req.body);
			request
				.get(getschoolplaceurl)
				.query(req.body)
				.query({username:req.session.user.username})
				.set('Content-Type', 'application/json')
				.accept('application/json')
				.end(function(req,res,next){
					console.log(res.text);
						resp.send(res.text);

				});

	});
//修改发布的兼职信息
	router.post("/modifyJobInfo",function(req,resp,next){
		var getschoolplaceurl = BACKEND+"/parent/modifyJobInfo.do";
		console.log(getschoolplaceurl);
		console.log(req.body);
			request
				.get(getschoolplaceurl)
				.query(req.body)
				.set('Content-Type', 'application/json')
				.accept('application/json')
				.end(function(req,res,next){
					console.log(res.text);
						resp.send(res.text);
				});

	});

	
	
}

