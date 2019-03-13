// import * as moment from 'moment';
import * as d3 from 'd3';
import $ from "jquery";

document.addEventListener("DOMContentLoaded", function() {

function createChart(data, user){

  var initialWidth = window.innerWidth;
  var initialHeight = window.innerWidth < 600 ? initialWidth * 0.7 : initialWidth * 0.4;

  var margin = {
    top: 40,
    right: 80,
    bottom: 80,
    left: 80
  }

  var width = initialWidth - margin.left - margin.right;
  var height = initialHeight - margin.top - margin.bottom;

  //find today's date
  // var today = moment().format('MMMM Do YYYY');

  //reformat users first date of last period
  var d = user.first_day;

  //users cycle length
  var cycleLength;

  if (user.triphasic === true || user.monophasic === true) {
    cycleLength = 28;
  } else {
    cycleLength = user.cycle_length;
  }

  var cycleLengthArr = [];
  for (let i = 1; i <= cycleLength; i++) {
    cycleLengthArr.push(i)
  }

  //find how many days have elapsed since last period

  const daysAgo = Math.floor(( Date.parse(new Date()) - Date.parse(d)) / 86400000) % cycleLength;
  var currentCycleDay = daysAgo%cycleLength;

//create scales
  var x = d3.scaleBand()
      .range([0, width], .1);
    console.log("x === ", x)

  var y0 = d3.scaleLinear()
    .range([height, 0]),
  y1 = d3.scaleLinear()
    .range([height, 0]);

        console.log("y0 === ", y0)

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
    .text(`Day ${currentCycleDay}`)
    .attr("id", "day-tag");

  var bars = svg.selectAll(".bar")
    .data(data)
    .enter();

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
      tooltip.select("text").html(d.progesterone + " ng/ml");
    });

  //progess bar based on user inputted days since last period
  svg.select("#chart")
    .append('svg')
    .attr("height", 100)
    .attr("width", width)

  //use users cycle length to determine length of progess bar
  var states = cycleLengthArr,
  segmentWidth = width,
  currentState = daysAgo;

  // var colorScale = d3.scaleOrdinal()
  //   .domain(states)
  //   .range((['yellow', 'orange', 'green']))

  svg.append('rect')
    .attr('class', 'bg-rect')
    .attr('rx', 10)
    .attr('ry', 10)
    .attr('fill', 'gray')
    .attr('height', 15)
    .attr('width', width)
    .attr('x', 0)
    .attr('y', height + 25);

  var progress = svg.append('rect')
    .attr('class', 'progress-rect')
    .attr('fill', "#fba100")
    .attr('height', 15)
    .attr('width', width)
    .attr('rx', 10)
    .attr('ry', 10)
    .attr('x', 0)
    .attr('y', height + 25);

  progress.transition()
    .duration(1000)
    .attr('width', function(){
      var index = states.indexOf(currentState);
      return segmentWidth * ((index + 1)/states.length);
    })

  // function moveProgressBar(state){
  //   progress.transition()
  //     .duration(1000)
  //     .attr('fill', function(){
  //       return colorScale(state);
  //     })
  //     .attr('width', function(){
  //       var index = states.indexOf(state);
  //       return (index + 1) * segmentWidth;
  //     });
  //   }

  // Prep the tooltip bits, initial display is hidden
  var tooltip = svg.append("g")
    .attr("class", "tooltip")
    .style("display", "none");

  tooltip.append("rect")
    .attr("width", 80)
    .attr("height", 28)
    .attr("fill", "white")
    .style("opacity", 0.7)
    .attr("rx", 10)
    .attr("ry", 10)
    .style("text-align", "center");

  tooltip.append("text")
    .attr("x", 40)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "14px")
    .attr("font-weight", "bold")
    .style("text-align", "center");
  }

function getData() {
   let user = {};
   let rawContraceptiveData = [];
   var userId;
   var userContraceptive = "non_hormonal";


    //get the user_id
    $.ajax({
          url: 'https://epro-api.herokuapp.com/auth/status',
          type: 'GET',
          dataType: 'json',
          success: function(result) {
            userId = result.data.user_id

            // get the user info
             $.getJSON(`https://epro-api.herokuapp.com/users/${userId}`, function(result){
               user = result;

               if (user.monophasic === true){
                 userContraceptive = "monophasic"
               } else if (user.non_hormonal === true){
                 userContraceptive = "non_hormonal"
               } else if (user.progestin === true){
                 userContraceptive = "progestin"
               } else if (user.triphasic === true){
                 userContraceptive = "triphasic"
               } else {
                 userContraceptive = "non_hormonal"
               }

             //get the hormone data
             $.getJSON(`https://epro-api.herokuapp.com/hormones/${userContraceptive}`, function(result){
               rawContraceptiveData = result.data;

               //prepare the data and draw the charts
               let data = prepDataForChart(rawContraceptiveData, user);
               createChart(data, user);
             })
           });
          },
          error: function() {

           },
          beforeSend: setHeader
        });
    }

 function prepDataForChart(rawData, user) {
   var intData = rawData.map(ele => {
     return {
       "day": ele.day,
       "estrogen": ele.est,
       "progesterone": (ele.prog/10)
     }
   })
   if (user.triphasic || user.monophasic){
     return intData;
   } else if (user.progestin) {
      let newData = [];
      for(let i = 1; i < user.cycle_length+1; i++){
        newData.push({
          "day": i,
          "estrogen": 0,
          "progesterone": .8
        })
      }
      return newData;
    }
    else {
      if (user.cycle_length === 28) {
        var intData = rawData.map(ele => {
          return {
            "day": ele.day,
            "estrogen": ele.est,
            "progesterone": (ele.prog/10)
          }
        })
        intData.pop();
        return intData;
      } else if (user.cycle_length > 28) {
        let dupArr = [26, 25, 23, 22, 21, 19, 15, 11];
        let loop = user.cycle_length - 28;
        for (let i = 1; i < loop; i++){
          let dupObj = rawData[dupArr[i]];
          let copyObj = {
            "day": dupObj.day,
            "estrogen": dupObj.est,
            "progesterone": dupObj.prog/10
          }
          intData.splice(dupArr[i], 0, copyObj);
        }
        for (let i = 0; i < intData.length; i++){
          intData[i].day = i + 1;
        }
        return intData;
      } else {
        let delArr = [27, 15, 8, 3, 21, 1, 6];
        let loop = 28 - user.cycle_length;
        for (let i = 0; i <= loop; i++) {
          intData.splice(delArr[i], 1)
        }
        for (let i = 0; i < intData.length; i++){
          intData[i].day = i + 1;
        }
        return intData;
      }
    }
  }


 function setHeader(xhr) {
    xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
  }

getData();

   window.addEventListener('resize', function(){window.location.reload(true);});
})
