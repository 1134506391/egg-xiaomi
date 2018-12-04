'use strict';

var BaseController = require('./base.js')

class RoleController extends BaseController {
  async index() {
    var result = await this.ctx.model.Role.find({});
    await this.ctx.render('admin/role/index',{
      list:result
    });
  }
  async add() {
    await this.ctx.render('admin/role/add');
  }
  async doAdd(){
    console.log(this.ctx.request.body)
    var role = new this.ctx.model.Role({
      title:this.ctx.request.body.title,
      description:this.ctx.request.body.description,
    })
    await role.save()
    await this.success('/admin/role','增加角色成功')
  }
  async edit() {
    var id = this.ctx.query.id;
    var result = await this.ctx.model.Role.find({"_id":id});
    await this.ctx.render('admin/role/edit',{
      list:result[0]
    });
  }

  async doEdit(){
    console.log(this.ctx.request.body)
    var _id = this.ctx.request.body._id;
    var title = this.ctx.request.body.title;
    var description = this.ctx.request.body.description;
    await this.ctx.model.Role.updateOne({"_id":_id},{
      title,description
    })
    await this.success('/admin/role','编辑角色成功')
  }
}

module.exports = RoleController;
