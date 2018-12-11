'use strict';
const path = require('path');
const fs = require('fs');
const pump = require('mz-modules/pump');

var BaseController = require('./base.js')

class FocusController extends BaseController {
    async index() {
        var result = await this.ctx.model.Focus.find();
        await this.ctx.render('admin/focus/index',{
            list:result
        })
    }

    async add() {
        await this.ctx.render('admin/focus/add')
    }

    async doAdd() {
        let parts = this.ctx.multipart({autoFields:true});
        let files = {};
        let stream;
        while((stream = await parts()) != null){
            if(!stream.filename){
                break;
            }
            let fieldname = stream.fieldname; //file表单的名字
            //上传图片的目录
            let dir = await this.service.tools.getUploadFile(stream.filename);
            let target = dir.uploadDir;
            let writeStream = fs.createWriteStream(target);

            await pump(stream,writeStream);
            files = Object.assign(files,{
                [fieldname]:dir.saveDir
            })
        }

        let focus = new this.ctx.model.Focus(Object.assign(files,parts.field));
        var result = await focus.save();
        await this.success('/admin/focus','增加轮播图成功');
    }

    async edit(){
        var id=this.ctx.request.query.id;

        var result=await this.ctx.model.Focus.find({"_id":id});
        await this.ctx.render('admin/focus/edit',{
            list:result[0]
        })
    }
    async doEdit(){
        let parts = this.ctx.multipart({autoFields:true});
        let files = {};
        let stream;
        while((stream = await parts()) != null){
            if(!stream.filename){
                break;
            }
            let fieldname = stream.fieldname; //file表单的名字
            //上传图片的目录
            let dir = await this.service.tools.getUploadFile(stream.filename);
            let target = dir.uploadDir;
            let writeStream = fs.createWriteStream(target);

            await pump(stream,writeStream);
            files = Object.assign(files,{
                [fieldname]:dir.saveDir
            })
        }
        // console.log("接收数据开始")
        // console.log(files);
        // console.log(parts.field)
        // console.log("接收数据结束")
        var id = parts.field.id;
        var updateResult = Object.assign(files,parts.field);
        console.log(updateResult)
        let result = await this.ctx.model.Focus.updateOne({"_id":id},updateResult)
        await this.success('/admin/focus','修改轮播图成功');
    }


    async singleUpload() {
        await this.ctx.render('admin/focus/singleUpload')

    }
    //单文件上传
    async doSingleUpload() {
        const stream = await this.ctx.getFileStream(); //获取表单提交的数据
        if (!stream.filename) { //注意如果没有传入图片直接返回   
            return;
        }
        // console.log(JSON.stringify(stream))
        // 上传目录
        // "filename":"c:/images/291051166-5b20eca6448e8_articlex.png",  path.basename  => 291051166-5b20eca6448e8_articlex.png
        const target = 'app/public/admin/upload/' + path.basename(stream.filename);

        const writeStream = fs.createWriteStream(target);
        await pump(stream, writeStream); //stream.pipe(writeStream);   //可以用， 但是不建议,因为不能处理失败的情况
        this.ctx.body = {
            url: target,
            fields: stream.fields //表单的其他数据
        }
    }

    async multi() {
        await this.ctx.render('admin/focus/multi');
    }

    async doMultiUpload() {
        //{ autoFields: true }:可以将除了文件的其它字段提取到 parts 的 filed 中
        //多个图片/文件
        const parts = this.ctx.multipart({
            autoFields: true
        });
        const files = [];
        let stream;
        while ((stream = await parts()) != null) {
            if (!stream.filename) { //注意如果没有传入图片直接返回   
                return;
            }
            const fieldname = stream.fieldname; //file表单的名字  face
            const target = 'app/public/admin/upload/' + path.basename(stream.filename);
            const writeStream = fs.createWriteStream(target);
            await pump(stream, writeStream); //写入并销毁当前流   (egg  demo提供的)

            files.push({
                [fieldname]: target //es6里面的属性名表达式
            });
        }
        this.ctx.body = {
            files: files,
            fields: parts.field // 所有表单字段都能通过 `parts.fields`            放在while循环后面
        };
    }
}
module.exports = FocusController;