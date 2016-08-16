/**
 * acceleration (0-1), ekg, x , y, x
 */

/**
 * stacked chart
 * - see strava widget https://www.strava.com/activities/651238157/analysis/200/288
 * http://chimera.labs.oreilly.com/books/1230000000345/ch07.html
 */
import {StackedLineChart, ChartData} from './stacked-chart'

const POINT_PER_SEC = 256;

var chartsData: ChartData [] = [
    new ChartData('acceleration', [[0,0], [2,2]]),
    new ChartData('speed', [[0,1], [2,2]]),
];

let chart = new StackedLineChart({
    height: 200,
    target: document.getElementById('chart')
});

chart.render(chartsData);

//
// //
// // var mappedData = DATA.map(function (items) {
// //     return {
// //         acceleration: items[0] - items[1],
// //         ekg: items[2],
// //         // x : items[3],
// //         // y : items[4],
// //         // z : items[5]
// //     }
// // });
// //
// // var min = d3.min(mappedData, function (value) {
// //     return value.acceleration;
// // });
// //
// // var categories = d3.keys(mappedData[0]);
// //
// // let colors = d3.scale.ordinal()
// //     .domain(categories)
// //     .range(["#34ACE4", "#f0f"]);
// //
// // var svg = d3.select('#chart')
// //     .append('svg')
// //     .attr('width', WIDTH + MARGIN.left + MARGIN.right)
// //     .attr('height', HEIGHT + MARGIN.top + MARGIN.bottom);
// //
// // svg = svg
// //     .append('g')
// //     .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);
// //
// // var x = d3.scale
// //     .linear()
// //     .range([0, WIDTH])
// //     .domain([0, mappedData.length / POINT_PER_SEC]);
// //
// // var y:d3.scale.Linear<number,number> = d3.scale
// //     .linear()
// //     .range([HEIGHT, 0])
// //     .domain([min, 1]);
// //
// // var xAxis = d3.svg.axis().scale(x).orient('bottom').ticks(20);
// // var yAxis = d3.svg.axis().scale(y).orient('left').ticks(5);
// //
// // var keyLine = d3.svg.line()
// //     .y((d:any)=> y(d))
// //     .x((d, i)=> x(i / POINT_PER_SEC));
// //
// // var line = svg.append('g')
// //     .classed('lines', true)
// //     .selectAll('g.line')
// //     .data(categories)
// //     .enter()
// //     .append('g')
// //     .attr('class', 'line');
// //
// // line.append('path')
// //     .style('stroke', (d)=> colors(d).toString())
// //     .attr('d', function (d) {
// //         return keyLine(mappedData.map((v)=>v[d]));
// //     });
// //
// //
// // // Add the X Axis
// // svg.append("g")
// //     .attr("class", "x axis")
// //     .attr("transform", "translate(0," + HEIGHT + ")")
// //     .call(xAxis);
// //
// // // Add the Y Axis
// // svg.append("g")
// //     .attr("class", "y axis")
// //     .call(yAxis);
//
//
//
