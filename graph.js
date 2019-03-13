
var margin = {top: 80, right: 80, bottom: 80, left: 80},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

//find today's date
var today = moment().format('MMMM Do YYYY');


//find how many days have elapsed since last period
var daysAgo = moment("20180109", "YYYYMMDD").fromNow();


//create scales
var x = d3.scaleBand()
    .range([0, width], .1);

var y0 = d3.scaleLinear()
  .range([height, 0]),
y1 = d3.scaleLinear()
  .range([height, 0]);

var xAxis = d3.axisBottom()
    .scale(x)

// create left yAxis
var yAxisLeft = d3.axisLeft()
  .scale(y0)
  .ticks(4)

// create right yAxis
var yAxisRight = d3.axisRight()
  .scale(y1)
  .ticks(6)

//create chart
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 var data = d3.csv("non_hormonal_bc.csv", function(err, data){
   data.forEach(function(d) {
    d.day = +d.day;
    d.estrogen = +d.estrogen;
    d.progesterone = +d.progesterone;
  })
   x.domain(data.map(function(d) { return d.day; }));
   y0.domain([0, d3.max(data, function(d) { return d.estrogen; })]);
   y1.domain([0, d3.max(data, function(d) { return d.progesterone; })]);

  svg.append("g")
      .classed("x-axis", true)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
    .classed("axisLeft", true)
	  .attr("transform", "translate(0,0)")
	  .call(yAxisLeft);

  svg.append("g")
    .classed("axisRight", true)
	  .attr("transform", "translate(" + (width) + ",0)")
	  .call(yAxisRight);

  svg.select(".axisRight")
    .append("text")
    .attr("x", 0)
    .attr("y", 0)
    .style("text-anchor", "middle")
    .attr("transform", "translate(50," + height/2 + ") rotate(90)")
    .text("Progesterone(ng/ml)");

  svg.select(".axisLeft")
    .append("text")
    .attr("x", 0)
    .attr("y", 0)
    .style("text-anchor", "middle")
    .attr("transform", "translate(-50," + height/2 + ") rotate(-90)")
    .text("Estrogen(pg/ml)");

  svg.select(".x-axis")
    .append("text")
    .attr("x", 0)
    .attr("y", 0)
    .style("text-anchor", "middle")
    .attr("transform", "translate(" + width/2 + ", 60)")
    .text("Day ___");

  var bars = svg.selectAll(".bar").data(data).enter();
  bars.append("rect")
      .attr("class", "bar1")
      .attr("x", function(d) { return x(d.day); })
      .attr("width", x.bandwidth()/2)
      .attr("y", function(d) { return y0(d.estrogen); })
	    .attr("height", function(d,i,j) { return height - y0(d.estrogen); })
      .attr("fill", "#484043")
      .on("mouseover", function(d, i) {
        tooltip.style("display", "inline");
        d3.select(this)
          .attr("fill", "#775b66");
      })
      .on("mouseout", function(d, i) {
         tooltip.style("display", "none");
         d3.select(this).attr("fill", "#484043")
       })
      .on("mousemove", function(d) {
      var xPosition = d3.mouse(this)[0] - 15;
      var yPosition = d3.mouse(this)[1] - 25;
      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      tooltip.select("text").text(d.estrogen + ' pg/ml');
    })
  bars.append("rect")
      .attr("class", "bar2")
      .attr("x", function(d) { return x(d.day) + x.bandwidth()/2; })
      .attr("width", x.bandwidth() / 2)
      .attr("y", function(d) { return y1(d.progesterone); })
      .attr("height", function(d,i,j) { return height - y1(d.progesterone);
   })
      .attr("fill", "#52BFAB")
      .on("mouseover", function(d, i) {
        tooltip.style("display", "inline");
        d3.select(this)
          .attr("fill", "#52bfaa80");
      })
      .on("mouseout", function(d, i) {
         tooltip.style("display", "none");
         d3.select(this).attr("fill", "#52BFAB")
       })
      .on("mousemove", function(d) {
        var xPosition = d3.mouse(this)[0] - 15;
        var yPosition = d3.mouse(this)[1] - 25;
        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        tooltip.select("text").text(d.progesterone + " ng/ml");
      });

//progess bar
  svg.select("#chart")
    .append('svg')
    .attr("height", 100)
    .attr("width", 500)


  var states = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28'],
    segmentWidth = 800 - margin.left - margin.right,
    currentState = '2';

  var colorScale = d3.scaleOrdinal()
    .domain(states)
    .range((['yellow', 'orange', 'green']))

  svg.append('rect')
		.attr('class', 'bg-rect')
		.attr('rx', 10)
		.attr('ry', 10)
		.attr('fill', 'gray')
		.attr('height', 15)
		.attr('width', width)
		.attr('x', 0)
    .attr('y', 265);

	var progress = svg.append('rect')
					.attr('class', 'progress-rect')
					.attr('fill', "#fba100")
					.attr('height', 15)
					.attr('width', width)
					.attr('rx', 10)
					.attr('ry', 10)
					.attr('x', 0)
          .attr('y', 265);

	progress.transition()
		.duration(1000)
    .attr('width', function(){
      var index = states.indexOf(currentState);
      return segmentWidth * ((index + 1)/states.length);
    })

	function moveProgressBar(state){
		progress.transition()
			.duration(1000)
			.attr('fill', function(){
				return colorScale(state);
			})
			.attr('width', function(){
				var index = states.indexOf(state);
				return (index + 1) * segmentWidth;
			});
   }

 })

 // Prep the tooltip bits, initial display is hidden
 var tooltip = svg.append("g")
   .attr("class", "tooltip")
   .style("display", "none");

 tooltip.append("rect")
   .attr("width", 30)
   .attr("height", 20)
   .attr("fill", "white")
   .style("opacity", 0.5);

 tooltip.append("text")
   .attr("x", 15)
   .attr("dy", "1.2em")
   .style("text-anchor", "middle")
   .attr("font-size", "12px")
   .attr("font-weight", "bold");
