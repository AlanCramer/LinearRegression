
// creates a d3 chart
// input is a set of data
//
function addScatterPlot(chartname, data, xAxisLabel, yAxisLabel) {

    var xlabel = xAxisLabel || "x-axis Label";
    var ylabel = yAxisLabel || "y-axis Label";

    var margin = {top: 20, right: 20, bottom: 30, left: 30},
        width = 450 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;
    
    var chart = d3.select(chartname)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
    var x = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.x; })])
        .range([0, width]);

    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.y; })])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickSize([6]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);
    
    chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("transform", "translate(0, 30)")
      .attr("x", width)
      .attr("dx", ".71em")
      .style("text-anchor", "end")
      .text(xlabel);

    chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(ylabel);
    
    chart.selectAll(".bar")
      .data(data)
    .enter().append("circle")
      .attr("class", "bar")
      .attr("cx", function(d) { return x(d.x); })
      .attr("cy", function(d) { return y(d.y); })
      .attr("r", 3)

    return {chart:chart, xscale:x, yscale:y};
};


function addSquareDeltas(chartInfo, data, t0, t1) {
    
    var ci = chartInfo;
    
    ci.chart.selectAll(".sqDelta")
      .data(data)
    .enter().append("rect")
      .attr("class", "sqDelta")
      .each(function(d) {

        var term = d.y - (t0 + t1*d.x);
        
        d3.select(this).attr({
          x:  ci.xscale(term > 0 ? d.x : d.x+term),
          y:  ci.yscale(term > 0 ? d.y : d.y-term),
          width: ci.xscale (Math.abs(term)),
          height: 400 - ci.yscale (Math.abs(term))
        });
      });
};



// t0 and t1 are thetas. That is, the line to graph is
// y = t0 + t1*x
// x and y are d3 scales
//
function addFitLine(chart, t0, t1, x, y, color) {
    
    var lineColor = color || "green";

    var x0 = x.domain()[0];
    var x1 = x.domain()[1];
    var y0 = t0 + t1*x0;
    var y1 = t0 + t1*x1;
    
    var line = chart.append("line")
        .attr("x1", x(x0))
        .attr("y1", y(y0))
        .attr("x2", x(x1))
        .attr("y2", y(y1))
        .attr("stroke", lineColor);
};

function type(d) {
  d.x = +d.x; // coerce to number
  d.y = +d.y; // coerce to number
  return d;
};


