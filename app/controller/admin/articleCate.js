
const fs=require('fs');

const pump = require('mz-modules/pump');

var BaseController =require('./base.js');
class ArticleCateController extends BaseController {
    async index() {

        var result=await this.ctx.model.ArticleCate.aggregate([
        
            {
              $lookup:{
                from:'article_cate',
                localField:'_id',
                foreignField:'pid',
                as:'items'      
              }      
           },
           {
              $match:{
                "pid":'0'
              }
           }
        
        ])
          
       
        await this.ctx.render('admin/articleCate/index',{
  
          list:result
        });
        
    }
    async add() {


        var result=await this.ctx.model.ArticleCate.find({"pid":'0'});
        
                
        await this.ctx.render('admin/articleCate/add',{

            cateList:result
        });

    }

    async doAdd() {
            
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

           //生成缩略图
           this.service.tools.jimpImg(target);

            
        }         
        

        if(parts.field.pid!=0){    
            parts.field.pid=this.app.mongoose.Types.ObjectId(parts.field.pid);    //调用mongoose里面的方法把字符串转换成ObjectId      
           
        }
        
        let articleCate =new this.ctx.model.ArticleCate(Object.assign(files,parts.field));
        await articleCate.save();

        await this.success('/admin/articleCate','增加分类成功');

    }


    async edit() {


        var id=this.ctx.request.query.id;

        var result=await this.ctx.model.ArticleCate.find({"_id":id});

        var cateList=await this.ctx.model.ArticleCate.find({"pid":'0'});
        
                
        await this.ctx.render('admin/articleCate/edit',{

            cateList:cateList,
            list:result[0]
        });

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


           //生成缩略图
           this.service.tools.jimpImg(target);
            
        }     
        

        if(parts.field.pid!=0){    
            parts.field.pid=this.app.mongoose.Types.ObjectId(parts.field.pid);    //调用mongoose里面的方法把字符串转换成ObjectId      
           
        }        
      
        var id=parts.field.id;
        var updateResult=Object.assign(files,parts.field);

        await this.ctx.model.ArticleCate.updateOne({"_id":id},updateResult);
        
        await this.success('/admin/articleCate','修改分类成功');

    }
   
   
}
module.exports = ArticleCateController;