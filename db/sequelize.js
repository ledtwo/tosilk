//连接数据库
const Sequelize = require("sequelize");
const config = require("../config/dbconfig.js");

const conf = {
  host: config.host,
  dialect: config.db,
};

const sequelize = new Sequelize(config.database, config.username, config.password, conf);

sequelize
  .authenticate()
  .then(() => {
    console.log("连接数据库成功~");
  })
  .catch((err) => {
    console.log("连接数据库失败~", err);
  });

module.exports = { sequelize };
