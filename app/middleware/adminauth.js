const url = require('url')
module.exports = options => {
    return async function adminauth(ctx, next) {
        // 1.用户没有登录跳转到登录页面
        // 2.只有登录以后才可以访问后台管理系统
        var pathname = url.parse(ctx.request.url).pathname;
        console.log(pathname)
        //csrf
        ctx.state.csrf = ctx.csrf;
        ctx.state.prevPage = ctx.request.headers['referer'];  //获取上一页的url
        if(ctx.session.userinfo){
            ctx.state.userinfo = ctx.session.userinfo;
            // await next();
            //登录权限判断
            var hasAuth = await ctx.service.admin.checkAuth();
            if(hasAuth){
                ctx.state.asideList = await ctx.service.admin.getAuthList(ctx.session.userinfo.role_id);
                await next();
            }else{
                ctx.body = '你没有权限访问当前地址'
            }
        }else{
            // 排除不需要做杼判断的页面    admin/verify?mt=0.7755167188853835
            if(pathname == '/admin/login' || pathname == '/admin/doLogin' || pathname == '/admin/verify'){
                await next()
            }else{
                ctx.redirect('/admin/login')
            }
        }

    };
};