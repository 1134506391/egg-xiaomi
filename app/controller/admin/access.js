'use strict';

var BaseController = require('./base.js')

class AccessController extends BaseController {
  async index() {
    var result = await this.ctx.model.Access.aggregate([{
      $lookup: {
        from: 'access',
        localField: '_id',
        foreignField: 'module_id',
        as: 'items'
      }
    }, {
      $match: {
        "module_id": "0"
      }
    }])
    console.log(JSON.stringify(result))
    await this.ctx.render('admin/access/index', {
      list: result
    });
  }
  async add() {
    //获取模块列表
    //一级模块是0  管理员管理 角色管理 权限管理
    var result = await this.ctx.model.Access.find({
      "module_id": "0"
    })
    console.log(result)
    await this.ctx.render('admin/access/add', {
      moduleList: result
    });
  }
  async doAdd() {
    var addResult = this.ctx.request.body;
    var module_id = addResult.module_id;
    // //菜单  或者操作
    if (module_id != "0") { //如果不是一级模块 （管理员管理 角色管理 权限管理）
      addResult.module_id = this.app.mongoose.Types.ObjectId(module_id); //调用mongoose里面的方法把字符串转换成ObjectId
    }
    var access = new this.ctx.model.Access(addResult);
    await access.save();
    await this.success('/admin/access', '增加权限成功');
  }
  async edit() {
    var id = this.ctx.request.query.id;
    var accessResult = await this.ctx.model.Access.find({"_id":id});
    var result = await this.ctx.model.Access.find({"module_id":"0"});
     
    await this.ctx.render('admin/access/edit',{
      list:accessResult[0],
      moduleList:result
    });
  }
  async doEdit() {
    var updateResult = this.ctx.request.body;
    var id = updateResult.id;
    var module_id = updateResult.module_id;

    if(updateResult !=0){
      updateResult.module_id = this.app.mongoose.Types.ObjectId(module_id);
    }
    var result = await this.ctx.model.Access.updateOne({"_id":id},updateResult);

    await this.success('/admin/access','编辑权限成功')
  }
}

module.exports = AccessController;