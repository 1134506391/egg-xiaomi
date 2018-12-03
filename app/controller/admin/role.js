'use strict';

const Controller = require('egg').Controller;

class RoleController extends Controller {
  async index() {
    // this.ctx.body = '用户管理';
    await this.ctx.render('admin/role/index');
  }
  async add() {
    // this.ctx.body = '用户增加';
    await this.ctx.render('admin/role/add');
  }
  async edit() {
    // this.ctx.body = '用户编辑';
    await this.ctx.render('admin/role/edit');
  }
}

module.exports = RoleController;
