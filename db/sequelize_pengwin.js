//连接数据库
const Sequelize = require("sequelize");
const config = require("../config/dbconfig_pengwin.js");

const conf = {
  host: config.host,
  dialect: config.db,
};

const sequelize_pengwin = new Sequelize(config.database, config.username, config.password, conf);

sequelize_pengwin
  .authenticate()
  .then(() => {
    console.log("连接pengwin数据库成功~");
  })
  .catch((err) => {
    console.log("连接pengwin数据库失败~", err);
  });

module.exports = { sequelize_pengwin };
