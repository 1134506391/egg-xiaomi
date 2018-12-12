'use strict';

var BaseController =require('./base.js');

class GoodsTypeController extends BaseController {
  async index() {
    var result = await this.ctx.model.GoodsType.find({});
    await this.ctx.render('admin/goodsType/index',{
      list:result
    })
  }

  async add() {
  
    await this.ctx.render('admin/goodsType/add')
  }

  async doAdd() {
    var res = new this.ctx.model.GoodsType(this.ctx.request.body);
    await res.save();
    await this.success('/admin/goodsType','增加类型成功');
  }

  async edit() {
    var id = this.ctx.query.id;
    var result = await this.ctx.model.GoodsType.find({"_id":id});
    await this.ctx.render('admin/goodsType/edit',{
      list:result[0]
    })
  }

  async doEdit() {
    var _id = this.ctx.request.body._id;
    var title = this.ctx.request.body.title;
    var description = this.ctx.request.body.description;
    await this.ctx.model.GoodsType.updateOne({"_id":_id},{
      title,description
    })
    await this.success('/admin/goodsType','编辑类型成功');
  }
  
}

module.exports = GoodsTypeController;
