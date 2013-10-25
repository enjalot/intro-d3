if(!d3.chart) d3.chart = {};

d3.chart.table = function() {
  var data;
  var div;

  function chart(container) {
    div = container;
    var table = div.append("table")
    update();
  }

  function update() {
    var table = div.select("table")
    var trs = table.selectAll("tr.data")
      .data(data, function(d) { return d.data.id })

    var enter = trs.enter()
      .append("tr")
      .classed("data", true)

    trs.exit().remove();

    enter.append("td")
      .text(function(d) { return d.data.score })
    enter.append("td")
      .append("img")
      .attr("src", function(d) { return d.data.thumbnail})
    enter.append("td")
      .append("a")
      .attr("href", function(d) { return d.data.url })
      .text(function(d) { return d.data.title })
    enter.append("td")
      .text(function(d) { return d.data.ups })
    enter.append("td")
      .text(function(d) { return d.data.downs })
  }

  chart.update = update;

  chart.highlight = function(data) {
    div.selectAll("tr").selectAll("td")
    .style({
      "background-color": ""
    })
    var trs = div.selectAll("tr")
      .data(data, function(d) { return d.data.id });
    trs.selectAll("td").style({
      "background-color": "orange",
      border: "1px solid black"
    })
  }

  chart.data = function(value) {
    if(!arguments.length) return data;
    data = value;
    return chart;
  }
  return chart;
}

