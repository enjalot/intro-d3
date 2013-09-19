if(!d3.chart) d3.chart = {};

d3.chart.histogram = function() {
  var data;
  var g;
  var width = 300;
  var height = 300;
  var cx = 10;
  var cy = 0;
  var dispatch = d3.dispatch(chart, "hover")
  function chart(group) {
    //init
    g = group;
    update();
  }

  function update() {
    var max = d3.max(data, function(d) { return d.data.score })

    var hist = d3.layout.histogram()
    .value(function(d) { return d.data.score })
    .range([0, max ])
    .bins(5);

    var layout = hist(data);

    xmax = d3.max(layout, function(d) { return d.length })

    var xScale = d3.scale.linear()
    .domain([0, xmax])
    .range([cx, width])

    var yScale = d3.scale.ordinal()
    .domain(d3.range(layout.length))
    .rangeBands([height,cy], 0.1)

    var rects = g.selectAll("rect")
    .data(layout)

    rects.enter()
    .append("rect")
    .classed("bin", true)

    rects.exit().remove()

    rects.attr({
      x: cx,
      y: function(d, i) { return yScale(i) },
      height: yScale.rangeBand(),
      width: function(d) { return xScale(d.length) }
    })
    .on("click", function(d) {
      console.log("bin", d)
    })
    .on("mouseover", function(d) {
      d3.select(this).style("fill", "#dfefef")
      dispatch.hover(d);
    })
    .on("mouseout", function(d) {
      d3.select(this).style("fill", "")
      dispatch.hover([]);
    })
  }
  chart.update = update;

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
  return d3.rebind(chart, dispatch, "on");
}

