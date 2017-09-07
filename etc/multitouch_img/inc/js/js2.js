var ctx;
$(function() {


	// CANVAS
	var $canvasEl = $(".ui_cvs_view").find("canvas");
	ctx = $canvasEl.get(0).getContext("2d");
	var imgObj = new Image();
	var imgInfo = {};

	imgObj.onload = function () {
		$canvasEl[0].width = imgObj.width;
		$canvasEl[0].height = imgObj.height;
		ctx.drawImage(imgObj, 0 , 0, imgObj.width, imgObj.height);
		imgInfo = { width: imgObj.width, height: imgObj.height, x:0, y:0, scale:1 };
	};
	imgObj.src = $canvasEl.attr("data-src");

	// Gesture
	var el = $(".ui_cvs_view").get(0);
	var hammertime = new Hammer(el, {});
	hammertime.on("pinch", function (event) {
		console.log(event);
		$("body").append("<span>"+event+"</span>")
	})
});