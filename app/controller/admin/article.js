
const fs=require('fs');

const pump = require('mz-modules/pump');

var BaseController =require('./base.js');
class ArticleController extends BaseController {
    async index() {

        

      var page=this.ctx.request.query.page || 1;

      var pageSize=3;


      //总数量
      var totalNum=await this.ctx.model.Article.find({}).count();



      /*
                
         var goodsResult=await this.ctx.model.Goods.find({}).skip((page-1)*pageSize).limit(pageSize);
         
      */


      //让文章和分类进行关联

         var result=await this.ctx.model.Article.aggregate([
          
            {
                $lookup:{
                  from:'article_cate',
                  localField:'cate_id',
                  foreignField:'_id',
                  as:'catelist'      
                }      
            },
            {
              $skip:(page-1)*pageSize
            },
            {
              $limit:pageSize
            }
        
        ])

        console.log(result);
      
       
        await this.ctx.render('admin/article/index',{  
          list:result,
          totalPages:Math.ceil(totalNum/pageSize),
          page:page
        });
        
    }
    async add() {       

        //获取所有的分类
        var cateResult=await this.ctx.model.ArticleCate.aggregate([
        
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

                
        await this.ctx.render('admin/article/add',{

            cateList:cateResult
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
        
        let article =new this.ctx.model.Article(Object.assign(files,parts.field));
        await article.save();

        await this.success('/admin/article','增加文章成功');

    }


    async edit() {

        var id=this.ctx.request.query.id;

        //当前id对应的数据
        var result=await this.ctx.model.Article.find({"_id":id});

        //获取所有的分类
        var cateResult=await this.ctx.model.ArticleCate.aggregate([
        
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
        
        ]);
                
        await this.ctx.render('admin/article/edit',{
            cateList:cateResult,
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
        

      
        var id=parts.field.id;
        
        var updateResult=Object.assign(files,parts.field);

        await this.ctx.model.Article.updateOne({"_id":id},updateResult);
        
        await this.success('/admin/article','修改数据成功');

    }
   
   
}
module.exports = ArticleController;