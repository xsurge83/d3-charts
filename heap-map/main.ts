/**
 * TODO: add hover tool tip to heat map
 * source : http://nbremer.github.io/openvis2016/slides/#/traffic-accidents
 */

import * as d3 from 'd3'

import DATA from './data';

const DAYS = ['Mon', 'Tues', 'Wed', 'Thurs', 'Friday', 'Sat', 'Sun'];
const MARGIN = {
    top: 120,
    right: 40,
    bottom: 70,
    left: 40
};

const WIDTH = 725, HEIGHT = 300;

let times = d3.range(24);

let gridSize = WIDTH / times.length;
var svg = d3.select('#heat-map')
    .append('svg')
    .attr('width', WIDTH + MARGIN.left + MARGIN.right)
    .attr('height', HEIGHT + MARGIN.top + MARGIN.bottom);

svg = svg
    .append('g')
    .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);

let mid = d3.max(DATA, (d)=>d.count) / 2,
    max = d3.max(DATA, (d)=>d.count);

let colorScale = d3.scale.linear()
    .domain([0, mid, max])
    .range(["#FFFFDD", "#3E9583", "#1F2D86"]);

let dayLabels = svg.selectAll('.dayLabel')
    .data(DAYS)
    .enter().append('text')
    .text((d)=>d)
    .attr('x', 0)
    .attr('y', (d, i)=> i * gridSize)
    .style("text-anchor", "end")
    .attr('transform', `translate(-6, ${gridSize / 1.5})`)
    .attr('class', (d, i)=> (i >= 0 && i <= 4) ?
        "dayLabel mono axis axis-workweek" : "dayLabel mono axis")

let timeLabels = svg.selectAll(".timeLabel")
    .data(times)
    .enter().append('text')
    .text((d)=> d)
    .attr('x', (d, i)=> i * gridSize)
    .attr('y', 0)
    .style('text-anchor', "middle")
    .attr('transform', `translate(${gridSize / 2}, -6)`)
    .attr('class', (d, i)=> (i >= 8 && i <= 17) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis");


let heatMap = svg.selectAll('.hour')
    .data(DATA)
    .enter().append('rect')
    .attr("x", (d)=> (d.hour - 1) * gridSize)
    .attr("y", (d)=> (d.day - 1) * gridSize)
    .attr('class', 'hour bordered')
    .attr('width', gridSize)
    .attr('height', gridSize)
    .style("stroke", "white")
    .style("stroke-opacity", 0.6)
    .style("fill", (d)=>colorScale(d.count));

const HEADER = 'Number of Events',
    SUB_HEADER = 'The Netherlands | 2014';
//Append title to the top
svg.append("text")
    .attr("class", "title")
    .attr("x", WIDTH / 2)
    .attr("y", -90)
    .style("text-anchor", "middle")
    .text(HEADER);
svg.append("text")
    .attr("class", "subtitle")
    .attr("x", WIDTH / 2)
    .attr("y", -60)
    .style("text-anchor", "middle")
    .text(SUB_HEADER);

// gradient for the legend scale 
var countScale = d3.scale.linear()
    .domain([0, max])
    .range([0, WIDTH]);

var numStops = 10;

var countPoint:Array<number> = [];

var countRange = countScale.domain();
countRange[2] = countRange[1] - countRange[0];

for (var i = 0; i < numStops; i++) {
    countPoint.push(i * countRange[2] / (numStops - 1) + countRange[0]);
}//for i

//Create the gradient
svg.append("defs")
    .append("linearGradient")
    .attr("id", "legend-traffic")
    .attr("x1", "0%").attr("y1", "0%")
    .attr("x2", "100%").attr("y2", "0%")
    .selectAll("stop")
    .data(d3.range(numStops))
    .enter().append("stop")
    .attr("offset", function (d, i) {
        return countScale(countPoint[i]) / WIDTH;
    })
    .attr("stop-color", function (d, i) {
        return colorScale(countPoint[i]);
    });

var legendWidth = WIDTH * 0.4;
//Color Legend container
var legendsvg = svg.append("g")
    .attr("class", "legendWrapper")
    .attr("transform", "translate(" + (WIDTH / 2) + "," + (gridSize * (DAYS.length + 1)) + ")");

//Draw the Rectangle
legendsvg.append("rect")
    .attr("class", "legendRect")
    .attr("x", -legendWidth / 2)
    .attr("y", 0)
    //.attr("rx", hexRadius*1.25/2)
    .attr("width", legendWidth)
    .attr("height", 15)
    .style("fill", "url(#legend-traffic)");

//Append title
legendsvg.append("text")
    .attr("class", "legendTitle")
    .attr("x", 0)
    .attr("y", -10)
    .style("text-anchor", "middle")
    .text('Scale');


//Set scale for x-axis
var xScale = d3.scale.linear()
    .range([-legendWidth / 2, legendWidth / 2])
    .domain([0, d3.max(DATA, function (d) {
        return d.count;
    })]);

//Define x-axis
var xAxis = d3.svg.axis()
    .orient("bottom")
    .ticks(5)
    //.tickFormat(formatPercent)
    .scale(xScale);

//Set up X axis
legendsvg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (15) + ")")
    .call(xAxis);



