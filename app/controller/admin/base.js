'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
  async success(redirectUrl,message) {
    // this.ctx.body = '成功'
    await this.ctx.render('admin/public/success',{
        redirectUrl:redirectUrl,
        message:message || '操作成功'
    })
  }
  async error(redirectUrl,message) {
    // this.ctx.body = '失败'
    await this.ctx.render('admin/public/error',{
        redirectUrl:redirectUrl,
        message: message|| '操作失败'
    })
  }

  async verify(){
      var captcha = await this.service.tools.captcha();
      this.ctx.response.type="image/svg+xml";
      // console.log(captcha.data)
      this.ctx.body = captcha.data
  }
}

module.exports = BaseController;
