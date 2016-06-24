/**
 * 字典表code与name 之间的转化
 * @type {String}
 */
'use strict';
require.config({
  baseUrl:'/javascripts',
  shim: {
      'lib/bootstrap': {
        deps: ['lib/jquery']
      }
  }
});

define([
  'lib/jquery','lib/lodash','lib/ractive','lib/superagent','text!template/ractive/codetoname.html','lib/bootstrap'],
  function($, _,Ractive,request,dirTemplate){


        var DIRComponent = Ractive.extend({
          template: dirTemplate,
          oninit: function () {
            var self = this;
            var tablename = self.get("tableName");
            var codeval = self.get("codevalue");
            request
              .get("/org/getIndex")
              .query({index:tablename})
              .end(function(err,res){
                if(!err){
                var dataBody = JSON.parse(res.text);
              var temp = _.find(dataBody,'ID',codeval);
              self.set("name",temp.NAME);
                }
              });
            },
          data: {
              name: '',
              tableName:'',
              codevalue:''
            }
        });
        Ractive.components.dictionary = DIRComponent;
        return DIRComponent;

 });
