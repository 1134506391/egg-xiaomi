'use strict';

var BaseController = require('./base.js');

class GoodsTypeAttributeController extends BaseController {
    async index() {
        var cate_id = this.ctx.request.query.id;
        var goodsType=await this.ctx.model.GoodsType.find({"_id":cate_id})
        var result = await this.ctx.model.GoodsTypeAttribute.aggregate([
            {
            $lookup: {
                from: 'goods_type',
                localField: 'cate_id',
                foreignField: '_id',
                as: 'goods_type'
            }
        },{
            $match:{
                "cate_id":this.app.mongoose.Types.ObjectId(cate_id)
            }
        }])
        await this.ctx.render('admin/goodsTypeAttribute/index', {
            list:result,
            cate_id: cate_id,
            goodsType:goodsType[0]
        });
    }

    async add() {
        // 获取商品类型数据
        var cate_id = this.ctx.request.query.id;
        var goodsTypes = await this.ctx.model.GoodsType.find({});
        await this.ctx.render('admin/goodsTypeAttribute/add', {
            cate_id: cate_id,
            goodsTypes: goodsTypes
        })
    }

    async doAdd() {

        var res = new this.ctx.model.GoodsTypeAttribute(this.ctx.request.body);
        await res.save();
        await this.success('/admin/goodsTypeAttribute?id=' + this.ctx.request.body.cate_id, '增加商品类型属性成功');

    }

    async edit() {
        var id=this.ctx.query.id;

        var result=await this.ctx.model.GoodsTypeAttribute.find({"_id":id});

        var goodsTypes=await this.ctx.model.GoodsType.find({});

        await this.ctx.render('admin/goodsTypeAttribute/edit',{

            list:result[0],
            goodsTypes:goodsTypes
        });
    }

    async doEdit() {
        var _id=this.ctx.request.body._id;
        await this.ctx.model.GoodsTypeAttribute.updateOne({"_id":_id},this.ctx.request.body);
        await this.success('/admin/goodsTypeAttribute?id='+this.ctx.request.body.cate_id,'修改商品类型属性成功');
    }
}

module.exports = GoodsTypeAttributeController;