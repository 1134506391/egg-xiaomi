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
  //公共删除的方法
  async delete(){
      // 1.获取要删除的数据库存表 model
  // 2.获取要删除数据的_id
  // 3.执行删除
  // 4.返回到以前的页面
    var model = this.ctx.request.query.model;
    var id = this.ctx.request.query.id;
    await this.ctx.model[model].deleteOne({"_id":id});
    this.ctx.redirect(this.ctx.state.prevPage)
  }

}

module.exports = BaseController;
