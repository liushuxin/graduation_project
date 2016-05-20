/**
 * 家教兼职信息平台测试页面。
 */
var express = require('express');
var home = require('x-root-path');
module.exports = function(router){
  router.get('/', function(req, res, next) {
    res.render('test/index', { title: '测试页面' });
  });

};