module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    var d=new Date();   
    const NavSchema = new Schema({
      title: { type: String  },
      link: { type: String  },
      position: {  
        type:Number,    
        default:2    //1最顶部     2中间   3底部 
      },   
      is_opennew:{
        type:Number,     
        default:1    //1、本窗口    2、新窗口
      },
      sort:{
        type:Number,    
        default:100      
      },
      relation:{     //  1,2,3
        type:String,    
        default:''      
      },
      status: { type: Number,default:1  },    
      add_time: {           
        type:Number,        
        default: d.getTime()    
       }

    });
   
    return mongoose.model('Nav', NavSchema,'nav');
}