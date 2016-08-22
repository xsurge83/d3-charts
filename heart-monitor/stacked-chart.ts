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

    push(item:any) {
        this.data.push(item);
    }
}


export class StackedLineChart extends Chart {
    private x:d3.scale.Linear<number,number>;
    private y:d3.scale.Linear<number,number>;
    private chartsData:ChartData[];
    private xAxisData:any[];
    private chartGroups:d3.Selection<any>;
    private labelGroups:d3.Selection<any>;
    private chartSize:number;
    private CHART_MARGIN:number = 5;
    private CHART_WIDTH:number = 400;
    private BOTTOM_MARGIN = 13;

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

    render(xAxisData:any[], chartsData:ChartData[]) {
        const [,h] = this.dimensions();
        
        this.chartSize = h / chartsData.length;
        this.chartsData = chartsData;
        this.xAxisData = xAxisData;

        this.x = d3.scale.linear()
            .domain(d3.extent(this.xAxisData))
            .range([0, this.CHART_WIDTH]);


        var xAxis = d3.svg.axis()
            .scale(this.x)
            .orient("bottom")
            .tickFormat((d)=>{
                debugger;
                //TODO: add to options 
                return new Date(d).getSeconds();
            });

        this.chartGroups.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0, ${(this.chartSize - this.BOTTOM_MARGIN)})`)
            .call(xAxis);

        //
        // chartsData.forEach((chartData, index)=> {
        //     _this.renderChart(chartData, index)
        // });
        this.renderLabelGroups();
    }

    private renderLabelGroups() {
        var label = this.labelGroups
            .selectAll('g.label-box')
            .data(this.chartsData)
            .enter()
            .append('g')
            .attr('class', 'label-box')
            .attr('transform', (d, i)=> `translate(0, ${(i * (this.chartSize + this.CHART_MARGIN))})`);

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

        const bottomMargin = this.BOTTOM_MARGIN;

        let chartSize = this.chartSize;

        var y = d3.scale.linear()
            .domain([0, d3.max(chartData.data, (d)=> d[1])])
            .range([chartSize - bottomMargin, 0]);

        var line = d3.svg.line()
            .x((d:any[])=> this.x(d[0]))
            .y((d:any[])=> y(d[1]));


        var yAxis = d3.svg.axis()
            .scale(y)
            .ticks(4)
            .tickFormat(d3.format('d'))
            .orient('right');

        var chart = this.chartGroups.append('g')
            .attr('id', chartData.name)
            .attr('transform', `translate(0, ${(((index) * (chartSize + this.CHART_MARGIN)))})`);


        chart.append('g')
            .attr('class', 'y axis')
            .call(yAxis);

        chart
            .datum(chartData)
            .append('g')
            .classed('line', true)
            .attr('class', (d, i)=> `line ${d.name.toLowerCase()}`)
            .append('path')
            .attr('d', (d:any)=> line(d.data))
            .style('stroke', '#34ACE4')
            .style('stroke-width', '1px');

        var focus = chart.append('g')
            .attr("class", "focus")
            .style("display", "none");

        focus.append('circle')
            .attr('r', 4.5);

        focus.append("text")
            .attr('x', 4)
            .attr('dy', ".35em");

        chart.append("rect")
            .attr("class", "overlay")
            .attr("width", this.CHART_WIDTH)
            .attr("height", chartSize)
            .on("mouseover", function () {
                focus.style("display", null);
            })
            .on("mouseout", function () {
                focus.style("display", "none");
            })
            .on("mousemove", mousemove);

        var bisect = d3.bisector(function (d) {
            return d[0];
        }).left;

        function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]),
                i = bisect(chartData.data, x0),
                d0 = chartData.data[i - 1],
                d1 = chartData.data[i],
                d;

            console.log(x0);
            console.log(i);
            d = x0 - d0[0] > d1[0] - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + x(d[0]) + "," + y(d[1]) + ")");
            focus.select("text").text(d[0]);
        }
    }
}

