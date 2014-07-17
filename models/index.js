// index.js mysql orm initial

var fs        = require('fs')
var path      = require('path');
var Sequelize = require('sequelize');
var lodash    = require('lodash');
var db        = {};
var sequelize = new Sequelize('hercules_rag', 'alienroapi', '7Pj3MfBcPptZ', {
    dialect : "mysql",
    port    : 33306,
    define  : { engine: 'MYISAM' }
  });
var models = [
  'login',
  'char'
];
models.forEach(function(file) {
  var model = sequelize.import(path.join(__dirname, file));
  db[model.name] = model;
});

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

module.exports = lodash.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db);