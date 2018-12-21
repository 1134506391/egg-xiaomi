'use strict';

var BaseController =require('./base.js');

const fs=require('fs');
const pump = require('mz-modules/pump');


class GoodsController extends BaseController {
      async index() { 
        

         var page=this.ctx.request.query.page || 1;



         var keyword=this.ctx.request.query.keyword;


         //注意
         var json={};
         if(keyword){
            json=Object.assign({"title":{$regex:new RegExp(keyword)}});
         }


         var pageSize=3;
        
         //获取当前数据表的总数量

         var totalNum=await this.ctx.model.Goods.find(json).count();

         var goodsResult=await this.ctx.model.Goods.find(json).skip((page-1)*pageSize).limit(pageSize);
         
      
          await this.ctx.render('admin/goods/index',{
            list:goodsResult,
            totalPages:Math.ceil(totalNum/pageSize),
            page:page,
            keyword:keyword

          });
      }     
    
      async add() {

        //获取所有的颜色值
        var colorResult=await this.ctx.model.GoodsColor.find({});

        //获取所有的商品类型
        var goodsType=await this.ctx.model.GoodsType.find({});

        //获取商品分类

        var goodsCate=await this.ctx.model.GoodsCate.aggregate([
        
          {
            $lookup:{
              from:'goods_cate',
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


      
        await this.ctx.render('admin/goods/add',{

          colorResult:colorResult,
          goodsType:goodsType,
          goodsCate:goodsCate
        });
        
      }  
      
      
      async edit() {


        //获取修改数据的id

        var id=this.ctx.request.query.id;

        //获取所有的颜色值
        var colorResult=await this.ctx.model.GoodsColor.find({});

        //获取所有的商品类型
        var goodsType=await this.ctx.model.GoodsType.find({});

        //获取商品分类

        var goodsCate=await this.ctx.model.GoodsCate.aggregate([
        
            {
              $lookup:{
                from:'goods_cate',
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


        //获取修改的商品

        var goodsResult=await this.ctx.model.Goods.find({'_id':id});

       

        //获取当前商品的颜色
        // 5bbb68dcfe498e2346af9e4a,5bbb68effe498e2346af9e4b,5bc067d92e5f889dc864aa96


        if(goodsResult[0].goods_color.length>0){
            var colorArrTemp=goodsResult[0].goods_color.split(',');
            // console.log(colorArrTemp);
            var goodsColorArr=[];

            colorArrTemp.forEach((value)=>{
              goodsColorArr.push({"_id":value})
            })
            var goodsColorReulst=await this.ctx.model.GoodsColor.find({
              $or:goodsColorArr
            })
        }else{
          var goodsColorReulst=[];
        }


        // console.log(colorReulst);

        //获取规格信息 

        var goodsAttsResult=await this.ctx.model.GoodsAttr.find({"goods_id":goodsResult[0]._id}); 

        var goodsAttsStr='';

        goodsAttsResult.forEach(async (val)=>{

            if(val.attribute_type==1){    

              goodsAttsStr+=`<li><span>${val.attribute_title}: 　</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />  <input type="text" name="attr_value_list"  value="${val.attribute_value}" /></li>`;
            }else if(val.attribute_type==2){
              goodsAttsStr+=`<li><span>${val.attribute_title}: 　</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />  <textarea cols="50" rows="3" name="attr_value_list">${val.attribute_value}</textarea></li>`;
            }else{
                //获取 attr_value  获取可选值列表
                var oneGoodsTypeAttributeResult=await this.ctx.model.GoodsTypeAttribute.find({
                  _id:val.attribute_id
                })

                var arr=oneGoodsTypeAttributeResult[0].attr_value.split('\n'); 

                goodsAttsStr+=`<li><span>${val.attribute_title}: 　</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />`;

                goodsAttsStr+=`<select name="attr_value_list">`;
                        
                        for(var j=0;j<arr.length;j++){

                          if(arr[j]==val.attribute_value){
                            goodsAttsStr+=`<option value="${arr[j]}" selected >${arr[j]}</option>`;
                          }else{
                            goodsAttsStr+=`<option value="${arr[j]}" >${arr[j]}</option>`;
                          } 
                        }
                goodsAttsStr+=`</select>`;
                goodsAttsStr+=`</li>`;
            }

        })

        //商品的图库信息
        var goodsImageResult=await this.ctx.model.GoodsImage.find({"goods_id":goodsResult[0]._id}); 

        console.log(goodsImageResult);
      
        await this.ctx.render('admin/goods/edit',{
          colorResult:colorResult,
          goodsType:goodsType,
          goodsCate:goodsCate,
          goods:goodsResult[0],
          goodsAtts:goodsAttsStr,
          goodsImage:goodsImageResult,
          goodsColor:goodsColorReulst,
          prevPage:this.ctx.state.prevPage

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
              
          }      
    


          var formFields=Object.assign(files,parts.field);


          console.log(formFields);

          //增加商品信息
          let goodsRes =new this.ctx.model.Goods(formFields);    
          var result=await goodsRes.save();
    
          // console.log(result._id);
          //增加图库信息

          var  goods_image_list=formFields.goods_image_list;

          if(result._id && goods_image_list){  
            //解决上传一个图库不是数组的问题
            if(typeof(goods_image_list)=='string'){

              goods_image_list=new Array(goods_image_list);
            }
                      
            for(var i=0;i<goods_image_list.length;i++){                     
                  let goodsImageRes =new this.ctx.model.GoodsImage({
                    goods_id:result._id,
                    img_url:goods_image_list[i]
                  });
            
                  await goodsImageRes.save();
            }

          }
          //增加商品类型数据

          var attr_value_list=formFields.attr_value_list;
          var attr_id_list=formFields.attr_id_list;

          if(result._id && attr_id_list && attr_value_list){       
            
            
             //解决只有一个属性的时候存在的bug
             if(typeof(attr_id_list)=='string'){
              attr_id_list=new Array(attr_id_list);
              attr_value_list=new Array(attr_value_list);
            }

            for(var i=0;i<attr_value_list.length;i++){
                //查询goods_type_attribute
                if(attr_value_list[i]){ 
                    var goodsTypeAttributeResutl=await this.ctx.model.GoodsTypeAttribute.find({"_id":attr_id_list[i]})

                    let goodsAttrRes =new this.ctx.model.GoodsAttr({
                      goods_id:result._id, 
                      cate_id:formFields.cate_id,
                      attribute_id:attr_id_list[i],
                      attribute_type:goodsTypeAttributeResutl[0].attr_type,
                      attribute_title:goodsTypeAttributeResutl[0].title,
                      attribute_value:attr_value_list[i]
                    });

                    await goodsAttrRes.save();
                }
            }

          }

          await this.success('/admin/goods','增加商品数据成功');
        
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

        var formFields=Object.assign(files,parts.field);

        //修改商品的id
        var goods_id=parts.field.id;        
        //修改商品信息
        await this.ctx.model.Goods.updateOne({"_id":goods_id},formFields);
  
        //修改图库信息  （增加）

        var  goods_image_list=formFields.goods_image_list;
        if(goods_id && goods_image_list){            
          if(typeof(goods_image_list)=='string'){

            goods_image_list=new Array(goods_image_list);
          }
                    
          for(var i=0;i<goods_image_list.length;i++){                     
                let goodsImageRes =new this.ctx.model.GoodsImage({
                  goods_id:goods_id,
                  img_url:goods_image_list[i]
                });
          
                await goodsImageRes.save();
          }
        }

        //修改商品类型数据    1、删除以前的类型数据     2、重新增加新的商品类型数据


        //1、删除以前的类型数据

        await this.ctx.model.GoodsAttr.deleteOne({"goods_id":goods_id}); 
        
        //2、重新增加新的商品类型数据

        var attr_value_list=formFields.attr_value_list;
        var attr_id_list=formFields.attr_id_list;

        if(goods_id && attr_id_list && attr_value_list){                 
          
           //解决只有一个属性的时候存在的bug
           if(typeof(attr_id_list)=='string'){
            attr_id_list=new Array(attr_id_list);
            attr_value_list=new Array(attr_value_list);
          }

          for(var i=0;i<attr_value_list.length;i++){
              //查询goods_type_attribute
              if(attr_value_list[i]){ 
                  var goodsTypeAttributeResutl=await this.ctx.model.GoodsTypeAttribute.find({"_id":attr_id_list[i]})

                  let goodsAttrRes =new this.ctx.model.GoodsAttr({
                    goods_id:goods_id, 
                    cate_id:formFields.cate_id,
                    attribute_id:attr_id_list[i],
                    attribute_type:goodsTypeAttributeResutl[0].attr_type,
                    attribute_title:goodsTypeAttributeResutl[0].title,
                    attribute_value:attr_value_list[i]
                  });

                  await goodsAttrRes.save();
              }
          }

        }


        var prevPage=parts.field.prevPage;

        await this.success(prevPage,'修改商品数据成功');
      
    }  



      //获取商品类型的属性 api接口
      async goodsTypeAttribute() {


        var cate_id=this.ctx.request.query.cate_id;

        //注意 await
        var goodsTypeAttribute=await this.ctx.model.GoodsTypeAttribute.find({"cate_id":cate_id})
        
        console.log(goodsTypeAttribute);
        
        this.ctx.body={
          result:goodsTypeAttribute
        }
        
      }  

      //上传商品详情的图片
       async goodsUploadImage() {
        
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

          console.log(files);
          
          //图片的地址转化成 {link: 'path/to/image.jpg'} 

          this.ctx.body={link: files.file};
            
        
      }  

     //上传相册的图片
      async goodsUploadPhoto() {
        //实现图片上传
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

        
          //图片的地址转化成 {link: 'path/to/image.jpg'} 

          this.ctx.body={link: files.file};
            
        
      } 


      //修改图片颜色
      async changeGoodsImageColor() {

        var color_id=this.ctx.request.body.color_id;

        var goods_image_id=this.ctx.request.body.goods_image_id;
        console.log(this.ctx.request.body);
        if(color_id){
            color_id=this.app.mongoose.Types.ObjectId(color_id);
        }        

       var result= await this.ctx.model.GoodsImage.updateOne({"_id":goods_image_id},{
          color_id:color_id
        })
        if(result){
        
              this.ctx.body={'success': true,'message':'更新数据成功'};
        }else{

          this.ctx.body={'success': false,'message':'更新数据失败'};
        }
        
    } 

     //删除图片
     async goodsImageRemove() {
        
      var goods_image_id=this.ctx.request.body.goods_image_id;

      //注意  图片要不要删掉   fs模块删除以前当前数据对应的图片
      



      var result= await this.ctx.model.GoodsImage.deleteOne({"_id":goods_image_id});            //注意写法

      if(result){
        
              this.ctx.body={'success': true,'message':'删除数据成功'};
        }else{

          this.ctx.body={'success': false,'message':'删除数据失败'};
        }
      
    } 
    
      
}

module.exports = GoodsController;
