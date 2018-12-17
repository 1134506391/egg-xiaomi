
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    var d=new Date();
   
    const GoodsCateSchema = new Schema({
      title:{ type:String },
      cate_img: { type: String  },
      filter_attr: { type: String  },      //筛选id
      link:{ type: String  },  
      template:{ /*指定当前分类的模板*/
          type:String
      },
      pid:{
          type:Schema.Types.Mixed  //混合类型 
      },
      sub_title:{  /*seo相关的标题  关键词  描述*/
        type:String
      },
      keywords:{
        type:String
      },
      description:{
        type:String
      },
      status: { type: Number,default:1  },    
      add_time: {           
        type:Number,        
        default: d.getTime()    
      }
    }); 
    return mongoose.model('GoodsCate', GoodsCateSchema,'goods_cate');
  }