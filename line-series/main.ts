// /https://github.com/tj/d3-series

import * as d3 from 'd3'
import * as _ from 'lodash';

const DEFAULTS = {
    // target element or selector to contain the svg
    target: '#chart',

    // width of chart
    width: 550,

    // height of chart
    height: 175,

    // margin
    margin: {top: 25, right: 60, bottom: 50, left: 60},

    // axis enabled
    axis: true,

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

class Margin {
    left:number;
    right:number;
    top:number;
    bottom:number;
}

export default class LineChart {
    width:number;
    height:number;
    margin:Margin;
    target:HTMLElement;
    chart:d3.Selection<any>;
    x:d3.time.Scale<number,number>;
    y:d3.scale.Linear<number,number>;
    yRange:number[];
    xAxis:d3.svg.Axis;
    xTicks:number;

    constructor(config) {
        this.set(config);
        this.init();
    }

    set(config) {
        _.extend(this, DEFAULTS, config);
    }

    dimensions() {
        const {width, height, margin} = this;
        const w = width - margin.left - margin.right;
        const h = height - margin.top - margin.bottom;
        return [w, h];
    }

    init() {
        const {target, width, height, margin} = this;
        // const {xTicks, yTicks, yRange} = this;
        const {xTicks, yRange} = this;
        const [w, h] = this.dimensions();

        this.chart = d3.select(target)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        this.x = d3.time.scale()
            .range([0, w]);

        this.y = d3.scale.linear()
            .range(yRange);

        this.xAxis = d3.svg.axis()
            .orient('bottom')
            .scale(this.x)
            .ticks(xTicks)
            .tickPadding(8)
            .tickSize(-h);

        this.chart.append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0, ${h})`)
            .call(this.xAxis);


        his.details = this.chart.append('g')
            .attr('class', 'details')
            .style('display', 'none')

        this.details.append('line')
            .attr('class', 'x')
            .attr('y1', 0)
            .attr('y1', h)

        this.details.append('text')
            .attr('class', 'time')

        this.details.append('g')
            .attr('class', 'data')

        this.overlay = this.chart.append('rect')
            .attr('class', 'overlay')
            .attr('width', w)
            .attr('height', h)
            .style('fill-opacity', 0)
            .on('mousemove', _ => this.onMouseOver())
            .on('mouseleave', _ => this.onMouseLeave());

        this.xBisect = d3.bisector(d => d.time).left;


    }

}