/**
 * 学生教师发布的兼职信息操作逻辑。
 */
var express = require('express');
var home = require('x-root-path');
var url = require('url');
var debug = require('debug')('jiajiao:prent_rele_info');
//获得后端地址
var BACKEND = require(home+'../../config/backend').BACKEND;
var request = require('superagent');
module.exports = function(router){
	//获得学校所在地
	router.post("/addJobInfo",function(req,resp,next){
		var getschoolplaceurl = BACKEND+"/student/addJobInfo.do";
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
		var getschoolplaceurl = BACKEND+"/student/modifyJobInfo.do";
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
	
		router.get("/getJobInfo",function(req,resp,next){
			var getschoolplaceurl = BACKEND+"/student/getJobInfo.do";
			console.log(getschoolplaceurl);
			console.log(req.body);
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
	
		router.get("/getJobInfoP",function(req,resp,next){
			var getschoolplaceurl = BACKEND+"/student/getJobInfoP.do";
			console.log(getschoolplaceurl);
			console.log(req.body);
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
		//初始化页面
		router.get("/showLearnZiliao",function(req,resp,next){
				
			resp.render("show_learn_ziyuan/index.ejs",{
				title:"学习资源分享"
			});
		});
		//获得资源信息
			router.get("/getLearn",function(req,resp,next){
			var getschoolplaceurl = BACKEND+"/student/showLearnZiliao.do";
			console.log(getschoolplaceurl);
			console.log(req.body);
				request
					.get(getschoolplaceurl)
					.query(req.query)
					.set('Content-Type', 'application/json')
					.accept('application/json')
					.end(function(req,res,next){
						console.log(res.text);
							resp.send(res.text);
					});

		});
		
	
	
}

