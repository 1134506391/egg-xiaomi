'use strict';

var BaseController = require('./base.js')

class LoginController extends BaseController {
  async index() {
    await this.ctx.render('admin/login')
  }
  //登录
  async doLogin() {
    console.log(this.ctx.request.body)
    var username = this.ctx.request.body.username;
    //密码md5加密
    var password = await this.service.tools.md5(this.ctx.request.body.password);
    var code = this.ctx.request.body.verify;
    //不区分验证码大小写
    if(code.toUpperCase()==this.ctx.session.code.toUpperCase()){
      var result = await this.ctx.model.Admin.find({"username":username,"password":password});
      console.log("查询数据库的用户密码")
      console.log(result)
      if(result.length>0){
        console.log("登录成功")
        //登录成功
        // 1.保存用户信息
        this.ctx.session.userinfo = result[0]
        // 2.跳转到用户中心
        this.ctx.redirect('/admin')
        
      }else{
        console.log("用户或者密码,登录失败")
        this.ctx.redirect('/admin/login','用户或者密码不对')
      }
    }else{
      console.log('验证码错误')
      await this.error('/admin/login','验证码错误')
    }
    
  }

  //退出登录
  async loginOut(){
    this.ctx.session.userinfo= null;
    this.ctx.redirect('/admin/login')
  }

  async adminAdd(){
    let admin  = new this.ctx.model.Admin({
      username:"admin",
      password:await this.service.tools.md5("123456")
    })
    admin.save()
    this.ctx.body = "adminAdd"
  }
}

module.exports = LoginController;
