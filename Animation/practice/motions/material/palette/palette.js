(function ($) {
	// 원 컬러 세팅
	function colorSetting() {
		$('.palette .colors circle').each(function () {
			$(this).attr('fill', createRandomColor());
		})
	}

	// 컬러 랜덤 생성
	function createRandomColor() {
		var color = "#" + $.map(Array.apply(this, new Array(6)), function () {
			return Math.floor(Math.random() * 16).toString(16);
		}).join('');
		return color;
	}

	var xRatio = 1, yRatio = 1;
	var rectEl = $('.whiteboard').get(0);

	$(window).on('resize', function () {
		requestAnimationFrame(function () {
			var realSize = rectEl.getClientRects()[0] || (rectEl.getBoundingClientRect && rectEl.getBoundingClientRect());
			var viewBox = rectEl.getBBox();


			xRatio = viewBox.width / realSize.width;
			yRatio = viewBox.height / realSize.height;
		})
	});
	$(window).trigger('resize');



	// 초기화, 이벤트 등록
	(function init() {

		// 원 컬러 세팅 적용
		colorSetting();

		// 컬러 랜덤바꾸기 버튼
		$('.colors text, .colors rect').click(function () {
			console.log('Color Change');
			colorSetting();
		});

		var getBoard = function () {
			var clientRects = rectEl.getClientRects()[0] || (rectEl.getBoundingClientRect && rectEl.getBoundingClientRect());
			return {
				x: clientRects.x,
				y: clientRects.y,
				maxX: clientRects.x + clientRects.width,
				maxY: clientRects.y + clientRects.height
			}
		};

		// 마우스가 화이트보드 영역 안에 있나 검사
		var isInWhiteBoard = function(x, y) {
			var b = false;
			var boardData = getBoard()

			if( (x >= boardData.x && x <= boardData.maxX)
				&& (y >= boardData.y && y <= boardData.maxY) ) {
				b = true;
			}
			return b;
		};
		var wbTl = new TimelineLite({paused:true})
			.set('.whiteboard rect',  {strokeDasharray: 0, attr:{stroke:'#7C4DFF'}});

		// 원(복제) 잡기 - 끌기
		$('.colors circle').on('mousedown touchstart', function (e) {
			console.log('down');
			var downXY = {
				x: e.pageX || e.originalEvent.targetTouches[0].pageX,
				y: e.pageY || e.originalEvent.targetTouches[0].pageY
			};
			var $clone = $(this).clone().addClass('picked').appendTo('.palette');

			$(document).on('mousemove touchmove', function (e) {
				var x = e.pageX || e.originalEvent.targetTouches[0].pageX;
				var y = e.pageY || e.originalEvent.targetTouches[0].pageY;
				// TweenMax.set($clone, {x: x - downXY.x, y: y - downXY.y});
				TweenMax.set($clone, {x: x * xRatio - downXY.x * xRatio, y: y *  yRatio - downXY.y * xRatio});

				if(isInWhiteBoard(x, y)) {
					wbTl.play();
				}
				else {
					wbTl.reverse();
				}
			});
		});

		// 원 놓기
		$(document).on('mouseup', '.picked', function (e) {
			var $wb = $('.whiteboard');
			var x = e.pageX || $(this).offset().left;
			var y = e.pageY || $(this).offset().top;

			console.log('up');
			if(isInWhiteBoard(x, y)){
				var $bgCircle = $(this).clone().attr( {
					cx: parseInt($(this).attr('cx')) - parseInt($wb.attr('x')),
					cy: parseInt($(this).attr('cy')) - parseInt($wb.attr('y'))
				}).removeClass('picked').addClass('bg').appendTo('.whiteboard');
				TweenMax.to($bgCircle, .4, {
					attr: { r:720 },
					onComplete: function () {
						$('.whiteboard circle').not('.whiteboard circle:last').remove();
					}
				});
			}
			$(this).fadeOut(250, function () {
				console.log('remove');
				$(this).remove();
			});
			wbTl.reverse();
			$(document).off('.colorpick');
		});

		// 모바일 추가 지원
		$(document).on('touchend', function () {
			$('.picked').trigger('mouseup');
		});

		// 팔레트 나갔을 시 원 놓아지기
		$('.palette').mouseleave(function (e) {
			console.log('leave');
			$('.picked').trigger('mouseup');
		});

		// 페이지 드래그 셀렉트 기본이벤트 방지
		$(document).bind('selectstart',function(e) {e.preventDefault()});
		$(document).bind('dragstart',function(e){e.preventDefault()});
	})();
})(jQuery);