// for page scroll to make my website pretty
$(document).on("scroll", function () {
  var pageTop = $(document).scrollTop();
  var pageBottom = pageTop + $(window).height();
});


// Global function called when select element is changed
function onCategoryChanged() {
  var select = d3.select('#categorySelect').node();
  // Get current value of select element
  var category = select.options[select.selectedIndex].value;
  // Update chart with the selected category of letters
  updateChart(category);
}

// recall that when data is loaded into memory, numbers are loaded as strings
// this function helps convert numbers into string during data preprocessing
function dataPreprocessor(row) {
  return {
    city: row.city,
    date: d3.timeParse("%Y-%m-%d")(row.date),
    actual_precipitation: +row.actual_precipitation,
    average_precipitation: +row.average_precipitation,
    record_precipitation: +row.record_precipitation
  };
}


var margin = { top: 20, right: 30, bottom: 30, left: 55 },
  width = 1200 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;


var totalHeight = height + margin.top + margin.bottom;

// A map with of cities to their code
var citiesMap = {
  'charlotte': 'CLT',
  'los-angeles': 'CQT',
  'indianapolis': 'IND',
  'jacksonville': 'JAX',
  'chicago': 'MDW',
  'philadelphia': 'PHL',
  'phoenix': 'PHX',
  'houston': 'KHOU',
  'new-york': 'KNYC',
  'seattle': 'KSEA'
};

// variable and map to help with title updating
var graphtitle = "Actual, Average, and Record Precipitation Levels in "

var citiesProperNames = {
  'charlotte': "Charlotte, NC",
  'los-angeles': "Los Angeles, CA",
  'indianapolis': "Indianapolis, IN",
  'jacksonville': "Jacksonville, FL",
  'chicago': "Chicago, IL",
  'philadelphia': "Philadelphia, PA",
  'phoenix': "Phoenix, AZ",
  'houston': "Houston, TX",
  'new-york': "New York City, NY",
  'seattle': "Seattle, WA"
};

d3.csv('weather.csv', dataPreprocessor).then(function (dataset) {
  // Create global variables here and intialize the chart
  weather = dataset;
  // Update the chart
  updateChart('seattle');
});

function updateChart(filterKey) {

  var filteredData = weather.filter(function (d) {
    return d.city === citiesMap[filterKey];
  });

  d3.selectAll('.graph').remove()
  // d3.select('#graphtitle').remove()

  var currCity = citiesProperNames[filterKey]

  d3.select('#graphtitle').append('p').text(graphtitle + currCity).attr('class', 'graph')

  // append the svg object to the body of the page
  var svg1 = d3.select("#main-svg")
    .append("svg")
    .attr('class', 'graph')
    .attr("width", ((width + margin.left + margin.right)))
    .attr("height", ((totalHeight / 3)))
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + (margin.top + 15) + ")");

  // append x-axis
  var x1 = d3.scaleTime()
    .domain(d3.extent(filteredData, function (d) { return d.date; }))
    .range([0, width]);
  svg1.append("g")
    .attr("transform", "translate(0," + (height / 3) * .80 + ")")
    .call(d3.axisBottom(x1));

  // add Y axis
  var y1 = d3.scaleLinear()
    .domain([0, d3.max(filteredData, function (d) {
      return d.actual_precipitation;
    })])
    .range([(height / 3) * 0.80, 0]);
  svg1.append("g")
    .call(d3.axisLeft(y1));

  // add the area to the svg
  svg1.append("path")
    .datum(filteredData)
    .transition()
    .duration(10000)
    .attr("stroke", "#4f7296")
    .attr("fill", "#6991ba")
    .attr("stroke-width", 1.5)
    .attr("d", d3.area()
      .x(function (d) { return x1(d.date) })
      .y0(y1(0))
      .y1(function (d) { return y1(d.actual_precipitation) })
    )

  // append graph title
  svg1
    .append("text")
    .attr("text-anchor", "start")
    .attr("y", -10)
    .attr("x", 10)
    .text("Actual Precipitation:")



  // append the svg object to the body of the page
  var svg2 = d3.select("#main-svg")
    .append("svg")
    .attr('class', 'graph')
    .attr("width", ((width + margin.left + margin.right)))
    .attr("height", ((totalHeight / 3)))
    .attr('style', 'overflow: visible;')
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + ((margin.top + (height / 3)) + 50) + ")");

  // append x-axis
  var x2 = d3.scaleTime()
    .domain(d3.extent(filteredData, function (d) { return d.date; }))
    .range([0, width]);
  svg2.append("g")
    .attr("transform", "translate(0," + (height / 3) * .80 + ")")
    .call(d3.axisBottom(x2));

  // add Y axis
  var y2 = d3.scaleLinear()
    .domain([0, d3.max(filteredData, function (d) {
      return d.average_precipitation;
    })])
    .range([(height / 3) * 0.80, 0]);
  svg2.append("g")
    .call(d3.axisLeft(y2));

  // add the area to the svg
  svg2.append("path")
    .datum(filteredData)
    .transition()
    .duration(10000)
    .attr("stroke", "#4f7296")
    .attr("fill", "#6991ba")
    .attr("stroke-width", 1.5)
    .attr("d", d3.area()
      .x(function (d) { return x2(d.date) })
      .y0(y2(0))
      .y1(function (d) { return y2(d.average_precipitation) })
    )

  // append the title to the graph
  svg2
    .append("text")
    .attr("text-anchor", "start")
    .attr("y", -10)
    .attr("x", 10)
    .text("Average Precipitation:")


  // append the svg object to the body of the page
  var svg3 = d3.select("#main-svg")
    .append("svg")
    .attr('class', 'graph')
    .attr("width", ((width + margin.left + margin.right)))
    .attr("height", ((totalHeight / 3)))
    .attr('style', 'overflow: visible;')
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + ((margin.top + (2 * (height / 3))) + 80) + ")");

  // append x-axis
  var x3 = d3.scaleTime()
    .domain(d3.extent(filteredData, function (d) { return d.date; }))
    .range([0, width]);
  svg3.append("g")
    .attr("transform", "translate(0," + (height / 3) * .80 + ")")
    .call(d3.axisBottom(x3));



  // add Y axis
  var y3 = d3.scaleLinear()
    .domain([0, d3.max(filteredData, function (d) {
      return d.record_precipitation;
    })])
    .range([(height / 3) * 0.80, 0]);
  svg3.append("g")
    .call(d3.axisLeft(y3));

  // add the area to the svg
  svg3.append("path")
    .datum(filteredData)
    .transition()
    .duration(10000)
    .attr('style', 'overflow: invisible;')
    .attr("stroke", "#4f7296")
    .attr("fill", "#6991ba")
    .attr("stroke-width", 1.5)
    .attr("d", d3.area()
      .x(function (d) { return x3(d.date) })
      .y0(y3(0))
      .y1(function (d) { return y3(d.record_precipitation) })
    )

  // append the title to the graph
  svg3
    .append("text")
    .attr("text-anchor", "start")
    .attr("y", -10)
    .attr("x", 10)
    .text("Record Precipitation:")
}


