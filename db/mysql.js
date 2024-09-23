//scr-db-mysql.js
//数据库的增删改查
const { wxuser, contacts, schedule, message } = require("./model/wxuser");
// 回调创建消息
async function createMessage(data, msgFlag) {
  const dbItem = await message.create({
    ...data,
    msgFlag: msgFlag, // 'send':发送消息  'accept':接收消息
  });
  return dbItem;
}

// 查询用户列表
async function selectQuery(data) {
  const isUser = await wxuser.findAll({
    where: {
      ...data,
    },
  });
  return isUser;
}

// 查询用户列表
async function searchUser(data) {
  const isUser = await wxuser.findOne({
    where: {
      ...data,
    },
  });
  return isUser;
}

// 创建/更新用户
async function addUser(data) {
  // 先查询有没有相同nickName的用户，如果有则不新建，更新现有用户信息
  const isSameUser = await wxuser.findOne({
    where: {
      nickName: data.nickName,
    },
  });
  if (isSameUser) {
    const isUser = await wxuser.update(
      {
        ...data,
      },
      {
        where: {
          nickName: data.nickName,
        },
      }
    );
  } else {
    // 否则新建
    const isUser = await wxuser.create({
      ...data,
    });
  }
  const newUserInfo = await wxuser.findOne({
    where: {
      wxid: data.wxid,
    },
  });
  return newUserInfo;
}

// 更新用户信息
async function updateUser(data) {
  const isUser = await wxuser.update(
    {
      ...data,
    },
    {
      where: {
        id: data.id,
      },
    }
  );
  return isUser;
}

// 删除用户
async function deleteUser(data) {
  const isUser = await wxuser.destroy({
    where: {
      id: data.id,
    },
  });
  return isUser;
}

// 创建/更新联系人
async function updateContacts(data) {
  // 先查询有没有相同nickName的用户，如果有则不新建，更新现有用户信息
  const isSameUser = await contacts.findOne({
    where: {
      userName: data.userName,
      wx_user_id: data.wx_user_id,
    },
  });
  if (isSameUser) {
    const isUser = await contacts.update(
      {
        ...data,
      },
      {
        where: {
          userName: data.userName,
          wx_user_id: data.wx_user_id,
        },
      }
    );
    return isUser;
  }
  // 否则新建
  const isUser = await contacts.create({
    ...data,
  });
  return isUser;
}

// 查询通讯录
async function getContactsList(data) {
  const isUser = await contacts.findAll({
    where: {
      ...data,
    },
  });
  return isUser;
}

// 查询定时任务
async function getScheduleList(data) {
  const isUser = await schedule.findAll({
    where: {
      ...data,
    },
  });
  return isUser;
}

// 创建/更新定时任务
async function updateSchedule(data) {
  // 先查询有没有相同的定时任务，如果有则不新建，更新现有信息
  const isSame = await schedule.findOne({
    where: {
      id: data?.id,
      wx_user_id: data.wx_user_id,
    },
  });
  if (isSame) {
    const newItem = await schedule.update(
      {
        ...data,
      },
      {
        where: {
          id: data?.id,
          wx_user_id: data.wx_user_id,
        },
      }
    );
    return newItem;
  }
  // 否则新建
  const newItem = await schedule.create({
    ...data,
  });
  return newItem;
}

// 获取聊天记录
async function getChatRecord(data) {
  const records = await message.findAll({
    where: {
      ...data,
    },
  });
  return records;
}

module.exports = {
  createMessage,
  selectQuery,
  searchUser,
  addUser,
  updateUser,
  deleteUser,
  updateContacts,
  getContactsList,
  getScheduleList,
  updateSchedule,
  getChatRecord,
};
