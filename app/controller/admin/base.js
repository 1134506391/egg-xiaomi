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

  // 改变状态
  async changeStatus(){
    var model = this.ctx.request.query.model;
    var attr = this.ctx.request.query.attr;
    var id = this.ctx.request.query.id;

    var result = await this.ctx.model[model].find({"_id":id});
    if(result.length >0){
      if(result[0][attr] == 1){
        var json = {
          [attr]:0
        }
      }else{
        var json = {
          [attr]:1
        }
      }
      var updateResult = await this.ctx.model[model].updateOne({"_id":id},json);
      if(updateResult){
        this.ctx.body = {"message":"更新成功","success":true}
      }else{
        this.ctx.body = {"message":"更新失败","success":false}
      }
    }else{
      this.ctx.body = {"message":"更新失败,参数错误","success":false}
    }
  }
  //改变排序
  async editNum(){
    var model = this.ctx.request.query.model;
    var attr = this.ctx.request.query.attr;
    var id = this.ctx.request.query.id;
    var num = this.ctx.request.query.num;

    var result = await this.ctx.model[model].find({"_id":id});
    if(result.length >0){
      var json = {
        [attr]:num
      }
      var updateResult = await this.ctx.model[model].updateOne({"_id":id},json);
      if(updateResult){
        this.ctx.body = {"message":"更新成功","success":true}
      }else{
        this.ctx.body = {"message":"更新失败","success":false}
      }
    }else{
      this.ctx.body = {"message":"更新失败,参数错误","success":false}
    }
  }

}

module.exports = BaseController;
