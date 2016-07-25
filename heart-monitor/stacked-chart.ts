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
        debugger;
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
}

export class StackedLineChart extends Chart {
    private x:d3.scale.Linear<number,number>;
    private y:d3.scale.Linear<number,number>;
    private chartsData:ChartData[];
    private chartGroups:d3.Selection<any>;
    private labelGroups:d3.Selection<any>;

    constructor(config) {
        super(config)
    }

    init() {
        const [w, h] = this.dimensions();
        super.init();

        this.chart.append('g').classed('x axis', true);
        this.chartGroups = this.chart.append('g').classed('chartGroup', true);
        this.labelGroups = this.chart.append('g').classed('labelGroup', true);

        this.labelGroups.attr('transform', 'translate(0, 30)');
        this.chartGroups.attr('transform', 'translate(120, 30)');
    }

    render(chartsData:ChartData[]) {
        const [,h] = this.dimensions();
        var chartSize = h / chartsData.length;

        this.chartsData = chartsData;
        this.renderLabelGroups(chartSize);
        this.renderCharts(chartSize);
    }

    private renderLabelGroups(chartSize:number) {
        var label = this.labelGroups
            .selectAll('g.label-box')
            .data(this.chartsData)
            .enter()
            .append('g')
            .attr('class', 'label-box')
            .attr('transform', (d, i)=> `translate(0, ${i * chartSize})`);

        label.append('rect')
            .attr('y', 0)
            .attr('x', 0)
            .style({
                height: chartSize,
                width: 120
            });

        label.append('text')
            .text((d)=>d.name)
            .attr('y', 0)
            .attr('x', 60)
            .attr('dy', '2em')
            .classed('label', true)

    }

    private renderCharts(chartSize:number) {

         this.x = d3.scale.linear()
            .range([0, 100]);

        this.y = d3.scale.linear()
            .range([0, chartSize]);

        var line = d3.svg.line()
            .x((d:any[])=> this.x(d[0]))
            .y((d:any[])=> this.y(d[1]));

        this.chartGroups
            .selectAll('g.line')
            .data(this.chartsData)
            .enter()
            .append('g')
            .classed('line' , true)
            .append('path')
            .attr('id', (d, i)=> d.name.toLowerCase())
            // .attr('d', (d:any)=>line(d.data))
            .attr('d', function(d){
                return line(d.data);
            })
            .style('stroke', '#34ACE4')
            .style('stroke-width', '1px')


    }
}

