'use strict';

var BaseController = require('./base.js')

class RoleController extends BaseController {
  async index() {
    var result = await this.ctx.model.Role.find({});
    await this.ctx.render('admin/role/index', {
      list: result
    });
  }
  async add() {
    await this.ctx.render('admin/role/add');
  }
  async doAdd() {
    // console.log(this.ctx.request.body)
    var role = new this.ctx.model.Role({
      title: this.ctx.request.body.title,
      description: this.ctx.request.body.description,
    })
    await role.save()
    await this.success('/admin/role', '增加角色成功')
  }
  async edit() {
    var id = this.ctx.query.id;
    var result = await this.ctx.model.Role.find({
      "_id": id
    });
    await this.ctx.render('admin/role/edit', {
      list: result[0]
    });
  }

  async doEdit() {
    // console.log(this.ctx.request.body)
    var _id = this.ctx.request.body._id;
    var title = this.ctx.request.body.title;
    var description = this.ctx.request.body.description;
    await this.ctx.model.Role.updateOne({
      "_id": _id
    }, {
      title,
      description
    })
    await this.success('/admin/role', '编辑角色成功')
  }

  async auth() {
    /*
     1、获取全部的权限  
     2、查询当前角色拥有的权限（查询当前角色的权限id） 把查找到的数据放在数组中
     3、循环遍历所有的权限数据     判断当前权限是否在角色权限的数组中，   如果在角色权限的数组中：选中    如果不在角色权限的数组中不选中
    */
    var role_id = this.ctx.request.query.id;
    //1、获取全部的权限
    var result = await this.ctx.model.Access.aggregate([
      {
        $lookup: {
          from: 'access',
          localField: '_id',
          foreignField: 'module_id',
          as: 'items'
        }
      },
      {
        $match: {
          "module_id": '0'
        }
      }
    ]);
    // console.log(JSON.stringify(result))
    //2、查询当前角色拥有的权限（查询当前角色的权限id） 把查找到的数据放在数组中
    var accessReulst = await this.ctx.model.RoleAccess.find({
      "role_id": role_id
    });
    // console.log(accessReulst)
    var roleAccessArray = [];
    accessReulst.forEach(function (value) {
      roleAccessArray.push(value.access_id.toString());
    })
    console.log(roleAccessArray)
    // console.log(roleAccessArray);

    // 3、循环遍历所有的权限数据     判断当前权限是否在角色权限的数组中
    for (var i = 0; i < result.length; i++) {
      if (roleAccessArray.indexOf(result[i]._id.toString()) != -1) {
        result[i].checked = true;
      }
      for (var j = 0; j < result[i].items.length; j++) {
        if (roleAccessArray.indexOf(result[i].items[j]._id.toString()) != -1) {
          result[i].items[j].checked = true;
        }
      }
    }
    // console.log(result);
    await this.ctx.render('admin/role/auth', {
      list: result,
      role_id: role_id
    });
  }


  async doAuth() {
    /*
    1、删除当前角色下面的所有权限
    2、把获取的权限和角色增加到数据库
    */
    // console.log(this.ctx.request.body);
    var role_id = this.ctx.request.body.role_id;
    var access_node = this.ctx.request.body.access_node;
    // console.log(access_node)
    //1、删除当前角色下面的所有权限
    await this.ctx.model.RoleAccess.deleteMany({
      "role_id": role_id
    });

    //2、给role_access增加数据 把获取的权限和角色增加到数据库
    if (access_node) {
      for (var i = 0; i < access_node.length; i++) {
        var roleAccessData = new this.ctx.model.RoleAccess({
          role_id: role_id,
          access_id: access_node[i]
        })
        roleAccessData.save();
      }
    }
    await this.success('/admin/role/auth?id=' + role_id, "授权成功");
  }
}

module.exports = RoleController;