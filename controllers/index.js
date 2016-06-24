/**
 * 家教兼职信息平台。
 */
var express = require('express');
var home = require('x-root-path');
var debug = require('debug')('jiajiao:register');
var BACKEND = require(home+'../config/backend').BACKEND;
var request = require('superagent');
var reque = require('request');
var formidable = require('formidable');
module.exports = function(router){
  router.get('/', function(req, res, next) {

    res.render('index', { title: '欢迎来到家教兼职信息交流平台' });
  });
  //获得金牌教师
  router.get('/getGoldTeacher', function(req, resp, next) {
    var baseurl = BACKEND+"/student/getGoldTeacher.do";
    request
      .get(baseurl)
      .type("json")
      .end(function(req,res,next){ 
        resp.send(res.text);
      });

    
  });
  //关于，简介
  router.get('/introduce', function(req, res, next) {

    res.render('introduce/introduce.ejs', { title: '欢迎来到家教兼职信息交流平台' });
  });

  //热门城市
  router.get('/hot_city', function(req, res, next) {

    res.render('hot_city/index.ejs', 
      { title: '热门城市' });
  });
  
   router.post('/formtest', function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = home+"/public/dir/file";
    form.keepExtensions = false;
    form.maxFieldsSize = 2 * 1024 * 1024;
    form.maxFields = 1000;
   
     form.parse(req, function(err, fields, files) {
       console.log(fields);
       console.log(files);
    });
     form.on('file', function(name, file) {
       console.log(name);
       console.log(file.name);
     });
     form.on('error', function(err) {
       var   map ={error:"EventAction.picture.failed"};//返回结果
      res.send(JSON.stringify(map));
     });
    form.on('end', function() {
     var   map ={result:"OK"};//返回结果
      res.send(JSON.stringify(map));
    });
  });

};