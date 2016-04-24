/**
 * 家教兼职信息平台。
 */
var express = require('express');
var router = express.Router();
module.exports = function(router){
  router.get('/', function(req, res, next) {
    res.render('index', { title: '欢迎来到家教兼职信息交流平台' });
  });

};