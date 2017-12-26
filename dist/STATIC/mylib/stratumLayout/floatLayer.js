"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ref = function () {
	// UTILS
	var getBoundingClientRect = function getBoundingClientRect(el) {
		return el.getBoundingClientRect();
	};
	var sel = function sel(str) {
		return typeof jQuery !== "undefined" ? jQuery(str).get() : document.querySelectorAll(str)[0];
	};
	var extend = function extend() {
		var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		var o2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		var obj = {};
		for (var key in o2) {
			if (o2.hasOwnProperty(key)) o[key] = o2[key];
		}
		return o;
	};

	var FloatLayer = function () {
		function FloatLayer() {
			var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { _parent: sel('body'), _style: {} },
			    _parent = _ref2._parent,
			    _style = _ref2._style;

			_classCallCheck(this, FloatLayer);

			var layer = this._layer = document.createElement("div");
			layer.setAttribute("class", "float_layer");
			Object.assign(layer.style, style);
			layer.style['pointer-events'] = 'none';
			layer.style.position = 'fixed';
			layer.style.width = '100%';
			layer.style.height = '100%';
			layer.style.display = 'none';
			layer.style.top = 0;
			layer.style.left = 0;

			styleApply(layer, style);

			console.log(_parent);
			parent.appendChild(layer);

			return this;
		}

		FloatLayer.prototype.mirror = function mirror(target) {
			sel(target).map(mirroring(target));

			el.style.position = 'absolute';

			function mirroring(target) {
				return function (v) {
					target.appendChild(v.cloneNode(true));
				};
			}

			return this;
		};

		FloatLayer.prototype.clear = function clear() {
			return this.layer.innerHTML = '';
		};

		_createClass(FloatLayer, [{
			key: "layer",
			get: function get() {
				return this.layer;
			},
			set: function set(layer) {
				this.layer = layer;
			}
		}]);

		return FloatLayer;
	}();

	FloatLayer.SHADOW_LEVEL0 = "0 0px 0px 0 rgba(0, 0, 0, 0), 0 0px 0px 0 rgba(0, 0, 0, 0)";

	return [, FloatLayer];
}(); /* > ie 9 */
// object.assign polyfill

window.stratum = _ref[0];
window.FloatLayer = _ref[1];

console.log('aa');
//# sourceMappingURL=floatLayer.js.map