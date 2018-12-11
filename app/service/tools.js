'use strict';
const svgCaptcha = require('svg-captcha');
const md5 = require('md5');
const sd = require('silly-datetime');
const path = require('path');
const mkdirp = require('mz-modules/mkdirp');
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

  async  getUploadFile(filename){
    // 1、获取当前日期     20180920
      var day=sd.format(new Date(), 'YYYYMMDD');
    //2、创建图片保存的路径
      var dir=path.join(this.config.uploadDir,day);
      await mkdirp(dir);
      var d=new Date();
      d=d.getTime();   /*毫秒数*/
      //返回图片保存的路径
      var uploadDir=path.join(dir,d+path.extname(filename));
      // app\public\admin\upload\20180914\1536895331444.png
      return {
        uploadDir:uploadDir,
        saveDir:uploadDir.slice(3).replace(/\\/g,'/')
      }
  }
}

module.exports = ToolsService;
