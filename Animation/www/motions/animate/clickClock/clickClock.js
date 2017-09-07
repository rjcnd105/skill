(function ($) {

	var Clock = window.Clock = function (el /* timer Functions ...*/) {
		this.el = el;
		var $el = this.$el = $(el);
		this.$hEl = $el.find('.h');
		this.$mEl = $el.find('.m');
		this.$sEl = $el.find('.s');

		this.t = Clock.prototype.setNowTime();
		this.commonOrigin = 'center 10px';
		this.$hEl.add(this.$mEl).add(this.$sEl).css({transformOrigin: this.commonOrigin});

		this.timerFunctions = [
			function addTime (){ this.t += 1; },
			this.timeToRotate
		];

		this.timeToRotate();
		this.timer();
	};
	Clock.prototype.setNowTime = function () {
		var date = new Date();
		var calS = function (s) { return s; };
		var calM = function (m) { return calS(m * 60); };
		var calH = function (h) { return calM(h * 60); };
		this.t = calH(date.getHours()) + calM(date.getMinutes()) + calS(date.getSeconds());
		return this.t;
	};
	Clock.prototype.timer = function () {
		var self = this;
		self.__timerInterval__ = window.setInterval(function () {
			// fun.call(self, Array.prototype.slice.call(arguments, 1))
			$.each(self.timerFunctions, function(i, v){ v.call(self); });
		}, 1000);
	};
	Clock.prototype.stopTimer = function () {
		window.clearTimeout(this.__timerInterval__);
	};
	Clock.prototype.timeToRotate = function () {
		TweenMax.to(this.$hEl, .1, {rotation: 180 + this.t / 120, ease:Power3.easeOut});
		TweenMax.to(this.$mEl, .1, {rotation: 180 + this.t / 10, ease:Power3.easeOut});
		TweenMax.to(this.$sEl, .1, {rotation: 180 + this.t * 6, ease:Power3.easeOut});
	};

	var clickClock = function () {
		var clock = window.clock = new Clock($('.clock').get(0));

		progressCircle(clock);

		function progressCircle(clock) {
			var tl = new TimelineMax({pause: true});
			var circle = '.progress .progress_circle circle';
			var noneholdText = '.progress .nonehold';
			var holdText = '.progress .hold';
			var isComplete = false;
			tl
				.pause()
				.set(noneholdText, {className:'+=hide'}, .01)
				.addCallback(function () {
					if(clock.timerFunctions.length <= 1){
						clock.timeToRotate();
						clock.timerFunctions.push(Clock.prototype.timeToRotate);
					}
					else{
						clock.timerFunctions.pop();
					}
				})
				.to(circle, 4.5, {strokeDashoffset: 0})
				.to(clock.$hEl, 1.5, {rotation: '-=' + 13, ease:Linear.easeNone}, 0)
				.to(clock.$mEl, 1.5, {rotation: '-=' + 13 * 12, ease:Linear.easeNone}, 0)
				.to(clock.$sEl, 1.5, {rotation: '-=' + 13 * 12 * 60, ease:Linear.easeNone}, 0)
				.to(clock.$sEl, 1.5, {opacity:0, ease:Linear.easeNone}, 0)
				.set(holdText, {className:'-=hide'}, .1)

				.to(clock.$hEl, 1.5, {rotation: '-=' + 80, ease:Linear.easeNone}, 1.5)
				.to(clock.$mEl, 1.5, {rotation: '-=' + 80 * 12, ease:Linear.easeNone}, 1.5)
				.to(clock.$sEl, 1.5, {rotation: '-=' + 80 * 12 * 60, ease:Linear.easeNone}, 1.5)

				.to(clock.$hEl, 1.5, {rotation: '-=' + 140, ease:Linear.easeNone}, 3)
				.to(clock.$mEl, 1.5, {rotation: '-=' + 140 * 12, ease:Linear.easeNone}, 3)
				.to(clock.$sEl, 1.5, {rotation: '-=' + 140 * 12 * 60, ease:Linear.easeNone}, 3)
				.addCallback(function () {
					isComplete = true;
				})
				.addLabel('Infinity')
				// 비례식 140:1.5 = 360:x, x = 27/7
				.to(clock.$hEl, 27/7, {rotation: '-=' + 360, ease:Linear.easeNone, infinite: -1}, 4.5)
				.to(clock.$mEl, 27/7, {rotation: '-=' + 360 * 12, ease:Linear.easeNone, infinite: -1}, 4.5)
				.to(clock.$sEl, 27/7, {rotation: '-=' + 360 * 12 * 60, ease:Linear.easeNone, infinite: -1}, 4.5)
				.addCallback(function () {
					tl.play('Infinity')
				}, 4.5+27/7);


			
			// 마우스 이벤트
			$('.clockbox').on('mousedown', function () {
				if(isComplete) { return }
				tl.timeScale(1);
				tl.tweenTo(tl.totalDuration(), {ease:Linear.easeNone});
			}).on('mouseup', function () {

				if(isComplete){
					TweenMax.to(".clockbox .clock, .clockbox .frame, .clockbox .progress", 1, {scale:2, opacity:0});
				}

				tl.timeScale(7);
				// 무한반복 라벨을 초과했을시
				if(tl.time() > tl.getLabelTime('Infinity')){
					tl.tweenFromTo(tl.getLabelTime('Infinity'), 0, {ease:Linear.easeNone});
				}
				else {
					tl.tweenTo(0, {ease:Linear.easeNone});
				}


			});

		}
	};
	clickClock();



})(jQuery);