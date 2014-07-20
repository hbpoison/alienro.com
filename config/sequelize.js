'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    config = require('../config');

var MysqlOrm = function MysqlOrm() {
  var Sequelize = require('sequelize'),
      ragModels = ['login', 'char'],
      rag = null;

  this.initialize = function() {
    rag = {
      sequelize: new Sequelize(
        config.rag.database,
        config.rag.user,
        config.rag.password,
        {
          dialect: 'mysql',
          host: config.rag.host,
          port: config.rag.port,
          define: { engine: config.rag.engine }
        }
      )
    };
    ragModels.forEach(function(file) {
      var model = rag.sequelize.import(path.join(__dirname, '../app/models/' + file + '.model'));
      rag[model.name] = model;
    });
    Object.keys(rag).forEach(function(modelName) {
      if (modelName !== 'sequelize' && 'associate' in rag[modelName]) {
        rag[modelName].associate(rag);
      }
    });
  };

  this.authenticate = function(done) {
    rag.sequelize.authenticate().complete(done);
  };

  this.Seq = function() {
    return Sequelize;
  };

  this.model = function(name) {
    if (name in Object.keys(rag)) {
      return rag[name];
    }
    return null;
  };
};

MysqlOrm.instance = null;

MysqlOrm.getInstance = function() {
  if (this.instance === null) {
    this.instance = new MysqlOrm();
  }
  return this.instance;
};

module.exports = MysqlOrm.getInstance();
