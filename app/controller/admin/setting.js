'use strict';
const fs=require('fs');

const pump = require('mz-modules/pump');
var BaseController =require('./base.js');

class SettingController extends BaseController {
      async index() {

         //提前给setting表增加一条数据
         var result=await this.ctx.model.Setting.find({});
        console.log(JSON.stringify(result))
        if(result){
            await this.ctx.render('admin/setting/index',{

                list:result[0]
               });
              
        }else{
            await this.ctx.render('admin/setting/index');
              
        }
      }     
    
     
      async doEdit() {    
            

            let parts = this.ctx.multipart({ autoFields: true });
            let files = {};               
            let stream;
            while ((stream = await parts()) != null) {
                  if (!stream.filename) {          
                  break;
                  }       
                  let fieldname = stream.fieldname;  //file表单的名字

                  //上传图片的目录
                  let dir=await this.service.tools.getUploadFile(stream.filename);
                  let target = dir.uploadDir;
                  let writeStream = fs.createWriteStream(target);

                  await pump(stream, writeStream);  

                  files=Object.assign(files,{
                  [fieldname]:dir.saveDir    
                  })
                  
            }      

            //修改操作          

            var updateResult=Object.assign(files,parts.field);           

            await this.ctx.model.Setting.updateOne({},updateResult);
            
            await this.success('/admin/setting','修改系统设置成功');     

      



      } 
}

module.exports = SettingController;
