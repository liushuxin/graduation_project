/**
 * 家教兼职信息平台。
 */
var express = require('express');
var home = require('x-root-path');
var formidable = require('formidable');
module.exports = function(router){
  router.get('/', function(req, res, next) {

    res.render('index', { title: '欢迎来到家教兼职信息交流平台' });
  });
  router.get('/introduce', function(req, res, next) {

    res.render('introduce/introduce.ejs', { title: '欢迎来到家教兼职信息交流平台' });
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
       res.send("上传出现问题");
     });
    form.on('end', function() {
      res.send("上传成功");
    });
  });

};