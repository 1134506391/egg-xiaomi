$(function () {
	app.init()
})

var app = {
	init: function () {
		this.toggleAside();
		this.deleteConfirm()
	},
	toggleAside: function () {
		$('.aside h4').click(function () {
			$(this).siblings('ul').slideToggle();
		})
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