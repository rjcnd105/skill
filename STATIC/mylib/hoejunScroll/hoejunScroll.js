/* HjScroll v 0.4 */
/* Fixed Animation 테스트 필요 ! */

console.log('HjScroll Develop Version');

// 절대적 offsetTop 값을 구하기 위함
Element.prototype.documentOffsetTop = function () {
	return this.offsetTop + ( this.offsetParent ? this.offsetParent.documentOffsetTop() : 0 );
};
if (!Array.isArray) {
	Array.isArray = function(arg) {
		return Object.prototype.toString.call(arg) === '[object Array]';
	};
}

window.HjScroll = (function (TimelineMax) {

	/**					Inner Utils					**/
	var renderAfter =
		window.requestAnimationFrame 		||
		window.webkitRequestAnimationFrame 	||
		window.mozRequestAnimationFrame 	||
		function (callback) { window.setTimeout(callback, 0); };

	// ([1, 2, 3], 1) => [1, 3]
	var ipop = function (arr, i) {
		var nArr = [].slice.call(arr);
		nArr.splice(i, 1);
		return nArr;
	};

	var extend = function (obj, obj2) {
		obj = obj || {};
		for (var key in obj2) {
			if (obj2.hasOwnProperty(key)) {
				obj[key] = obj2[key];
			}
		}
		return obj;
	};


	/**				Global Private Option			**/
	var resizeDebounceTime = 350;
	var _count = 0;
	var defaultOpt = {
		// Common Opt
		offsetTop: 0, // 1 : top, 0 : bottom, middle: 0.5,  0 ~ 1

		// Scroll Progress Opt

		// Scroll Animate Opt
		playOpt: {},
		reverse: true,
		reverseOpt: {timeScale: 1.15, ease: Power1.easeOut}
	};


	/**					Construct					**/
	var HjScroll = function (opt) {
		if (!(this instanceof HjScroll)) { return new HjScroll(opt); }

		this.opt = opt || {};
		this.tl = new TimelineMax({paused: true});
		this.id = _count++;

		var scrollTw = TweenMax.to(window, 0, {}, 0);
		scrollTw.scrollStandard = true;

		this.tl.add(scrollTw);

		HjScroll.watching(this);
		console.log('construct');
	};


	/**					STATIC Variable				**/
	HjScroll.isRender = false;
	HjScroll.__watchInstance = [];
	HjScroll.__renderBeforeTweenList = [];
	HjScroll.__renderBeforeTweensList = [];


	/**					STATIC Method				**/
	HjScroll.addEventHandler = function () {
		HjScroll.removeEventHandler();
		window.addEventListener('resize', resizeFn);
		window.addEventListener('scroll', scrollFnProcess);
		window.addEventListener('touchmove', scrollFnProcess);
		resizeFn();
	};
	HjScroll.removeEventHandler = function () {
		window.removeEventListener('resize', resizeFn);
		window.removeEventListener('scroll', scrollFnProcess);
		window.removeEventListener('touchmove', scrollFnProcess);
	};
	HjScroll.setDefaultOpt = function (newOpt) {
		defaultOpt = extend(defaultOpt, newOpt);
	};


	/*					instance 감시				*/
	HjScroll.watching = function (ins) {
		if (!(ins instanceof HjScroll)) { return HjScroll; }
		var watchId = ins.id;
		for (var i = 0, len = HjScroll.__watchInstance.length; i < len; i++) {
			if (HjScroll.__watchInstance[i].id === watchId) {
				return HjScroll;
			}
		}
		console.log('watch');
		HjScroll.__watchInstance.push(ins);

		// watchInstance 갯수가 0개에서 1개로 되었을때 eventHandler 구독
		if(HjScroll.__watchInstance.length === 1){
			HjScroll.addEventHandler();
		}
		else if(HjScroll.docHeight){
			resizeProcess(ins);
		}
		else {
			scrollFnProcess();
		}
		return HjScroll;
	};

	/*				instance 감시 중단				*/
	HjScroll.unWatching = function (ins) {
		if (!(ins instanceof HjScroll)) {
			return HjScroll;
		}
		var unWatchId = ins.id;
		for (var i = 0, len = HjScroll.__watchInstance.length; i < len; i++) {
			if (HjScroll.__watchInstance[i].id === unWatchId) {
				// 중단할 instance가 감시 목록에 있으면 애니메이션 초기화후 감시 목록에서 뺌
				HjScroll.__watchInstance[i].tl.progress(0);
				HjScroll.__watchInstance = ipop(HjScroll.__watchInstance, i);
				break;
			}
		}

		// watchInstance 갯수가 1개에서 0개로 되었을때 eventHandler 구독 취소
		if(HjScroll.__watchInstance.length === 0){
			HjScroll.removeEventHandler();
		}
		return HjScroll;
	};



	/*					Tween 추가 					*/
	// addTw(tw, opt) , addTw(position, tw, opt)
	// position: [num] => addScrollAnimate, [num1, num2] => addProgressAnimate
	// 렌더링 전에는 tw을 fn으로 넘겨야 안전
	HjScroll.prototype.addTw = function (position, tw, opt) {
		var pos;
		var method;

		// 페이지 렌더링이 되기 전이면 렌더링시 계산할 리스트에 넣어둠
		if(!HjScroll.isRender){
			HjScroll.__renderBeforeTweenList.push([this].concat(arguments));
			console.warn('addTw: Render Before !!, Push BeforeTweenList');
			return;
		}
		if(!Array.isArray(position) && !(typeof position === 'number')) { tw = position; position = 0.5; opt = tw; }
		
		// tween 함수일시 처리
		if(typeof tw === 'function') { tw = tw(this); }
		for(var i = 0, tws = [].concat(tw), len = tws.length; i < len; i++) {
			tws[i].pause();
		}
		pos = [].concat(position);

		method = pos.length === 2 ? HjScroll.prototype.addProgressAnimate : HjScroll.prototype.addScrollAnimate;

		extend(tw, extend(opt, defaultOpt));

		method.apply(this, arguments);
	};

	/*			다중 Tween 추가			*/
	HjScroll.prototype.addTws = function (position, sel, fn, opt) {
		if(!HjScroll.isRender){
			HjScroll.__renderBeforeTweensList.push([this].concat(arguments));
			console.warn('addTws: Render Before !!, Push BeforeTweensList');
			return;
		}
		var targets = TweenLite.selector(sel);
		for(var i = 0, len = targets.length; i < len; i++) {
			var tw = fn(targets[i], i);
			HjScroll.prototype.addTw.apply(this, [position].concat(tw, opt));
		}
	};

	/*			애니메이션 Type 1: ProgressAnimation 추가			*/
	HjScroll.prototype.addProgressAnimate = function (position, tw) {
		var parentTw;
		var el = tw.target;
		if (el && el[0]){ el = el[0]; }
		else if(el instanceof Element) {}
		else{
			console.error('Element not Found');
			return;
		}
		// isFixedAnimation ?
		console.log(tw, tw.fixed)
		var calcPosition = tw.fixed ?
			[ calcStartPosition(position, false, HjScroll.docHeight), calcDuration(position, tw.offsetTop, HjScroll.docHeight) ] : [ calcStartPosition(position, el), calcDuration(position, tw.offsetTop) ];

		parentTw = TweenMax.to(el, calcPosition[1], {
			onUpdate: function () { tw.progress(parentTw.progress()) }
		});
		parentTw.scrollPosition = position;
		parentTw.fixed = tw.fixed;
		this.tl.add(parentTw, calcPosition[0]);
	};

	/*			애니메이션 Type 2: ScrollAnimation 추가			*/
	HjScroll.prototype.addScrollAnimate = function (position, tw) {
		var callback;
		var el = tw.target || tw[0].target;
		if (el && el[0]){ el = el[0]; }
		else if(el instanceof Element) {}
		else {
			console.error('Element not Found');
			return;
		}
		// isFixedAnimation ?
		var calcPosition = tw.fixed ?
			[ calcStartPosition([].concat(position), false, HjScroll.docHeight) ] : [ calcStartPosition([].concat(position), el) ];

		for(var i = 0, tws = [].concat(tw), len = tws.length; i < len; i++) {
			tws[i].play();
		}
		callback = (function (tl, playOpt, reverseOpt, reverse) {
			var isPlay = false;
			var dur = tl.totalDuration();
			return function () {
				if(isPlay && reverse){
					tl.tweenTo(0, reverseOpt);
					isPlay = false;
				}
				else {
					tl.tweenTo(dur, playOpt);
					isPlay = true;
				}
			}
		})(new TimelineMax({paused:true}).add(tw), tw.playOpt, tw.reverseOpt, tw.reverse);
		callback.el = el;
		callback.scrollPosition = position;
		callback.fixed = tw.fixed;

		this.tl.add(callback, calcPosition[0]);
	};

	/*			애니메이션 Type 3,4: FixedProgressAnimation, FixedScrollAnimation 추가			*/
	HjScroll.prototype.addFixedProgressAnimate = function (position, tw) { this.addProgressAnimate(position, tw, true); };
	HjScroll.prototype.addFixedScrollAnimate = function (position, tw) { this.addScrollAnimate(position, tw, true); };

	/**				Private Functions			**/
	function resizeFn() {
		window.clearTimeout(HjScroll.resizeTimeout);
		HjScroll.resizeTimeout = window.setTimeout(resizeProcess, resizeDebounceTime);
	}

	var resizeProcess = function (ins) {
		var body = document.body,
			html = document.documentElement;

		var height = Math.max(body.scrollHeight, body.offsetHeight,
			html.clientHeight, html.scrollHeight, html.offsetHeight);

		HjScroll.docHeight = height;
		HjScroll.winHeight = window.innerHeight;

		// 렌더링전에 등록되었던 트윈들 적용
		if(!HjScroll.isRender) {
			console.log('rendered, Execute Storage addTw');
			HjScroll.isRender = true;
			for(var i = 0, len = HjScroll.__renderBeforeTweenList.length; i < len; i++){
				HjScroll.prototype.addTw.apply(HjScroll.__renderBeforeTweenList[i][0], HjScroll.__renderBeforeTweenList[i][1] );
			}
			for(var i = 0, len = HjScroll.__renderBeforeTweensList.length; i < len; i++){
				HjScroll.prototype.addTws.apply(HjScroll.__renderBeforeTweensList[i][0], HjScroll.__renderBeforeTweensList[i][1] );
			}
			HjScroll.__renderBeforeTweenList = HjScroll.__renderBeforeTweensList = [];
		}

		// if: ins 넘어올시 해당 ins 처리
		// else: 넘어오지 않을 시 watching 중인 instance들 처리	 
		if(ins && ins instanceof  HjScroll){
			reCalc(ins.tl);
		}
		else {
			for(var i = 0, len = HjScroll.__watchInstance.length; i < len; i++){
				reCalc(HjScroll.__watchInstance[i].tl);
			}
		}

		console.log('resize');
		scrollFnProcess();

		// 사이즈 재계산 함수 (Timeline -> Tws Update)
		function reCalc(tl){
			var tws = tl.getChildren();
			var tempTarget;
			for(var i = 0, len = tws.length; i < len; i++){
				if(Array.isArray(tws[i].target)){ tempTarget = tws[i].target[0]; }
				else { tempTarget = typeof tws[i].target === 'function' ? tws[i].target.el : tws[i].target }

				console.log('recalc', tws[i])

				if(tws[i].scrollStandard){
					// 페이지 전체 기준 Tw
					tws[i].totalDuration(HjScroll.docHeight);
				}
				else if(tws[i].target.scrollPosition){
					// ScrollAnimate(Callback)
					if(tws[i].fixed){
						console.log(calcStartPosition([].concat(tws[i].target.scrollPosition), el, HjScroll.docHeight))
						tws[i].startTime(calcStartPosition([].concat(tws[i].target.scrollPosition), false, HjScroll.docHeight));
					}
					else {
						tws[i].startTime(calcStartPosition([].concat(tws[i].target.scrollPosition), tempTarget));
					}
				}
				else{
					// ProgressAnimate
					if(tws[i].fixed){

						tws[i].totalDuration(calcDuration(tws[i].scrollPosition, tws[i].offsetTop, HjScroll.docHeight));
						tws[i].startTime(calcStartPosition(tws[i].scrollPosition, false, HjScroll.docHeight))
					}
					else {
						tws[i].totalDuration(calcDuration(tws[i].scrollPosition, tws[i].offsetTop));
						tws[i].startTime(calcStartPosition(tws[i].scrollPosition, tempTarget))
					}
				}
			}
		}
	};

	// 스크롤시 처리될 함수
	function scrollFnProcess() {
		var scroll =
			window.scrollY
			|| window.pageYOffset
			|| document.documentElement.scrollTop;
		var per =  (scroll + HjScroll.winHeight) / HjScroll.docHeight;
		// NAN 처리
		per = per !== per ? 0 : per;
		//console.log('scrollProgress', per);
		for(var i = 0, len = HjScroll.__watchInstance.length; i < len; i++){
			HjScroll.__watchInstance[i].tl.progress(per);
		}
	}

	function calcDuration(position, processOffsetTop, standardVal) {
		standardVal = standardVal || HjScroll.winHeight;
		processOffsetTop = processOffsetTop || 0;
		return standardVal * (position[1] - position[0]) - processOffsetTop;
	}
	function calcStartPosition(position, el, standardVal){
		standardVal = standardVal || HjScroll.winHeight;
		return ((el && el.documentOffsetTop()) || 0) + (position[0] * standardVal);
	}

	return HjScroll;

})(TimelineMax);