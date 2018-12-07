'use strict';
const url = require('url');
const Service = require('egg').Service;

class AdminService extends Service {
  async checkAuth() {
    // 1.获取当前用户的角色
    // 2.根据角色获取当前角色的权限列表
    // 3.获取当前访问的url对应的权限id
    // 4.判断当前访问的url对应的权限id 是否存在权限列表的id中

    // 1.
    var userinfo = this.ctx.session.userinfo;
    var role_id = userinfo.role_id;
    var pathname = url.parse(this.ctx.request.url).pathname;

    //忽略权限判断的地址 is_super=1表示超级管理员
    var ignoreUrl = ['/admin/login','/admin/doLogin','/admin/verify','/admin/loginOut']

    if(ignoreUrl.indexOf(pathname) !=-1  || userinfo.is_super == 1){
        return true;  //允许访问
    }
    // 2.
    var accessResult = await this.ctx.model.RoleAccess.find({"role_id":role_id})
    var accessArray = [];
    accessResult.forEach(function(value){
        accessArray.push(value.access_id.toString());
    })
    // 3.
    
    var accessUrlResult = await this.ctx.model.Access.find({"url":pathname})

    // 4.
    if(accessUrlResult.length >0){
        if(accessArray.indexOf(accessUrlResult[0]._id.toString())!= -1){
            return true;
        }
        return false;
    }
    return false;
  }

  async getAuthList(role_id){
          /*
     1、获取全部的权限  
     2、查询当前角色拥有的权限（查询当前角色的权限id） 把查找到的数据放在数组中
     3、循环遍历所有的权限数据     判断当前权限是否在角色权限的数组中，   如果在角色权限的数组中：选中    如果不在角色权限的数组中不选中
    */
    // var role_id = this.ctx.request.query.id;
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
    return result;
  }
}

module.exports = AdminService;
