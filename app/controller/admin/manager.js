'use strict';

const Controller = require('egg').Controller;

class ManagerController extends Controller {
  async index() {
    this.ctx.body="用户管理"
  }
  async add() {
    this.ctx.body="用户增加"
  }
  async edit() {
    this.ctx.body="用户编辑"
  }
}

module.exports = ManagerController;
