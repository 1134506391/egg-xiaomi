'use strict';

var BaseController =require('./base.js');

class NavController extends BaseController {
      async index() {



        var page=this.ctx.request.query.page || 1;
        var pageSize=2;       
        //获取当前数据表的总数量
        var totalNum=await this.ctx.model.Nav.find({}).count();
        //分页查询
        var result=await this.ctx.model.Nav.find({}).skip((page-1)*pageSize).limit(pageSize);
        
     
         await this.ctx.render('admin/nav/index',{
           list:result,
           totalPages:Math.ceil(totalNum/pageSize),
           page:page
         });
        
      }     
    
      async add() {    
    
        await this.ctx.render('admin/nav/add');
        
      } 

      async doAdd() {
    
        //  console.log();


        var nav=new this.ctx.model.Nav(this.ctx.request.body)
        
        await nav.save();   //注意

        await this.success('/admin/nav','增加导航成功');


      } 

      async edit() {
    

        var id=this.ctx.query.id;

        var result=await this.ctx.model.Nav.find({"_id":id});
    
        await this.ctx.render('admin/nav/edit',{

          list:result[0],

        });
        
      } 

      async doEdit() {
        var _id=this.ctx.request.body._id;       
        var prevPage = this.ctx.request.body.prevPage;
        await this.ctx.model.Nav.updateOne({"_id":_id},this.ctx.request.body)
         await this.success(prevPage,'编辑导航成功');     

      } 
}

module.exports = NavController;
