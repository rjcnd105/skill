/*
* body {
 font: 10px sans-serif;
 }

 .axis path,
 .axis line {
 fill: none;
 stroke: #000;
 shape-rendering: crispEdges;
 }

 .x.axis path {
 display: none;
 }

 .line {
 fill: none;
 stroke: steelblue;
 stroke-width: 2px;
 }

 .circle {
 fill: white;
 stroke: steelblue;
 stroke-width: 2px;
 }

 .area {
 fill: steelblue;
 stroke: none;
 opacity: 0.1;
 }

 .zeroline {
 fill: none;
 stroke: red;
 stroke-width: 0.5px;
 stroke-dasharray: 5 5;
 }

 .zerolinetext {
 fill: red;
 }

 .overlay {
 fill: none;
 stroke: none;
 pointer-events: all;
 }

 .focusLine {
 fill: none;
 stroke: steelblue;
 stroke-width: 0.5px;
 }

 .focusCircle {
 fill: steelblue;
 }
* */

var warnLine = {
	lineValue: 200,
	label: 'my important threshold'
};
// generate some random data
var data = [];
var currentValue = 100;
var random = d3.random.normal(0, 20.0);

for (var i = 0; i < 100; i++) {
	var currentDate = new Date();
	currentDate.setDate(currentDate.getDate() + i);

	data.push([currentDate, currentValue]);
	currentValue = Math.abs(currentValue + random());
}

var drawLineGraph = function(containerHeight, containerWidth, data, yLabel, warnLine) {

	var svg = d3.select("body").append("svg")
		.attr("width", containerWidth)
		.attr("height", containerHeight);

	var margin = {
		top: 50,
		left: 50,
		right: 50,
		bottom: 50
	};

	var height = containerHeight - margin.top - margin.bottom;
	var width = containerWidth - margin.left - margin.right;

	var xDomain = d3.extent(data, function(d) {
		return d[0];
	})
	var yDomain = d3.extent(data, function(d) {
		return d[1];
	});

	var xScale = d3.time.scale().range([0, width]).domain(xDomain);
	var xScale2 = d3.time.scale().range([0, 1]).domain(xDomain);
	var yScale = d3.scale.linear().range([height, 0]).domain(yDomain);

	var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
	var yAxis = d3.svg.axis().scale(yScale).orient('left');

	var line = d3.svg.line()
		.x(function(d) {
			return xScale(d[0]);
		})
		.y(function(d) {
			return yScale(d[1]);
		});

	var area = d3.svg.area()
		.x(function(d) {
			return xScale(d[0]);
		})
		.y0(function(d) {
			return yScale(d[1]);
		})
		.y1(height);

	var g = svg.append('g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

	g.append('path')
		.datum(data)
		.attr('class', 'area')
		.attr('d', area);

	g.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(0, ' + height + ')')
		.call(xAxis);

	g.append('g')
		.attr('class', 'y axis')
		.call(yAxis)
		.append('text')
		.attr('transform', 'rotate(-90)')
		.attr('y', 6)
		.attr('dy', '.71em')
		.attr('text-anchor', 'end')
		.text(yLabel);

	g.append('path')
		.datum(data)
		.attr('class', 'line')
		.attr('d', line);
	/*
	 g.selectAll('circle').data(data).enter().append('circle')
	 .attr('cx', function(d) { return xScale(d[0]); })
	 .attr('cy', function(d) { return yScale(d[1]); })
	 .attr('r', 5)
	 .attr('class', 'circle');
	 */
	// focus tracking

	var focus = g.append('g').style('display', 'none');

	with(focus) {
		append('line')
			.attr('id', 'focusLineX')
			.attr('class', 'focusLine');
		append('line')
			.attr('id', 'focusLineY')
			.attr('class', 'focusLine');

		append('circle')
			.attr('id', 'focusCircle')
			.attr('r', 3)
			.attr('class', 'circle focusCircle');
		append("text")
			.attr('id', 'focusTexty')
			.attr("x", 9)
			.attr("dy", ".35em");
		append("text")
			.attr('id', 'focusTextx')
			.attr("x", 9)
			.attr("dy", ".35em");
	}
	var bisectDate = d3.bisector(function(d) {
		return d[0];
	}).left;
	g.append('rect')
		.attr('class', 'overlay')
		.attr('width', width)
		.attr('height', height)
		.on('mouseover', function() {
			focus.style('display', null);
		})
		.on('mouseout', function() {
			focus.style('display', 'none');
		})
		.on('mousemove', function() {
			var mouse = d3.mouse(this);
			var mouseDate = xScale.invert(mouse[0]);
			var i = bisectDate(data, mouseDate); // returns the index to the current data item
			var d0 = data[i - 1];
			var d1 = data[i];
			// work out which date value is closest to the mouse
			var d = mouseDate - d0[0] > d1[0] - mouseDate ? d1 : d0;

			var x = xScale(d[0]);
			var y = yScale(d[1]);

			var MIN = 0,
				MAX = 1;
			with(focus) {
				select('#focusCircle')
					.attr('cx', x)
					.attr('cy', y);
				select('#focusLineX')
					.attr('x1', x).attr('y1', yScale(yDomain[MIN]))
					.attr('x2', x).attr('y2', yScale(yDomain[MAX]));
				select('#focusLineY')
					.attr('x1', xScale(xDomain[MIN])).attr('y1', y)
					.attr('x2', xScale(xDomain[MAX])).attr('y2', y);
				select("#focusTexty")
					.attr("transform", "translate(" + xScale(xDomain[MIN]) + "," + (y - 10) + ")")
					// you may want to format the value here
					.text(d[1]);
				x = x - focus.select("#focusTextx").node().getComputedTextLength() * xScale2(d[0]);
				select("#focusTextx")
					.attr("transform", "translate(" + x + "," + (yScale(yDomain[MAX]) - 10) + ")")
					// you may want to format the value here
					.text(d[0]);
			}
		});
};
drawLineGraph(400, 800, data, "Intensity", {
	lineValue: 200,
	label: "OMG!"
});
drawLineGraph(400, 800, data, 'awesomenes', warnLine);