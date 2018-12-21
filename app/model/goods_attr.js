module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  var d=new Date();   
  const GoodsAttrSchema = new Schema({  
    
    goods_id: {type:Schema.Types.ObjectId },    
    cate_id:{
      type:Schema.Types.ObjectId
    },
    attribute_id:{
      type:Schema.Types.ObjectId 
    },
    attribute_type:{
      type: String 
    },
    attribute_title:{
      type: String 
    },
    attribute_value:{
      type: String 
    },    
    status: { type: Number,default:1  },    
    add_time: {           
      type:Number,        
      default: d.getTime()    
    }
   
  });
 
  return mongoose.model('GoodsAttr', GoodsAttrSchema,'goods_attr');

}