'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1543801206350_4176';
  //图片上传地址
  config.uploadDir='app/public/admin/upload';
  // 中间件
  config.middleware = ['adminauth'];
  config.adminauth = {
    match:'/admin'
  }
  //配置session
  config.session = {
    key: 'SESSION_ID',
    maxAge: 864000,
    httpOnly: true,
    encrypt: true,
    renew: true //  延长会话有效期       
  }

  //多模板引擎配置
  config.view = {
    mapping: {
      '.html': 'ejs',

      '.nj': 'nunjucks'
    },
  };

  //数据库
  exports.mongoose = {
    client: {
      url: 'mongodb://admin:123456@127.0.0.1/eggxiaomi',
      options: {},
    }
  };
    //配置表单数量
    config.multipart = {
      fields: '50'
   };
  return config;
};