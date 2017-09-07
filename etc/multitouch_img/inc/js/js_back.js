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
				startDistance = e.distance;
				beforeX = e.clientX0;
				beforeY = e.clientY0;
				window.clearTimeout(multitouchTimeout);
			},
			onmove: function (e) {
				$(dimmSel).css({"opacity": 0});
				window.clearTimeout(dimmTimeout);
				//$(".infobox").text("");
				//$(".infobox").append("<p>"+"distance :"+e.distance+"</p>");
				//$(".infobox").append("<p>"+"angle :"+e.angle+"</p>");
				//$(".infobox").append("<p>"+"scale :"+e.scale+"</p>");
				//$(".infobox").append("<p>"+"clientX0 :"+e.clientX0+"</p>");
				//$(".infobox").append("<p>"+"clientX :"+e.clientX+"</p>");
				if( isPinch || Math.abs(startDistance - e.distance) >= 30 ){
					if(!isPinch) { isPinch = true; }
					pinch(e.scale);
				}
				else {
					swipe(e.clientX, e.clientY);
				}
			},
			onend: function (e) {
				isPinch = false;
				scale.before = scale.after;
				multitouchTimeout = window.setTimeout(function () {
					TweenMax.to($imgEl, .5, {scale:1, x:0, y:0});
				}, 3000);
			}
		});
		function swipe(x, y) {
			TweenMax.set($imgEl, {x: "+=" + (x - beforeX), y: "+=" + (y - beforeY)});
			beforeX = x;
			beforeY = y;
		}

		function pinch(chgScale) {
			scale.after = scale.before * chgScale;
			TweenMax.set($imgEl, {scale:scale.after});
		}

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