var whiteblue = d3.interpolateRgb("crimson", "steelblue"),
	blueorange = d3.interpolateRgb("steelblue", "orange"),
	orangewhite = d3.interpolateRgb("orange", "crimson");
d3.select("body").selectAll("div")
	.data(d3.range(500))
	.enter().append("div")
	.transition()
	.delay(function(d, i) { return Math.random() * 1000; })
	.ease(d3.easeLinear)
	.on("start", function repeat() {
		d3.active(this)
			.styleTween("background-color", function() { return whiteblue; })
			.transition()
			.delay(1000)
			.styleTween("background-color", function() { return blueorange; })
			.transition()
			.delay(1000)
			.styleTween("background-color", function() { return orangewhite; })
			.transition()
			.delay(1000)
			.on("start", repeat);
	});