/**
 * Hoejun Dots - v0.1
 * 2017-11-14
 *
 * dots.add(jQueryEls || HTMLelements || selectorString , [etcString = '...'])
 * dots.remove(jQueryEls || HTMLelements || selectorString)
 * */
var dots = (function(){
	return {
		add: function (sel, etcString) {
			var els = getElementArray(sel);
			for(var i = 0, len = els.length; i < len; i++){
				dotAdd(els[i], etcString);
			}
		},
		remove: function (sel) {
			var els = getElementArray(sel);
			for(var i = 0, len = els.length; i < len; i++){
				dotRemove(els[i]);
			}
		},
		//addWatch: function (selStr) {
		//
		//},
		//removeWatch: function (selStr) {
		//
		//},
	};

	function dotAdd(el, etc) {
		var wordArray = el.innerHTML.split(" ");
		var rest = [];
		while (el.scrollHeight > el.offsetHeight) {
			rest.push(wordArray.pop());
			el.innerHTML = wordArray.join(" ")
				+ '<div class="__dots__" style="display:inline">' + (etc || "...") + '</div>'
				+ ' <div class="__rest__" style="display:none">' + rest.join(" ") + '</div>'
		}
	}
	function dotRemove(el) {
		var restEl = el.querySelector('.__rest__');
		var restStr = '';
		if(!restEl) { return }
		restStr = restEl.innerHTML;
		el.removeChild(el.querySelector('.__dots__'));
		el.removeChild(restEl);
		el.innerHTML = el.innerHTML + restStr;
	}
	/*** UTILS ***/
	function getElementArray(sel) {
		return isJquery(sel) ? jQuery(sel).get() : isElement(sel) ? sel : document.querySelectorAll(sel);
	}
	function isElement(o){
		return (
			typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
				o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
		);
	}
	function isJquery(o) {
		return (typeof jQuery !== 'undefined') ? o instanceof jQuery : false
	}
})();