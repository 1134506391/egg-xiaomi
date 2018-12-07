'use strict';
var BaseController = require('./base.js')

class ManagerController extends BaseController {
  async index() {
    var result = await this.ctx.model.Admin.aggregate([{
      //关联role表
      $lookup:{
        from:'role',
        localField:'role_id',
        foreignField:'_id',
        as:'role'
      }
    }])
    // console.log(JSON.stringify(result))
    await this.ctx.render('admin/manager/index',{
      list:result
    });
  }
  async add() {
    //查找所有的角色
    var roelResult = await this.ctx.model.Role.find();
    // console.log(roelResult)
    await this.ctx.render('admin/manager/add',{
      roelResult:roelResult
    });
  }

  async doAdd(){
    // console.log(this.ctx.request.body)
    var addResult = this.ctx.request.body;
    addResult.password = await this.service.tools.md5(addResult.password)
    // 判断当前用户是否存在 
    var adminResult = await this.ctx.model.Admin.find({"username":addResult.username})
    if(adminResult.length>0){
      this.error('/admin/manager','管理员已经存在');
    }else{
      var admin = new this.ctx.model.Admin(addResult)
      await admin.save()
      await this.success('/admin/manager','增加管理员成功');
    }
  }
  async edit() {
    //获取编辑的数据
    var id = this.ctx.request.query.id;
    var adminResult = await this.ctx.model.Admin.find({"_id":id});
    //获取角色
    var roleResult = await this.ctx.model.Role.find();
    await this.ctx.render('admin/manager/edit',{
      adminResult:adminResult[0],
      roleResult:roleResult
    });
  }
  async doEdit() {
    console.log(this.ctx.request.body)
    var id = this.ctx.request.body.id;
    var password = this.ctx.request.body.password;
    var mobile = this.ctx.request.body.mobile;
    var email = this.ctx.request.body.email;
    var role_id = this.ctx.request.body.role_id;
    
    if(password){ //如果修改了密码
      password = await this.service.tools.md5(password);
      await this.ctx.model.Admin.updateOne({"_id":id},{
        password,
        mobile,
        email,
        role_id
      })
    }else{ //如果没有修改了密码
      await this.ctx.model.Admin.updateOne({"_id":id},{
        mobile,
        email,
        role_id
      })
    }
    await this.success('/admin/manager','编辑管理员成功');
  }
}

module.exports = ManagerController;
