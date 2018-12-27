'use strict';

const Service = require('egg').Service;

class GoodsService extends Service {
  /*
    根据商品分类获取推荐商品
     @param {String} cate_id - 分类id
     @param {String} type -  hot  best  new
     @param {Number} limit -  数量
  */
  async get_category_recommend_goods(cate_id,type,limit) {

        try{
            var cateIdsResult=await this.ctx.model.GoodsCate.find({"pid":this.app.mongoose.Types.ObjectId(cate_id)},'_id');
            if(cateIdsResult.length==0){    
                 cateIdsResult=[{_id:cate_id}]    
            }            
           //组装查找数据的条件
            var cateIdsArr=[];
            cateIdsResult.forEach((value)=>{
                cateIdsArr.push({
                    "cate_id":value._id
                })
            })        
            //查找条件    
            var findJson={
                $or:cateIdsArr
            };
        
            //判断类型 合并对象    
            switch(type){
                case 'hot':    
                        findJson=Object.assign(findJson,{"is_hot":1});
                        break;        
                case 'best':        
                        findJson=Object.assign(findJson,{"is_best":1});
                        break;        
                case 'new':        
                        findJson=Object.assign(findJson,{"is_new":1});        
                        break;
                default :        
                    findJson=Object.assign(findJson,{"is_hot":1});        
                    break;
            }
    
            var limitSize=limit||10; 
            return await this.ctx.model.Goods.find(findJson,'title shop_price goods_img sub_title').limit(limitSize);
    

        }catch(e){
            console.log(e);
            return [];
        }

  }
}

module.exports = GoodsService;
