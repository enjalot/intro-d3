if(!d3.chart) d3.chart = {};

d3.chart.brush = function() {
  var data;
  var g;
  var width = 500;
  var height = 30;
  var cx = 10;
  var cy = 0;
  var brush = d3.svg.brush()
  var dispatch = d3.dispatch(chart, "filter")
  function chart(group) {
    //init
    g = group;
    var xg = g.append("g")
      .classed("axis", true)
      .classed("xaxis", true)

    update();
  }

  function update() {
    var maxCreated = d3.max(data, function(d) { return d.data.created });
    var minCreated = d3.min(data, function(d) { return d.data.created });
    var mid = maxCreated - (maxCreated - minCreated)/2;

    var createdScale = d3.time.scale()
      .domain([minCreated, maxCreated])
      .range([0, width])

    brush.x(createdScale)

    var xAxis = d3.svg.axis()
    .scale(createdScale)
    .tickValues([new Date(minCreated), new Date(mid), new Date(maxCreated)])
    .tickFormat(d3.time.format("%x %H:%M"))

    xg = g.select(".xaxis")
      .attr("transform", "translate(" + [0, height] + ")")
      .call(xAxis)

    brush.extent([mid, maxCreated])
    brush(g);

    g.selectAll("rect")
     .attr("height", height);

    var rw = 1;

    var rects = g.selectAll("rect.event")
      .data(data, function(d) { return d.data.id })
    rects.enter()
    .append("rect")
    .classed("event", true)
    rects.attr({
      x: function(d) { return createdScale(d.data.created) - rw/2 },
      width: rw,
      height: 30,
      "pointer-events": "none"
    })

    brush.on("brushend", render);
    function render() {
      var ext = brush.extent();
      var filtered = data.filter(function(d) { return d.data.created < ext[1] && d.data.created > ext[0] });
      rects
        .style("stroke-opacity", 0.3);
      rects.data(filtered, function(d) { return d.data.id })
        .style("stroke-opacity", 0.9);
      dispatch.filter(filtered)
    }
    render();
  }
  chart.update = update;

  chart.highlight = function(data) {
    g.selectAll("rect.event")
    .style({
      "stroke": "",
      "stroke-width": 1
    })
    var rects = g.selectAll("rect.event")
      .data(data, function(d) { return d.data.id });
    rects.style({
      "stroke": "orange",
      "stroke-width": 2
    })
  }

  chart.data = function(value) {
    if(!arguments.length) return data;
    data = value;
    return chart;
  }
  chart.width = function(value) {
    if(!arguments.length) return width;
    width = value;
    return chart;
  }
  return d3.rebind(chart, dispatch, "on");
}



