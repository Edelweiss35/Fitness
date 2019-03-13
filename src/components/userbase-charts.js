import * as d3 from 'd3';
import $ from "jquery";

document.addEventListener("DOMContentLoaded", function() {

  function drawUsersByAge(data) {
      var initialWidth;
      window.innerWidth > 600 ? initialWidth = 600 : initialWidth = window.innerWidth;
      var initialHeight = initialWidth * 0.7;   // best relative size for chart
      var svg = d3.select("#svg1");
      var  margin = {
          top: 40,
          right: 20,
          bottom: 60,
          left: 40
        };
      let svgElement = $("#svg2");
      var  width = initialWidth - margin.left - margin.right,
        height = initialHeight - margin.top - margin.bottom;

      var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
        y = d3.scaleLinear().rangeRound([height, 0]);

      var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Define the div for the tooltip
      var div = d3.select("#userbase").append("div").attr("class", "tooltip").style("opacity", 0);

        x.domain(data.map(function(d) {
          return d.age;
        }));
        y.domain([
          0,
          d3.max(data, function(d) {
            return d.frequency;
          })
        ]);

        //  Create the x axis.  Space out the ticks on mobile.
        if (svgElement.width() > 600) {
          g.append("g").attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));
        } else {
          var xAxis = d3.axisBottom(x)
            .tickValues(x.domain().filter(function(d, i) { return !(i % 2); }));
          g.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);
        }

        //  Remove the y label on mobile
        if (svgElement.width() > 600){
          g.append("g").attr("class", "axis")
          .call(d3.axisLeft(y)).append("text").attr("x", 2).attr("y", y(y.ticks().pop()) + 0.5)
          .attr("fill", "#000").attr("text-anchor", "start").text("Number of Users");
        } else {
          g.append("g").attr("class", "axis")
          .call(d3.axisLeft(y)).append("text").attr("x", 2).attr("y", y(y.ticks().pop()) + 0.5)
          .attr("fill", "#000");
        }

        g.selectAll(".bar").data(data).enter().append("rect").attr("class", "bar").attr("x", function(d) {
          return x(d.age);
        }).attr("y", function(d) {
          return y(d.frequency);
        }).attr("width", x.bandwidth()).attr("height", function(d) {
          return height - y(d.frequency);
        });

        let centerX;
        if (window.innerWidth > 600) {
          centerX = 530;
        } else {
          centerX = 310;
        }
        g.append("text").attr("x", centerX / 2).attr("y", 0 - (margin.top / 4)).attr("text-anchor", "middle").style("font-size", "16px").style("text-decoration", "underline").text("Number of Users By Age");

        // text label for the x axis
        g.append("text").attr("x", centerX / 2).attr("y", height+40)
            .style("text-anchor", "middle")
            .text("Age");

    }

    function drawContraceptionMethodsByFrequency(data) {
    // var initialWidth;
    // window.innerWidth > 800 ? initialWidth = 800 : initialWidth = window.innerWidth;
    // var initialHeight = initialWidth * 0.5;   // best relative size for chart
    let margin = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 30
    };
    let svgElement = $("#svg2");
    let width = svgElement.width() - margin.left - margin.right;
    let height = svgElement.height();
    var donut = donutChart()
        .width(width)
        .height(height)
        .cornerRadius(3) // sets how rounded the corners are on each slice
        .padAngle(0.015) // effectively dictates the gap between slices
        .variable('Users')
        .category('Type');

    d3.select('#svg2')
            .datum(data) // bind data to the div
            .call(donut); // draw chart in div

  }

  function drawContraceptionByAge(data) {

    // set width and height based on window size.  600 is the largest good size
    // for this chart, so use that as a max. The ratio for height is just for
    // a pleasing shape.
    let margin = {
      top: 20,
      right: 80,
      bottom: 50,
      left: 40
    };
    let svgElement = $("#svg3");
    let width = svgElement.width() - margin.left - margin.right;
    let height = svgElement.height() - margin.top - margin.bottom;
    let svg = d3.select("#svg3");
    let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define the div for the tooltip
    var div = d3.select("#userbase").append("div").attr("class", "tooltip").style("opacity", 0);

    //  set the scales
    var x = d3.scaleBand().range([0, width]).paddingInner(0.05).align(0.1);
    var y = d3.scaleLinear().range([height, 0]);

    var z = d3.scaleOrdinal().range([
      "#ffa200",
      "#FF3E00",
      "#70608e",
      "teal",
      "#484043",
      "#b8a09d",
      "#52BFAB"
    ]);

      var keys = ["Triphasic", "Monophasic", "Progestins", "Non-Hormonal", "No Answer"];

      //  loop through the data for each age and save the total in data
      data.map(function(d) {
        let t, i;
        for (i = 0, t = 0; i < keys.length; ++i) {
          t += d[keys[i]] = +d[keys[i]];
        }
        d.total = t;
        return t;
      })

      x.domain(data.map(function(d) {
        return d.Age;
      }));


      y.domain([
        0,
        d3.max(data, function(d) {
          return d.total;
        })
      ]).nice();
      z.domain(keys);

      g.append("g").selectAll("g").data(d3.stack().keys(keys)(data)).enter().append("g").attr("fill", function(d) {
        return z(d.key);
      }).selectAll("rect").data(function(d) {
        return d;
      }).enter().append("rect").attr("x", function(d) {
        return x(d.data.Age);
      }).attr("y", function(d) {
        return y(d[1]);
      }).attr("height", function(d) {
        return y(d[0]) - y(d[1]);
      }).attr("width", x.bandwidth())
      .on("mouseover", function(d) {
        div.transition().duration(200).style("opacity", .9);

        div.html(`${d[1] - d[0]}` + "<br/>").style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY) + "px");
      }).on("mouseout", function(d) {
        div.transition().duration(500).style("opacity", 0);
      });

      //  Create the x axis.  Space out the ticks on mobile.
      if (svgElement.width() > 600) {
        g.append("g").attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
      } else {
        var xAxis = d3.axisBottom(x)
          .tickValues(x.domain().filter(function(d, i) { return !(i % 2); }));
        g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
      }


      if (svgElement.width() > 700) {
        g.append("g").attr("class", "axis")
        .call(d3.axisLeft(y)).append("text").attr("x", 2).attr("y", y(y.ticks().pop()) + 0.5)
        .attr("fill", "#000").attr("font-weight", "bold").attr("text-anchor", "start").text("Number Reported");
      } else {
        g.append("g").attr("class", "axis")
        .call(d3.axisLeft(y)).append("text").attr("x", 2).attr("y", y(y.ticks().pop()) + 0.5)
        .attr("fill", "#000").attr("font-weight", "bold").attr("text-anchor", "start");
      }

      var legend = g.append("g").attr("font-family", "sans-serif").attr("font-size", 10).attr("text-anchor", "end").selectAll("g").data(keys.slice().reverse()).enter().append("g").attr("transform", function(d, i) {
        return "translate(0," + i * 20 + ")";
      });

      legend.append("rect").attr("x", width + 64).attr("width", 19).attr("height", 19).attr("fill", z);

      legend.append("text").attr("x", width + 60).attr("y", 9.5).text(function(d) {
        return d;
      });

      g.append("text").attr("x", (width / 2)).attr("y", 0 - (margin.top / 4)).attr("text-anchor", "middle").style("font-size", "16px").style("text-decoration", "underline").text("Contraceptives By Age");

      // text label for the x axis
      g.append("text").attr("x", (width / 2)).attr("y", height+40)
          .style("text-anchor", "middle")
          .text("Age");
  }

  function donutChart() {
    var width,
      height,
      margin = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 30
      },
      colour = d3.scaleOrdinal(d3.schemeCategory20c), // colour scheme
      variable, // value in data that will dictate proportions on chart
      category, // compare data by
      padAngle, // effectively dictates the gap between slices
      floatFormat = d3.format('.4r'),
      cornerRadius, // sets how rounded the corners are on each slice
      commaFormat = d3.format(',');

    function chart(selection) {
      selection.each(function(data) {
        // generate chart

        // Add title
        if (window.innerWidth > 600) {
          selection.append("text").attr("x", width/2).attr("y", 20).attr("text-anchor", "middle").style("font-size", "16px").style("text-decoration", "underline").text("Contraceptive Methods By Users");
        } else {
          selection.append("text").attr("x", 175).attr("y", 20).attr("text-anchor", "middle").style("font-size", "16px").style("text-decoration", "underline").text("Contraceptive Methods By Users");
        }

        // ======================================================================================

        // ===========================================================================================
        // Set up constructors for making donut. See https://github.com/d3/d3-shape/blob/master/README.md

        var radius;
        if (width < 600) {
          radius = Math.min(width, height) / 5;
        } else {
          radius = Math.min(width, height) / 2;
        }

        // creates a new pie generator
        var pie = d3.pie().value(function(d) {
          return floatFormat(d[variable]);
        }).sort(null);

        // contructs and arc generator. This will be used for the donut. The difference between outer and inner
        // radius will dictate the thickness of the donut
        var arc = d3.arc().outerRadius(radius * 0.8).innerRadius(radius * 0.6).cornerRadius(cornerRadius).padAngle(padAngle);

        // this arc is used for aligning the text labels
        var outerArc = d3.arc().outerRadius(radius * 0.9).innerRadius(radius * 0.9);
        // ===========================================================================================

        // ===========================================================================================
        // append the svg object to the selection
        var svg = selection.append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
        // ===========================================================================================

        // ===========================================================================================
        // g elements to keep elements within svg modular
        svg.append('g').attr('class', 'slices');
        svg.append('g').attr('class', 'labelName');
        svg.append('g').attr('class', 'lines');
        // ===========================================================================================

        // ===========================================================================================
        // add and colour the donut slices
        var path = svg.select('.slices').datum(data).selectAll('path').data(pie).enter().append('path').attr('fill', function(d) {
          return colour(d.data[category]);
        }).attr('d', arc);
        // ===========================================================================================

        // ===========================================================================================
        // add text labels
        var label = svg.select('.labelName').selectAll('text').data(pie).enter().append('text').attr('dy', '.35em').html(function(d) {
          // add "key: value" for given category. Number inside tspan is bolded in stylesheet.
          return d.data[category] + ': <tspan>' + commaFormat(d.data[variable]) + '</tspan>';
        }).attr('transform', function(d) {

          // effectively computes the centre of the slice.
          // see https://github.com/d3/d3-shape/blob/master/README.md#arc_centroid
          var pos = outerArc.centroid(d);

          // changes the point to be on left or right depending on where label is.
          pos[0] = radius * 0.95 * (midAngle(d) < Math.PI
            ? 1
            : -1);
          return 'translate(' + pos + ')';
        }).style('text-anchor', function(d) {
          // if slice centre is on the left, anchor text to start, otherwise anchor to end
          return (midAngle(d)) < Math.PI
            ? 'start'
            : 'end';
        })
        .style('font-family', 'sans-serif');
        // ======================================================================================


        // add lines connecting labels to slice. A polyline creates straight lines connecting several points
        var polyline = svg.select('.lines').selectAll('polyline').data(pie).enter().append('polyline').attr('points', function(d) {

          // see label transform function for explanations of these three lines.
          var pos = outerArc.centroid(d);
          pos[0] = radius * 0.95 * (midAngle(d) < Math.PI
            ? 1
            : -1);
          return [arc.centroid(d), outerArc.centroid(d), pos]
        });
        // ===========================================================================================

        // ===========================================================================================
        // add tooltip to mouse events on slices and labels
        if (width > 700) {
          d3.selectAll('.labelName text, .slices path').call(toolTip);
        }
        // ===========================================================================================

        // ===========================================================================================
        // Functions

        // calculates the angle for the middle of a slice
        function midAngle(d) {
          return d.startAngle + (d.endAngle - d.startAngle) / 2;
        }

        // function that creates and adds the tool tip to a selected element
        function toolTip(selection) {

          // add tooltip (svg circle element) when mouse enters label or slice
          selection.on('mouseenter', function(data) {

            svg.append('text').attr('class', 'toolCircle').attr('dy', -20) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
            .html(toolTipHTML(data)) // add text to the circle.
            .style('font-size', '.8em').style('text-anchor', 'middle') // centres text in tooltip
            .style('font-family', 'sans-serif');
            svg.append('circle').attr('class', 'toolCircle').attr('r', radius * 0.55) // radius of tooltip circle
            .style('fill', colour(data.data[category])). // colour based on category mouse is over
            style('fill-opacity', 0.35);

          });

          // remove the tooltip when mouse leaves the slice/label
          selection.on('mouseout', function() {
            d3.selectAll('.toolCircle').remove();
          });
        }

        // function to create the HTML string for the tool tip. Loops through each key in data object
        // and returns the html string key: value
        function toolTipHTML(data) {

          var tip = '',
            i = 0;

          for (var key in data.data) {

            // if value is a number, format it using commas
            var value = (!isNaN(parseFloat(data.data[key])))
              ? commaFormat(data.data[key])
              : data.data[key];

            // leave off 'dy' attr for first tspan so the 'dy' attr on text element works. The 'dy' attr on
            // tspan effectively imitates a line break.
            if (i === 0)
              tip += '<tspan x="0">' + key + ': ' + value + '</tspan>';
            else
              tip += '<tspan x="0" dy="1.2em">' + key + ': ' + value + '</tspan>';
            i++;
          }

          return tip;
        }
        // ===========================================================================================

      });
    }

    // getter and setter functions. See Mike Bostocks post "Towards Reusable Charts" for a tutorial on how this works.
    chart.width = function(value) {
      if (!arguments.length)
        return width;
      width = value;
      return chart;
    };

    chart.height = function(value) {
      if (!arguments.length)
        return height;
      height = value;
      return chart;
    };

    chart.margin = function(value) {
      if (!arguments.length)
        return margin;
      margin = value;
      return chart;
    };

    chart.radius = function(value) {
      // if (!arguments.length)
      //   return radius;
      // radius = value;
      return chart;
    };

    chart.padAngle = function(value) {
      if (!arguments.length)
        return padAngle;
      padAngle = value;
      return chart;
    };

    chart.cornerRadius = function(value) {
      if (!arguments.length)
        return cornerRadius;
      cornerRadius = value;
      return chart;
    };

    chart.colour = function(value) {
      if (!arguments.length)
        return colour;
      colour = value;
      return chart;
    };

    chart.variable = function(value) {
      if (!arguments.length)
        return variable;
      variable = value;
      return chart;
    };

    chart.category = function(value) {
      if (!arguments.length)
        return category;
      category = value;
      return chart;
    };

    return chart;
  }

  function getData() {
    let users = [];
    let triphasic = [];
    let monophasic = [];
    let non_hormonal = [];
    let progestin = [];

    // get the users first
    $.getJSON("https://epro-api.herokuapp.com/users/all", function(result){
      users = result.data;
      $.getJSON("https://epro-api.herokuapp.com/users/triphasic", function(result){
        triphasic = result.data;
        $.getJSON("https://epro-api.herokuapp.com/users/monophasic", function(result){
          monophasic = result.data;
          $.getJSON("https://epro-api.herokuapp.com/users/progestin", function(result){
            progestin = result.data;
            $.getJSON("https://epro-api.herokuapp.com/users/non_hormonal", function(result){
              non_hormonal = result.data;

              // all results should be set now, so prepare the data and draw the charts
              let data = prepDataForUsersByAge(users);
              drawUsersByAge(data);
              data = prepDataForContraceptionMethodsByFrequency(progestin.length,
                non_hormonal.length, triphasic.length, monophasic.length);
              drawContraceptionMethodsByFrequency(data);
              data = prepDataForContraceptionMethodsByAge(users);
               // data = [
               //      {
               //        "Age":12,"Triphasic":1,"Monophasic":2,"Progestins":0, "Non-Hormonal": 0, "No Answer":0
               //      },
               //      {
               //        "Age":19,"Triphasic":16,"Monophasic":40,"Progestins":76, "Non-Hormonal": 270, "No Answer":65
               //      },
               //      {
               //        "Age":20,"Triphasic":11,"Monophasic":22,"Progestins":6, "Non-Hormonal": 230, "No Answer":55
               //      }
               //    ]
              drawContraceptionByAge(data);
            })
          })
        })
      })
    });
  }

  function prepDataForUsersByAge(users) {
    let array = [];
    let data =  users.reduce((array, user) => {
      array[user.age] === undefined ?
        array[user.age] = {"age": user.age, "frequency": 1} :
        array[user.age].frequency++;
      return array;
    }, []);
    let results = data.filter(element => {
      return element !== undefined;
    })

    return results;
  }


  function prepDataForContraceptionMethodsByFrequency(progestin, non_hormonal,
      triphasic, monophasic) {
        return [
          {"Type":"Non-Hormonal","Users":non_hormonal,"Details":"None, Condoms","More":"Paraguard, Copper IUD"},
          {"Type":"Triphasic","Users":triphasic,"Details":"The Pill - varied amount","More":"Ortho Tricyclen"},
          {"Type":"Monophasic","Users":monophasic,"Details":"The Pill - constant amount","More":"Levora"},
          {"Type":"Progestins","Users":progestin,"Details":"Mirena IUD, Skyla, Mini Pill","More":"Depo Shot, The Ring"}
        ]
      }

  function prepDataForContraceptionMethodsByAge(users) {
    let array = [];
    let data =  users.reduce((array, user) => {
      if (array[user.age] === undefined) {
        array[user.age] = {"Age": user.age, "Triphasic":0, "Monophasic":0,
                            "Progestins":0, "Non-Hormonal":0, "No Answer":0};
      }
      if (user.triphasic) {
        array[user.age].Triphasic++;
      } else if (user.progestin) {
        array[user.age].Progestins++;
      } else if (user.monophasic) {
        array[user.age].Monophasic++;
      } else if (user.non_hormonal) {
        array[user.age]["Non-Hormonal"]++;
      } else {
        array[user.age]["No Answer"]++;
      }
      return array;
    }, []);
    let results = data.filter(element => {
      return element !== undefined;
    })

    return results;
  }

  function drawCharts() {
    getData();
  }

  window.addEventListener('resize', function(){window.location.reload(true);});

  drawCharts();

})
