if(!d3.chart) d3.chart = {};

d3.chart.scatter = function() {
  var data;
  var g;
  var width = 500;
  var height = 300;
  var cx = 10;
  function chart(group) {
    //init
    g = group;
    group.append("g")
      .classed("axis", true)
      .classed("xaxis", true)
    group.append("g")
      .classed("axis", true)
      .classed("yaxis", true)
    update();
  }

  function update() {
    var maxCreated = d3.max(data, function(d) { return d.data.created });
    var minCreated = d3.min(data, function(d) { return d.data.created });
    var maxScore = d3.max(data, function(d) { return d.data.score })

    var createdScale = d3.time.scale()
        .domain([minCreated, maxCreated])
        .range([cx, width])

    var colorScale = d3.scale.linear()
      .domain([minCreated, maxCreated])
      .range(["#D5E9E5", "#12882A"])
      .interpolate(d3.interpolateHcl)

    var yScale = d3.scale.linear()
      .domain([0, maxScore])
      .range([height, cx])
  
     var xAxis = d3.svg.axis()
    .scale(createdScale)
    .ticks(3)
    .tickFormat(d3.time.format("%x %H:%M"))

    var yAxis = d3.svg.axis()
    .scale(yScale)
    .ticks(3)
    .orient("left")

    var xg = g.select(".xaxis")
      .attr("transform", "translate(" + [0,height] + ")")
      .call(xAxis)

    var yg = g.select(".yaxis")
      .classed("axis", true)
      .classed("yaxis", true)
      .attr("transform", "translate(" + [cx - 5,0] + ")")
      .call(yAxis)
    
    var circles = g.selectAll("circle")
      .data(data, function(d) { return d.data.id });
    circles.enter()
    .append("circle")
    .attr({
      cx: 0,
      cy: height,
      fill: function(d) { return colorScale(d.data.created) },
      title: function(d) { return d.data.title + " score: " + d.data.score}
    })

    circles.transition()
    .duration(150)
    .attr({
      cx: function(d,i) { return createdScale(d.data.created) },
      cy: function(d,i) { return yScale(d.data.score) },
      r: 5
    })
    circles.exit().transition()
      .duration(150)
      .attr({ r: 0.0001 })
      .remove()
    $('circle').tipsy({gravity: 'sw'})
  }
  chart.update = update;

  chart.highlight = function(data) {
    g.selectAll("circle")
    .style({
      "stroke-width": 0
    })
    var circles = g.selectAll("circle")
      .data(data, function(d) { return d.data.id });
    circles.style({
      "stroke": "orange",
      "stroke-width": 3
    })
  }

  chart.data = function(value) {
    if(!arguments.length) return data;
    data = value;
    return chart;
  }
  chart.height = function(value) {
    if(!arguments.length) return height;
    height = value;
    return chart;
  }
  return chart;
}

