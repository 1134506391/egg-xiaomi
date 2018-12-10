'use strict';
const path = require('path');
const fs = require('fs');
const pump = require('mz-modules/pump');

const Controller = require('egg').Controller;

class FocusController extends Controller {
    async index() {
        await this.ctx.render('admin/focus/index.html')
    }

    async add() {
        await this.ctx.render('admin/focus/add.html')
    }

    async doAdd() {

    }
    async singleUpload() {
        await this.ctx.render('admin/focus/singleUpload.html')

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

    // async doMultiUpload() {
    //     //多个图片/文件
    //     const parts = this.ctx.multipart({autoFields:true});
    //     const files = [];
    //     let stream;
    //     while((stream = await parts() != null)){
    //         if(!stream.filename){
    //             return;
    //         }
    //         const fieldname = stream.fieldname;
    //         const target = 'app/public/admin/upload/' + path.basename(stream.filename);
    //         const writeStream = fs.createWriteStream(target);
    //         await pump(stream,writeStream);
    //         files.push({
    //             [fieldname]:target
    //         })
    //     }
    //     this.ctx.body = {
    //         files:  files,
    //         fields:parts.field
    //     }
    // }
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