/**
 * stacked chart
 * TODO:
 * - move from d3 to d4
 *
 * references
 * - strava widget https://www.strava.com/activities/651238157/analysis/200/288
 * - https://github.com/tj/d3-series/blob/master/index.js
 */

import * as d3 from 'd3'
import * as _ from 'lodash'

const DEFAULTS = {
    // target element or selector to contain the svg
    target: '#chart',

    // width of chart
    width: 725,

    // height of chart
    height: 500,

    // margin
    margin: {top: 25, right: 60, bottom: 50, left: 60},

    // x axis tick count
    xTicks: 6,

    // y range (opacity)
    yRange: [0, 1],

    // x domain (time)
    xDomain: [],

    // time formatter
    timeFormat: d3.time.format("%B %d %I:%M %p"),

    // value formatter
    valueFormat: d3.format('0,000'),

    // custom point width
    pointWidth: null,

    // easing function for transitions
    ease: 'linear'
};

export class Chart {
    width:number;
    height:number;
    margin:{top:number, right:number, bottom:number, left:number};
    target:HTMLElement;
    chart:d3.Selection<any>;
    xAxis:d3.svg.Axis;


    constructor(config) {
        this.set(config);
        this.init();
    }

    set(config) {
        _.extend(this, DEFAULTS, config);
    }

    init() {
        const {target, width, height, margin} = this;
        this.chart = d3.select(target)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

    }

    dimensions() {
        const {width, height, margin} = this;
        const w = width - margin.left - margin.right;
        const h = height - margin.top - margin.bottom;
        return [w, h]
    }
}

export class ChartData {
    name:string;
    data:number[];

    constructor(name, data) {
        this.name = name;
        this.data = data
    }
}


export class LineChart extends Chart {

}


//TODO
export class StackedLineChart extends Chart {
    private x:d3.scale.Linear<number,number>;
    private y:d3.scale.Linear<number,number>;
    private chartsData:ChartData[];
    private chartGroups:d3.Selection<any>;
    private labelGroups:d3.Selection<any>;
    private chartSize:number;
    private chartMargin :number = 5;

    constructor(config) {
        super(config)
    }

    init() {
        const [w, h] = this.dimensions();
        super.init();

        this.chart.append('g').classed('x axis', true);
        this.labelGroups = this.chart.append('g').classed('labelGroup', true);
        this.chartGroups = this.chart.append('g').classed('chartGroup', true);

        this.labelGroups.attr('transform', 'translate(0, 30)');
        this.chartGroups.attr('transform', 'translate(122, 30)');
    }

    render(chartsData:ChartData[]) {
        const [,h] = this.dimensions();
        var _this = this;
        this.chartSize = h / chartsData.length;
        this.chartsData = chartsData;

        chartsData.forEach((chartData, index)=> {
            _this.renderChart(chartData, index)
        });
        this.renderLabelGroups();
    }

    private renderLabelGroups() {
        var label = this.labelGroups
            .selectAll('g.label-box')
            .data(this.chartsData)
            .enter()
            .append('g')
            .attr('class', 'label-box')
            .attr('transform', (d, i)=> `translate(0, ${(i * (this.chartSize+this.chartMargin))})`);

        label.append('rect')
            .attr('y', 0)
            .attr('x', 0)
            .attr('height', this.chartSize)
            .attr('width', 120);

        label.append('text')
            .text((d)=>d.name)
            .attr('y', 0)
            .attr('x', 60)
            .attr('dy', '2em')
            .classed('label', true)
    }

    private renderChart(chartData:ChartData, index) {

        const width = 400;
        const bottomMargin = 13;

        let chartSize = this.chartSize;

        var x = d3.scale.linear()
            .domain([0, d3.max(chartData.data, (d)=> d[0])])
            .range([0, width]);

        var y = d3.scale.linear()
            .domain([0, d3.max(chartData.data, (d)=> d[1])])
            .range([chartSize - bottomMargin, 0]);

        var line = d3.svg.line()
            .x((d:any[])=> x(d[0]))
            .y((d:any[])=> y(d[1]));

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        this.chartGroups.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0, ${(((index+1) * (chartSize+this.chartMargin))-this.chartMargin - bottomMargin)})`)
            .call(xAxis);

        this.chartGroups
            .datum(chartData)
            .append('g')
            .classed('line', true)
            .attr('class', (d, i)=> `line ${d.name.toLowerCase()}`)
            .attr('transform', `translate(0,  ${(index * (chartSize + this.chartMargin)) }) `)
            .append('path')
            .attr('d', (d:any)=> line(d.data))
            .style('stroke', '#34ACE4')
            .style('stroke-width', '1px')
    }
}

