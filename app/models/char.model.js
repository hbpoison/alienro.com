'use strict';

/**
 * [exports description]
 * @param  {[type]} sequelize [description]
 * @param  {[type]} DataTypes [description]
 * @return {[type]}           [description]
 */
module.exports = function(sequelize, DataTypes) {
  var Char = sequelize.define('Char', {
    char_id: {
      type          : DataTypes.INTEGER(11).UNSIGNED,
      allowNull     : false,
      primaryKey    : true,
      autoIncrement : true
    },
    account_id: {
      type         : DataTypes.INTEGER(11).UNSIGNED,
      allowNull    : false,
      defaultValue : 0
    },
    char_num: {
      type         : DataTypes.INTEGER(1),
      allowNull    : false,
      defaultValue : 0
    },
    name: {
      type         : DataTypes.STRING(30),
      allowNull    : false,
      defaultValue : '',
      unique       : 'name_key'
    },
    class: {
      type         : DataTypes.INTEGER(6).UNSIGNED,
      allowNull    : false,
      defaultValue : 0
    },
    base_level: {
      type         : DataTypes.INTEGER(6).UNSIGNED,
      allowNull    : false,
      defaultValue : 1
    },
    job_level: {
      type         : DataTypes.INTEGER(6).UNSIGNED,
      allowNull    : false,
      defaultValue : 1
    },
    base_exp: {
      type         : DataTypes.BIGINT(20).UNSIGNED,
      allowNull    : false,
      defaultValue : 0
    },
    job_exp: {
      type         : DataTypes.BIGINT(20).UNSIGNED,
      allowNull    : false,
      defaultValue : 0
    },
    zeny: {
      type         : DataTypes.INTEGER(11).UNSIGNED,
      allowNull    : false,
      defaultValue : 0
    },
    str: {
      type         : DataTypes.INTEGER(4).UNSIGNED,
      allowNull    : false,
      defaultValue : 0
    },
    agi: {
      type         : DataTypes.INTEGER(4).UNSIGNED,
      allowNull    : false,
      defaultValue : 0
    },
    vit: {
      type         : DataTypes.INTEGER(4).UNSIGNED,
      allowNull    : false,
      defaultValue : 0
    },
    int: {
      type         : DataTypes.INTEGER(4).UNSIGNED,
      allowNull    : false,
      defaultValue : 0
    },
    dex: {
      type         : DataTypes.INTEGER(4).UNSIGNED,
      allowNull    : false,
      defaultValue : 0
    },
    luk: {
      type         : DataTypes.INTEGER(4).UNSIGNED,
      allowNull    : false,
      defaultValue : 0
    },
    max_hp: {
      type: DataTypes.INTEGER(8).UNSIGNED,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    timestamps      : false,
    underscored     : true,
    freezeTableName : true,
    tableName       : 'char'
  });

  return Char;
};