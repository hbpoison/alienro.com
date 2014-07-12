module.exports = function(sequelize, DataTypes) {
  var Login = sequelize.define('Login', {
    account_id: {
      type          : DataTypes.INTEGER(11).UNSIGNED,
      allowNull     : false,
      primaryKey    : true,
      autoIncrement : true
    },
    userid: {
      type         : DataTypes.STRING(23),
      allowNull    : false,
      defaultValue : '',
      unique       : 'name'
    },
    user_pass: {
      type         : DataTypes.STRING(32),
      allowNull    : false,
      defaultValue : ''
    },
    sex: {
      type         : DataTypes.ENUM('M', 'F', 'S'),
      allowNull    : false,
      defaultValue : 'M'
    },
    email: {
      type         : DataTypes.STRING(39),
      allowNull    : false,
      defaultValue : ''
    },
    group_id: {
      type         : DataTypes.INTEGER(3),
      allowNull    : false,
      defaultValue : 0
    },
    state: {
      type         : DataTypes.INTEGER(11).UNSIGNED,
      allowNull    : false,
      defaultValue : 0
    },
    unban_time: {
      type         : DataTypes.INTEGER(11).UNSIGNED,
      allowNull    : false,
      defaultValue : 0
    },
    expiration_time: {
      type         : DataTypes.INTEGER(11).UNSIGNED,
      allowNull    : false,
      defaultValue : 0
    },
    logincount: {
      type         : DataTypes.INTEGER(9).UNSIGNED,
      allowNull    : false,
      defaultValue : 0
    },
    lastlogin: {
      type         : DataTypes.DATE,
      allowNull    : false,
      defaultValue : new Date(0)
    },
    last_ip: {
      type         : DataTypes.STRING(100),
      allowNull    : false,
      defaultValue : ''
    },
    birthdate: {
      type         : 'DATE',
      allowNull    : false,
      defaultValue : '0000-00-00'
    },
    character_slots: {
      type         : DataTypes.INTEGER(3).UNSIGNED,
      allowNull    : false,
      defaultValue : 0
    },
    pincode: {
      type         : DataTypes.STRING(4),
      allowNull    : false,
      defaultValue : ''
    },
    pincode_change: {
      type         : DataTypes.INTEGER(11).UNSIGNED,
      allowNull    : false,
      defaultValue : 0
    }
  }, {
    timestamps      : false,
    underscored     : true,
    freezeTableName : true,
    tableName       : 'login'
  });
  
  return Login;
};