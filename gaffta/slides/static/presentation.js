(function() {



  //make_trib({code: "code/intro.js", display: "#display1", editor: "#editor1"});

  //nils text
  //make_trib_gist({gistid: "3891155", display: "#display2", editor: "#editor2"});
  //ej responsive
  //make_trib_gist({gistid: "3897791", display: "#display3", editor: "#editor3"});
  //gradient controls
  //make_trib_gist({gistid: "3897603", display: "#display4", editor: "#editor4"});

  //calendar
  //make_trib_gist({gistid: "3791303", display: "#display5", editor: "#editor5"});
  //cost of living (michi help)
  //make_trib_gist({gistid: "3898087", display: "#display6", editor: "#editor6"});
  //meetup help (ej + erik help)
  //make_trib_gist({gistid: "3891115", display: "#display7", editor: "#editor7"});

  /*
  //logistic map by moebio
  make_trib_gist({gistid: "3898111", display: "#display8", editor: "#editor8", render: "canvas"});
  //shallow water by jeff
  make_trib_gist({gistid: "3898116", display: "#display9", editor: "#editor9", render: "canvas"});
  //force
  make_trib_gist({gistid: "3898058", display: "#display10", editor: "#editor10"});
  //boids + voronoi (mike + jasondavies)
  make_trib_gist({gistid: "3127156", display: "#display11", editor: "#editor11"});
  */

  //make_trib_gist({gistid: "3891115", display: "#display2", editor: "#editor2"});

  function make_trib(options) {

    d3.text(options.code, function(code) {

      var tb = Tributary();

      var render = "svg";
      if(options.render) {
        render = options.render
      }
      var config = new tb.Config({display: render});

      var model = new tb.CodeModel({code: code});

      var context = new tb.TributaryContext({
        config: config,
        model: model,
        el: d3.select(options.display).node()
      });
      context.render();
      context.execute();

      var editor = new tb.Editor({
        model: model,
        el: d3.select(options.editor).node()
      });
      editor.render();
    });
  }

  function make_trib_gist(options) {

    var tb = Tributary();
    tb.gist(options.gistid, function(ret) {

      var config = ret.config;
      config.contexts = [];

      var context, editor;
      ret.models.each(function(m) {
        type = m.get("type");

        context = tb.make_context({
          config: config,
          model: m,
          display: d3.select(options.display)
        });
        if(context) {
          config.contexts.push(context);
          context.render();
          if(m.get("filename") !== "inlet.js") {
            context.execute();
          } else {
            editor = new tb.Editor({
              model: m,
              el: d3.select(options.editor).node()
            });
            editor.render();
          }
        }
      });
      config.contexts.forEach(function(c) {
        if(c.model.get("filename") === "inlet.js") {
          //first load should auto init
          tb.autoinit = true;
          c.execute();
          tb.autoinit = config.get("autoinit");
        }
      });
    });
  }





}());

