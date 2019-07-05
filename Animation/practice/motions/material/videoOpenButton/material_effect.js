(function ($) {


	function videoBtn(w, h) {
		var tl;
		w = w || 500;
		h = h || 300;
		$("<i>").addClass('close').addClass('fa').addClass('fa-times').addClass('fa-3x').css({
			position: 'absolute',
			top: 10,
			right: 10,
			opacity: 0,
			zIndex:1
		}).appendTo('.ui_btn1');
		$('<iframe width="100%" height="100%" src="https://www.youtube.com/embed/Q8TXgCzxEnw?ecver=1" frameborder="0" allowfullscreen></iframe>').css({
			position: 'absolute',
			top:0,
			left:0,
			zIndex:0,
			display:'none'
		}).appendTo('.ui_btn1');
		$(document).on('click', '.ui_btn1', function () {
			if(!$(this).hasClass('open')){
				tl = new TimelineMax({paused: true});
				tl.to($(this).find('span'), 0.5, {opacity: 0, ease: Expo.easeOut}, 0);
				tl.to($(this).find('.close'), 0.3, {opacity: 1, ease: Expo.easeOut}, 0.1);
				tl.set($(this).find('iframe'),  {display:'none'}, 0.4);
				tl.set($(this).find('iframe'),  {display:'block'}, 0.41);
				tl.to(this, 0.5, {backgroundColor:"#333", width:w}, 0);
				tl.to(this, 0.5, {height:h}, 0.1);

				tl.tweenTo(tl.totalDuration(),  {ease: Expo.easeOut});


				$(this).addClass("open");
			}
		});
		$(document).on('click', '.close', function (e) {
			e.stopPropagation();
			tl.tweenTo(0, {ease: Expo.easeOut});
			$(this).closest('.ui_btn1').removeClass('open');
		});
	}

	videoBtn(600,300);

})(jQuery);