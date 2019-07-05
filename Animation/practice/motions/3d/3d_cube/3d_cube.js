(function ($) {
	// ************* CUBE ***************
	function getCoordinates(e) {
		var obj = {x:0, y:0};
		if(e){
			obj = {
				x: e.pageX || e.originalEvent.targetTouches[0].pageX,
				y: e.pageY || e.originalEvent.targetTouches[0].pageY
			}
		} else {
			console.error('getCordinates Error');
		}
		return obj;
	}
	$(document).on('mousedown touchstart', '.cube', function (e) {
		var startXY = getCoordinates(e);
		var gsTransform = $.extend({rotationX:0, rotationY:0}, $('.cube').get(0)._gsTransform);
		$(document).on('mousemove.cube touchmove.cube', '.cube', function (e) {
			var moveXY = getCoordinates(e);
			moveXY = {
				x: moveXY.x - startXY.x,
				y: moveXY.y - startXY.y
			};
			console.log(gsTransform);
			console.log(moveXY);
			if(gsTransform){
				moveXY.x += -gsTransform.rotationY,
				moveXY.y += -gsTransform.rotationX
			}
			TweenMax.set('.cube', {rotationX: -moveXY.y, rotationY: -moveXY.x});
		});
		$(document).on('touchend.cube touchcancle.cube mouseup.cube', function (e) {
			$(document).off('.cube');
		});
	});
	// ***********************************

	$(document).on('click', '.popup button', function () {
		var tl = new TimelineMax();
		tl.to(".cubebox > .cube > .top", 0.1, {left:15});
		tl.to(".cubebox > .cube > .top", 0.1, {left:-15});
		tl.to(".cubebox > .cube > .top", 0.1, {left:0});
		$(this).parent().fadeOut(700);
	});


	TweenMax.to('.cubebox > .cube >.back', 2, {transform:"rotateX(180deg) translateZ(0)", yoyo:true, repeat:-1});
	//TweenMax.to('.cubebox > .cube >.bottom', .5, {delay:1, left:10, yoyo:true, repeat:-1});
	TweenMax.to('.cubebox > .cube >.bottom', 2, {transform:"rotateX(0) translateZ(0)", yoyo:true, repeatDelay:5, repeat:-1});



	$(document).bind('selectstart',function(e) {e.preventDefault()});
	$(document).bind('dragstart',function(e){e.preventDefault()});

})(jQuery);