$(function() {


	// CANVAS
	// var $canvasEl = $(".ui_cvs_view").find("canvas");
	// var ctx = $canvasEl.get(0).getContext("2d");
	// var imgObj = new Image();
	// var imgInfo = {};

	// imgObj.onload = function () {
	// 	$canvasEl[0].width = imgObj.width;
	// 	$canvasEl[0].height = imgObj.height;
	// 	ctx.drawImage(imgObj, 0 , 0, imgObj.width, imgObj.height);
	// 	imgInfo = { width: imgObj.width, height: imgObj.height, x:0, y:0, scale:1 };
	// };
	// imgObj.src = $canvasEl.attr("data-src");

	// Gesture

	$('body').prepend('v4');

	(function () {
		var dimmTimeout;
		var selector = '.ui_multitouch',
			dimmSel = '.ui_multitouch_dimm';
		var multitouchTimeout;
		var startDistance;
		var scale = {
			before:1,
			after:1
		};
		var beforeX, beforeY;
		var $imgEl = $(selector).find("img"),
			imgOrgW = $imgEl.width(),
			imgOrgH = $imgEl.height();
		var isPinch = false;
		interact(selector).gesturable({
			onstart: function (e) {
				// 두손가락으로 터치 시작시
				startDistance = e.distance;
				beforeX = e.clientX0;
				beforeY = e.clientY0;
				window.clearTimeout(multitouchTimeout);
			},
			onmove: function (e) {
				// 두손가락으로 움직일시
				$(dimmSel).css({"opacity": 0});
				window.clearTimeout(dimmTimeout);
				if( isPinch || Math.abs(startDistance - e.distance) >= 30 ){
					if(!isPinch) { isPinch = true; }
					pinch(e.scale);
				}
				else {
					swipe(e.clientX, e.clientY);
				}
			},
			onend: function (e) {
				// 두손가락 땠을시
				isPinch = false;
				scale.before = scale.after;
				multitouchTimeout = window.setTimeout(function () {
					TweenMax.to($imgEl, .5, {scale:1, x:0, y:0});
				}, 3000);
			}
		});
		// 두손가락으로 움직이기
		function swipe(x, y) {
			TweenMax.set($imgEl, {x: "+=" + (x - beforeX), y: "+=" + (y - beforeY)});
			beforeX = x;
			beforeY = y;
		}
		//확대 축소
		function pinch(chgScale) {
			scale.after = scale.before * chgScale;
			TweenMax.set($imgEl, {scale:scale.after});
		}

		// 한손가락시 DIMM 이벤트들, setTimeout을 사용하여 시간차 DIMM을 깜으로써 두손가락으로 조작할 수 있게 하였음
		$(selector).on("touchmove", function (e) {
			var e0 = e.originalEvent;
			if(e0.targetTouches.length > 1){
				e0.preventDefault();
			}
			if(e0.targetTouches.length === 2){
				window.clearTimeout(dimmTimeout);
				$(this).find(dimmSel).css({"opacity": 0});
			}
		}).on("touchstart", function (e) {
			var e0 = e.originalEvent;
			var self = this;
			if(e0.targetTouches.length !== 2){
				dimmTimeout = window.setTimeout(function () {
					console.log($(this).find(dimmSel));
					$(self).find(dimmSel).stop(true).animate({"opacity": 0.6});
				}, 100)
			}
		}).on("touchend touchcancle", function (e) {
			$(this).find(dimmSel).stop(true).animate({"opacity": 0});
			window.clearTimeout(dimmTimeout);
		});
	})();

});