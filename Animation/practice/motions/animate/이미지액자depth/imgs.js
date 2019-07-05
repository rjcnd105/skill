(function ($) {

	function imgs() {
		var tl = new TimelineMax({paused: true});
		tl.to('.imgfilms img:eq(1), .imgfilms span', 1, {scale:1, ease:Power3.easeOut}, .1);
		tl.to('.imgfilms img:eq(0)', 1.1, {scale:0.95, ease:  Power2.easeOut}, 0);

		$(document).scroll((function ($imgfilms, $imgs) {
			var winH = $(window).height();
			var startT = $imgfilms.offset().top - winH;
			var endT = $imgfilms.offset().top ;

			return function () {
				var scrollT = $(window).scrollTop();
				if(scrollT >= startT && scrollT <= endT){
					tl.progress((scrollT - startT) / (endT - startT));
				}
			}
		})($('.imgfilms'), $('.imgfilms img')));
	}

	var wheelDistance = function(evt){
		var w=evt.wheelDelta, d=evt.detail;
		if (d){
			if (w) return w/d/40*d>0?1:-1; // Opera
			else return -d/3;              // Firefox;         TODO: do not /3 for OS X
		} else return w/120;             // IE/Safari/Chrome TODO: /3 for Chrome OS X
	};
	var handleScroll = function(evt){
		if (!evt) evt = event;
		var direction = wheelDistance(evt);
		evt.preventDefault();
		TweenMax.to(window, .85, { scrollTo: $(window).scrollTop() + (direction * -150), ease:Power2.easeOut } )
	};
	document.addEventListener('DOMMouseScroll',handleScroll,false); // for Firefox
	document.addEventListener('mousewheel',    handleScroll,false); // for everyone else

	imgs();
})(jQuery);