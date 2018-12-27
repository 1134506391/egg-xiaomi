'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
  async index() {

    console.time('index_time')
    //获取顶部导航的数据
    var topNav = await this.ctx.service.cache.get('index_topNav');
    if(!topNav){
      topNav=await this.ctx.model.Nav.find({"position":1});
      await this.ctx.service.cache.set('index_topNav',topNav,60*60);
    }


   //轮播图

   var focus=await this.ctx.service.cache.get('index_focus');
   if(!focus){
    focus=await this.ctx.model.Focus.find({"type":1});
    await this.ctx.service.cache.set('index_focus',focus,60*60);

   }


   //商品分类
   var goodsCate=await this.ctx.service.cache.get('index_goodsCate');
   if(!goodsCate){
      goodsCate=await this.ctx.model.GoodsCate.aggregate([
              
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
    await this.ctx.service.cache.set('index_goodsCate',goodsCate,60*60);
   }


    // console.log(topNav);
    var middleNav=await this.ctx.service.cache.get('index_middleNav'); 
    if(!middleNav){
      middleNav=await this.ctx.model.Nav.find({"position":2});
      middleNav=JSON.parse(JSON.stringify(middleNav));  //1、不可扩展对象
      for(var i=0;i<middleNav.length;i++){     
        if(middleNav[i].relation){
              //数据库查找relation对应的商品            
              try{
                  var tempArr=middleNav[i].relation.replace(/，/g,',').split(',');
                  var tempRelationIds=[];
                  tempArr.forEach((value)=>{
                    tempRelationIds.push({
                      "_id":this.app.mongoose.Types.ObjectId(value)
                    })
                  })
                  var relationGoods=await this.ctx.model.Goods.find({
                    $or:tempRelationIds
                  },'title goods_img');

                middleNav[i].subGoods=relationGoods;

              }catch(err){   //2、如果用户输入了错误的ObjectID（商品id）

                middleNav[i].subGoods=[];
              }
        }else{

            middleNav[i].subGoods=[];
        }
      }

      await this.ctx.service.cache.set('index_middleNav',middleNav,60*60);


    }

    // console.log(JSON.stringify(middleNav))

    var shoujiResult=await this.ctx.service.cache.get('index_shoujiResult'); 

    if(!shoujiResult){
      shoujiResult=await this.service.goods.get_category_recommend_goods('5bbf058f9079450a903cb77b','best',8);
      await this.ctx.service.cache.set('index_shoujiResult',shoujiResult,60*60);

    }

    console.timeEnd('index_time')
    await this.ctx.render('default/index',{
      topNav:topNav,
      focus:focus,
      goodsCate:goodsCate,
      middleNav:middleNav,
      shoujiResult:shoujiResult
    });
    
  }
}

module.exports = IndexController;
