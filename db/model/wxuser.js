//
//用户数据模型
const { sequelize } = require("../sequelize");
// const { sequelize_pengwin } = require("../sequelize_pengwin");
const { DataTypes, Model } = require("sequelize");

// const message = sequelize_pengwin.define(
//   "crm_wechat_message",
//   {
//     id: {
//       type: DataTypes.INTEGER, //varchar(255)
//       allowNull: true, //不为空
//       primaryKey: true, //主键
//     },
//     type_name: {
//       type: DataTypes.STRING,
//     },
//     appid: {
//       type: DataTypes.STRING,
//     },
//     msg_id: {
//       type: DataTypes.STRING,
//     },
//     wxid: {
//       type: DataTypes.STRING,
//     },
//     msg_flag: {
//       type: DataTypes.STRING,
//     },
//     from_user_name: {
//       type: DataTypes.STRING,
//     },
//     to_user_name: {
//       type: DataTypes.STRING,
//     },
//     send_msg_wxid: {
//       type: DataTypes.STRING,
//     },
//     send_msg_wx_nickname: {
//       type: DataTypes.STRING,
//     },
//     data: {
//       type: DataTypes.JSON,
//     },
//     group_id: {
//       type: DataTypes.STRING,
//     },
//     add_time: {
//       type: DataTypes.DATE,
//     },
//     update_time: {
//       type: DataTypes.DATE,
//     },
//   },
//   {
//     // 如果为 true 则表的名称和 model 相同，即 user
//     // 为 false MySQL创建的表名称会是复数 users
//     // 如果指定的表名称本就是复数形式则不变
//     timestamps: false, //去除createAt updateAt
//     freezeTableName: true, // 使用自定义表名
//   }
// );

class message extends Model {}
message.init(
  {
    id: {
      type: DataTypes.INTEGER, //varchar(255)
      allowNull: true, //不为空
      primaryKey: true, //主键
    },
    TypeName: {
      type: DataTypes.STRING,
    },
    Appid: {
      type: DataTypes.STRING,
    },
    Wxid: {
      type: DataTypes.STRING,
    },
    msgFlag: {
      type: DataTypes.STRING,
    },
    Data: {
      type: DataTypes.JSON,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "message", //数据表
    createdAt: true,
    updatedAt: true,
    sequelize, //数据库连接
  }
);

//创建数据模型
class wxuser extends Model {}
wxuser.init(
  {
    id: {
      type: DataTypes.INTEGER, //varchar(255)
      allowNull: true, //不为空
      primaryKey: true, //主键
    },
    username: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    wxid: {
      type: DataTypes.STRING,
    },
    token: {
      type: DataTypes.STRING,
    },
    appId: {
      type: DataTypes.STRING,
    },
    uuid: {
      type: DataTypes.STRING,
    },
    headImgUrl: {
      type: DataTypes.STRING,
    },
    nickName: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    openState: {
      type: DataTypes.INTEGER,
    },
    loginInfo: {
      type: DataTypes.JSON,
    },
    contactsList: {
      type: DataTypes.JSON,
    },
    personalInfo: {
      type: DataTypes.JSON,
    },
  },
  {
    tableName: "wxuser", //数据表
    createdAt: false,
    updatedAt: false,
    sequelize, //数据库连接
  }
);

//创建通讯录数据模型
class contacts extends Model {}
contacts.init(
  {
    id: {
      type: DataTypes.INTEGER, //varchar(255)
      allowNull: true, //不为空
      primaryKey: true, //主键
    },
    wx_user_id: {
      type: DataTypes.STRING,
    },
    userName: {
      type: DataTypes.STRING,
    },
    nickName: {
      type: DataTypes.STRING,
    },
    alias: {
      type: DataTypes.STRING,
    },
    sex: {
      type: DataTypes.STRING,
    },
    smallHeadImgUrl: {
      type: DataTypes.STRING,
    },
    signature: {
      type: DataTypes.STRING,
    },
    snsBgImg: {
      type: DataTypes.STRING,
    },
    isGroup: {
      type: DataTypes.INTEGER,
    },
    detailInfo: {
      type: DataTypes.JSON,
    },
  },
  {
    tableName: "contacts", //数据表
    createdAt: false,
    updatedAt: false,
    sequelize, //数据库连接
  }
);

//创建定时任务表模型
class schedule extends Model {}
schedule.init(
  {
    id: {
      type: DataTypes.INTEGER, //varchar(255)
      allowNull: true, //不为空
      primaryKey: true, //主键
    },
    taskName: {
      type: DataTypes.STRING,
    },
    wx_user_id: {
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.STRING,
    },
    toWxIDs: {
      type: DataTypes.JSON,
    },
    time: {
      type: DataTypes.STRING,
    },
    isLoop: {
      type: DataTypes.STRING,
    },
    hasExpired: {
      type: DataTypes.INTEGER,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    modelType: {
      type: DataTypes.STRING,
    },
    sendModelType: {
      type: DataTypes.STRING,
    },
    modelApiUrl: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "schedule", //数据表
    createdAt: true,
    updatedAt: true,
    sequelize, //数据库连接
  }
);

module.exports = {
  wxuser,
  contacts,
  schedule,
  message,
};
