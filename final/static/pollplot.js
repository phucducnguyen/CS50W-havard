function plotWeatherData(data, dim) {

	document.getElementById("my_dataviz").innerHTML = "";

    // function to get a random color
	function getRandomColor() {
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	graphData = JSON.parse(data.chart_data)
	// set the dimensions and margins of the graph
	var margin = {top: 15, right: 35, bottom: 20, left: 35};
	var svgWidth = window.innerWidth*0.99; 
	var svgHeight = window.innerHeight*0.25;
	var graphWidth = svgWidth - margin.left - margin.right;
	var graphHeight = svgHeight - margin.top - margin.bottom;

	// parse the date / time
	// var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;
	var parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S");
	var bisectDate = d3.bisector(function(d) { return d.date; }).left;
	var dateFormatter = d3.timeFormat("%y/%m/%d %H:%M");

	// set the ranges
	var x = d3.scaleTime().range([0, graphWidth]);
	var y = d3.scaleLinear().range([graphHeight, 0]);

	var xAxis = d3.axisBottom(x).ticks(5);
	var yAxis = d3.axisLeft(y).ticks(5);

	valueLine = d3.line()
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(d[dim]); });

	var svg = d3.select("#my_dataviz")
	    .append("svg")
	        .attr("width", svgWidth)
	        .attr("height", svgHeight)
	    .append("g")
	        .attr("transform", 
	        "translate(" + margin.left + "," + margin.top + ")")

	var data = graphData;
	// For each row in the data, parse the date
	// and use + to make sure data is numerical
	graphData.forEach(function(d) {
	d.date = parseDate(d.date);
	});

	// Scale the range of the data
	x.domain(d3.extent(graphData, function(d) { return d.date; }));
	y.domain([d3.min(graphData, function(d) {
	  return Math.min(d[dim]) }),
	  d3.max(graphData, function(d) {
	  return Math.max(d[dim]) })]);

	// Add the highLine as a green line
	svg.append("path")
	.style("stroke", getRandomColor())
	.style("fill", "none")
	.attr("class", "line")
	.attr("d", valueLine(graphData));
	// Add the X Axis
	svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + graphHeight + ")")
	.call(xAxis);
	// Add the Y Axis
	svg.append("g")
	.attr("class", "y axis")
	.call(yAxis);

	// here we add the mousehover function
    var focus = svg.append("g")
	    .attr("class", "focus")
	    .style("display", "none");

	focus.append("circle")
	    .attr("r", 5);

	focus.append("rect")
	    .attr("class", "tooltip")
	    .attr("width", 150)
	    .attr("height", 50)
	    .attr("x", 10)
	    .attr("y", -22)
	    .attr("rx", 4)
	    .attr("ry", 4);

	focus.append("text")
	    .attr("class", "tooltip-date")
	    .attr("x", 18)
	    .attr("y", -2);

	focus.append("text")
	    .attr("x", 18)
	    .attr("y", 18)
	    .text(dim+": ");

	focus.append("text")
	    .attr("class", "tooltip-likes")
	    .attr("x", 60)
	    .attr("y", 18);

	svg.append("rect")
	    .attr("class", "overlay")
	    .attr("width", graphWidth)
	    .attr("height", graphHeight)
	    .on("mouseover", function() { focus.style("display", null); })
	    .on("mouseout", function() { focus.style("display", "none"); })
	    .on("mousemove", mousemove);

	function mousemove() {
	    var x0 = x.invert(d3.mouse(this)[0]),
	        i = bisectDate(graphData, x0, 1),
	        d0 = graphData[i - 1],
	        d1 = graphData[i],
	        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
	    focus.attr("transform", "translate(" + x(d.date) + "," + y(d[dim]) + ")");
	    focus.select(".tooltip-date").text(dateFormatter(d.date));
	    focus.select(".tooltip-likes").text(d[dim].toFixed(2));
	}
};