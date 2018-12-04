'use strict';
const svgCaptcha = require('svg-captcha');
const md5 = require('md5');
const Service = require('egg').Service;

class ToolsService extends Service {
  // 生成验证码
  async captcha() {
    var capctcha = svgCaptcha.create({ 
        size:6,
        fontSize: 50, 
        width: 100, 
        height:40,
        background:"#cc9966" 
      })
    this.ctx.session.code = capctcha.text;
    console.log("验证码"+this.ctx.session.code)
    return capctcha
  }

  // md5
  async md5(str){
    return md5(str);
  }
}

module.exports = ToolsService;
