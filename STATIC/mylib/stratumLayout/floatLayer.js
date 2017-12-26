/* > ie 9 */
// object.assign polyfill

[window.stratum, window.FloatLayer] = (function () {
	// UTILS
	let getBoundingClientRect = (el) => el.getBoundingClientRect()
	let sel = (str) => {
		return typeof jQuery !== "undefined" ? jQuery(str).get() : document.querySelectorAll(str)[0]
	}
	let extend = (o = {}, o2 = {}) => {
		var obj = {}
		for (let key in o2) {
			if (o2.hasOwnProperty(key)) o[key] = o2[key]
		}
		return o;
	}

	class FloatLayer {

		constructor({ _parent, _style } = { _parent: sel('body'), _style: {} }) {
			let layer = this._layer = document.createElement("div")
			layer.setAttribute("class", "float_layer")
			Object.assign(layer.style, style);
			layer.style['pointer-events'] = 'none'
			layer.style.position = 'fixed'
			layer.style.width = '100%'
			layer.style.height = '100%'
			layer.style.display = 'none'
			layer.style.top = 0
			layer.style.left = 0

			styleApply(layer, style)

			console.log(_parent)
			parent.appendChild(layer)

			return this
		}

		mirror(target) {
			sel(target).map(mirroring(target))

			el.style.position = 'absolute'

			function mirroring(target) {
				return function (v) {
					target.appendChild(v.cloneNode(true))
				}
			}

			return this
		}

		clear() {
			return this.layer.innerHTML = ''
		}

		get layer() {
			return this.layer
		}

		set layer(layer) {
			this.layer = layer
		}

	}

	FloatLayer.SHADOW_LEVEL0 = "0 0px 0px 0 rgba(0, 0, 0, 0), 0 0px 0px 0 rgba(0, 0, 0, 0)"

	return [, FloatLayer]
})();
console.log('aa')