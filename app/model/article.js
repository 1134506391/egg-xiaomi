module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    var d=new Date();   
    const ArticleSchema = new Schema({
      title: { type: String  },
      cate_id:{type:Schema.Types.ObjectId },
      article_img: { type: String  }, 
      link:{  
        type: String 
      },          
      content: { type: String  },      
      keywords: { type: String  },
      description: { type: String },           
      sort: { type: Number,default:100 },   
      add_time: {           
        type:Number,        
        default: d.getTime()    
      },
      status: { type: Number,default:1  }
    });   
    return mongoose.model('Article',ArticleSchema,'article');
}
