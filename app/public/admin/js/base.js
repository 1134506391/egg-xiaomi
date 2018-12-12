$(function () {
	app.init()
})

var app = {
	init: function () {
		this.toggleAside();
		this.deleteConfirm()
		this.resizeIframe();
	},
	toggleAside: function () {
		$('.aside h4').click(function () {
			if($(this).find('span').hasClass('nav_close')){

				$(this).find('span').removeClass('nav_close').addClass('nav_open');
			}else{

				$(this).find('span').removeClass('nav_open').addClass('nav_close');
			}
			$(this).siblings('ul').slideToggle();
		})
	},
	resizeIframe:function(){

		var heights = document.documentElement.clientHeight-100;	
		// document.getElementById('rightMain').height = heights + "px";
		$("#rightMain").height(heights)
	},
	deleteConfirm:function(){
		$('.delete').click(function(){
			var flag = confirm('你确定要删除吗');
			return flag;
		})
	},
	//改变状态
	changeStatus:function(el,model,attr,id){
		$.get('/admin/changeStatus',{model:model,attr:attr,id:id},function(data){
			if(data.success){
				if(el.src.indexOf('yes') != -1){
					el.src = '/public/admin/images/no.gif'
				}else{
					el.src = '/public/admin/images/yes.gif'
				}
			}
		})
	},
	//修改排序
	editNum:function(el,model,attr,id){
		var val = $(el).html()
		var input = $("<input value='' />");
		$(el).html(input);
		$(input).trigger('focus').val(val);
		$(input).click(function(){
			return false;
		})
		$(input).blur(function(){
			var num = $(this).val();
			$(el).html(num);
			
			$.get('/admin/editNum',{model:model,attr:attr,id:id,num:num},function(data) {

				console.log(data);
			})
		})
	}
}

$(window).resize(function(){

	app.resizeIframe();
})