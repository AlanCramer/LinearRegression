
// creates a d3 chart
// input is a set of data
//
function addScatterPlot(chartname, data, xAxisLabel, yAxisLabel, inWidth, inHeight) {

    var ci = setUpChart(chartname, data, xAxisLabel, yAxisLabel, inWidth, inHeight);
    
    ci.chart.selectAll(".bar")
      .data(data)
    .enter().append("circle")
      .attr("class", "bar")
      .attr("cx", function(d) { return ci.xscale(d.x); })
      .attr("cy", function(d) { return ci.yscale(d.y); })
      .attr("r", 3);

    return ci;
};



function addSquareDeltas(chartInfo, data, t0, t1) {
    
    var ci = chartInfo;
    
    var squares = ci.chart.selectAll(".sqDelta")
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
      
    ci.chart.selectAll(".sqLines")
      .data(data)
    .enter().append("line")
      .attr("x1", function(d) { return ci.xscale(d.x) })
      .attr("y1", function(d) { return ci.yscale(d.y) })
      .attr("x2", function(d) { return ci.xscale(d.x) })
      .attr("y2", function(d) { return ci.yscale(t0 + t1*d.x) })
      .attr("stroke", "black");
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
        
    return line;
};

// graph the cost function transpose(theta)*x for each x
//
function addThetaCostGraph(svgElemName, theta, data, width, height, falsepx, truepx) {
    
    var fpx = falsepx || 1;
    var tpx = truepx || 4;
    
    // erase the previous
    d3.select(svgElemName).selectAll("*").remove();
    
    var separaterEval = [];
    var hyp = thetaTransposeX(theta);
    
    data.forEach(function(d, i) {
        var ytrue = d.y === 1; 
        separaterEval.push({x:i, y:hyp(d.x), ytrue:ytrue });
    });
    
    var ci = setUpChartPosNeg(svgElemName, separaterEval, width, height, "data point index", "Theta Cost");
        
    ci.chart.selectAll(".bub")
      .data(separaterEval)
    .enter().append("circle")
      .attr("class", "bub")
      .attr("cx", function(d) { return ci.xscale(d.x); })
      .attr("cy", function(d) { return ci.yscale(d.y); })
      .attr("fill", function(d) { return d.ytrue ? "midnightblue" : "steelblue"})
      .attr("r", function(d) { return d.ytrue ? fpx : tpx })
    ;
    
}



function setUpChart(chartname, data, xAxisLabel, yAxisLabel, inWidth, inHeight) {
             
    var inW = inWidth || 450;    
    var inH = inHeight || 450;  
    
    var xlabel = xAxisLabel || "x-axis Label";
    var ylabel = yAxisLabel || "y-axis Label";

    var margin = {top: 20, right: 20, bottom: 30, left: 60},
        width = inW - margin.left - margin.right,
        height = inH - margin.top - margin.bottom;
    
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

    return {chart:chart, xscale:x, yscale:y};
};

// oh the painful duplication!!
// chart for x0 vs x1. The diff is the format of the data.
function setUp2DChart(chartname, data, xAxisLabel, yAxisLabel) {
        
    var xlabel = xAxisLabel || "x-axis Label";
    var ylabel = yAxisLabel || "y-axis Label";

    var margin = {top: 20, right: 20, bottom: 30, left: 60},
        width = 300 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;
    
    var chart = d3.select(chartname)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
    var x0 = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.x[0]; })])
        .range([0, width]);

    var x1 = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.x[1]; })])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom")
        .tickSize([6]);

    var yAxis = d3.svg.axis()
        .scale(x1)
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

    return {chart:chart, x0scale:x0, x1scale:x1};
};


// oh the painful duplication!!
// chart for negative to positive y value. The diff is the y scale.
function setUpChartPosNeg(chartname, data, inWidth, inHeight, xAxisLabel, yAxisLabel) {
     
    var inW = inWidth || 900;    
    var inH = inHeight || 450;     
        
    var xlabel = xAxisLabel || "x-axis Label";
    var ylabel = yAxisLabel || "y-axis Label";

    var margin = {top: 20, right: 20, bottom: 30, left: 60},
        width = inW - margin.left - margin.right,
        height = inH - margin.top - margin.bottom;
    
    var chart = d3.select(chartname)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
    var x = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.x; })])
        .range([0, width]);

    var y = d3.scale.linear()
        .domain([d3.min(data, function(d) { return d.y; }), d3.max(data, function(d) { return d.y; })])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickSize([6]);

    var xAxis2 = d3.svg.axis()
        .scale(x)
        .orient("middle");
        
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
    .append("line")       // origin line
      .attr("y1", y(0))
      .attr("y2", y(0))
      .attr("x1", 0)
      .attr("x2", width)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(ylabel)
    ;
      
    return {chart:chart, xscale:x, yscale:y};
};





function type(d) {
  d.x = +d.x; // coerce to number
  d.y = +d.y; // coerce to number
  return d;
};


