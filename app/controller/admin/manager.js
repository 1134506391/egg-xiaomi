'use strict';

const Controller = require('egg').Controller;

class ManagerController extends Controller {
  async index() {
    // this.ctx.body = '用户管理';
    await this.ctx.render('admin/manager/index');
  }
  async add() {
    // this.ctx.body = '用户增加';
    await this.ctx.render('admin/manager/add');
  }
  async edit() {
    // this.ctx.body = '用户编辑';
    await this.ctx.render('admin/manager/edit');
  }
}

module.exports = ManagerController;
