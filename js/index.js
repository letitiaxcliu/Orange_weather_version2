
$(function () {
	//jsonp
	var inp = $('#inp');
	var searchbtn = $('#searchbtn');

	// // 显示按钮
	// $('.city').on('click', function () {
	// 	$('.search').show();
	// 	inp.focus();// 获取焦点
	// })

	// // 取消按钮
	// $('#cancel').on('click', function () {
	// 	$('.search').hide();
	// })

	//更换城市天气
	// 确认按钮
	searchbtn.on('click', function () {
		if (inp.val().trim() != '') {
			fun(inp.val().trim());
			// $('.search').hide();
		}
	})
	$(document).keydown(function (event) {
		if (event.keyCode == 13) {
			searchbtn.click();
		}
	});
	// 背景图片
	Event();
	//获取缓存数据--用于测试
	var musicIds = localStorage.getItem('musicIds');
	//如果不存在缓存数据,发起ajax请求
	fun('');
	// if(!musicIds){
	// 	//初始化获取
	// 	fun('');
	// }else{
	// 	//如果存在缓存数据
	// 	musicIds = JSON.parse(musicIds);
	// 	console.log('musicIds ==> ', musicIds);
	// 	initialize(musicIds);
	// }

	function fun(cityText) {
		$.ajax({
			//请求类型
			// type: 'GET',
			//请求地址
			url: 'https://www.tianqiapi.com/api',
			//请求参数
			data: {
				appid: 99896829,
				appsecret: 'dU2ZGAxw',
				version: 'v9',
				city: cityText,
			},
			dataType: 'jsonp',
			//请求成功后执行的回调函数
			success: function (data) {
				console.log('data ==> ', data);
				if (inp.val().trim() != '' && data.city != inp.val().trim()) {
					alert('输入搜索错误！请检查后输入内容重试！');
					return;
				}
				//将数据缓存在浏览器的本地存储 localStorage
				//JSON.stringify(data);把对象转为字符串
				localStorage.setItem('musicIds', JSON.stringify(data));
				// 当前城市名称
				$('.city').text(data.city);
				initialize(data);
			},
			//true: 异步, false: 同步, 默认异步, 对于jsonp无效
			async: true
		})
	}

	function initialize(obj) {

		var data = obj.data;
		// 当前温度情况
		real_time(obj.data[0]);
		// 当天24小时天气情况
		All_day(data[0].hours);
		// 7天预告信息
		Notice(data);
	}

	function real_time(obj) {
		var data = obj;
		console.log(data);
		// 当前温度
		$('.tt_text').html(data.tem == '' ? data.hours[0].tem + '&#176' : data.tem + '&#176');
		// 当前天气状态图标
		var wendu = $('#temperature');
		if (wendu.find('use').length != 0) {
			wendu.find('use').remove();
		}
		var html = '<use xlink:href="#icon-' + data.wea_night_img + '"></use>';
		wendu.html(html);

		// 提示
		$('.air_tips').text(data.air_tips).prop('title', data.air_tips);
	}

	function All_day(obj) {
		var Today = $('.Today>ul');
		var d = new Date();
		var h = d.getHours();//获取当前小时数(0-23)
		// 遍历当前24小时
		Today.html('');
		for (var i in obj) {
			var str = `
						<div class="hour">${obj[i].hours}</div>
						<svg class="icon">
							<use xlink:href="#icon-${obj[i].wea_img}"></use>
						</svg>
						<div class="real">${obj[i].tem}&#8451</div>`;
			var lis = $('<li>' + str + '</li>');
			if (parseInt(obj[i].hours) == h) {
				lis.addClass('active');
			}
			Today.append(lis);
			lis.on('click', function () {

				// 当前温度
				$('.tt_text').html(parseInt($(this).find('.real').text()) + '&#176');
				// 当前天气状态图标
				var wendu = $('#temperature');
				if (wendu.find('use').length != 0) {
					wendu.find('use').remove();
				}
				wendu.html($(this).find('.icon').html());

			})
		}
	}

	//7天天气预告
	function Notice(obj) {
		var prediction = $('.prediction');
		prediction.html('');

		for (var i in obj) {
			var str =
				`<div class="week" data-state="${i}">
							<div class="w_left">${obj[i].day}</div>
							<div class="w_rigth">
								<div class="f_temperature">
									${obj[i].tem2}&#8451 ~ ${obj[i].tem1}&#8451
								</div>
								<svg class="icon">
									<use xlink:href="#icon-${obj[i].wea_day_img}"></use>
								</svg>
							</div>
						</div>`;
			var divs = $(str);
			if (i == 0) {
				divs.addClass('active');
			}

			divs.on('click', function () {
				var arr = obj[$(this).data('state')];
				real_time(arr);
				console.log(arr.hours);
				All_day(arr.hours);
			})

			prediction.append(divs);
		}
	}


	function Event() {
		// 获取背景对象
		var background = $('.background');
		var myDate = new Date();
		var h = myDate.getHours();//获取当前小时数(0-23)
		if (h >= 7 && h <= 19) {
			background.css('background-image', 'url(./images/Noon.png)');
		} else {
			background.css('background-image', 'url(./images/Night.png)');
		}
	}

})