var area_width = 1000;
var area_height = 500;
var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};
var width = area_width - margin.left - margin.right;
var height = area_height - margin.top - margin.bottom;
var svg = d3
.select('#scatter')
.append('svg')
.attr('height', area_height)
.attr('width', area_width);
var scatter_group = svg.append('g')
.attr('transform', `translate(${margin.left}, ${margin.top})`);
var text_group = svg.append('g')
.attr('transform', `translate(${margin.left}, ${margin.top})`);

d3.csv('assets/data/data.csv').then(function(scatter_data) {
    scatter_data.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });
// X
var xScale = d3.scaleLinear()
.domain([d3.min(scatter_data, d => d.poverty) -1, d3.max(scatter_data, d => d.poverty) +1])
.range([0, width]);
// Y
var yScale = d3.scaleLinear()
.domain([d3.min(scatter_data, d => d.healthcare) -3, d3.max(scatter_data, d => d.healthcare) +3])
.range([height, 0]);

var y_axis = d3.axisLeft(yScale);
var x_axis = d3.axisBottom(xScale);

scatter_group.append('g')
.attr('transform', `translate(0, ${height})`)
.call(x_axis);
scatter_group.append('g')
.call(y_axis);

var my_circles = scatter_group.selectAll('circle')
    .data(scatter_data)
    .enter()
    .append('circle')
    .attr('class', 'stateCircle')
    .attr('cx', d => xScale(d.poverty))
    .attr('cy', d => yScale(d.healthcare))
    .attr('r', 15)
var text_for_circle = text_group.selectAll('text')
    .data(scatter_data)
    .enter()
    .append('text')
    .attr('class', 'stateText')
    .attr('dx', d => xScale(d.poverty))
    .attr('dy', d => yScale(d.healthcare))
    .text(function(d) {
        return (d.abbr);
    })
var tool_tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([80, -60])
    .html(function(d) {
        return (`${(d.poverty)} ${(d.healthcare)}`);
});

my_circles.call(tool_tip);
text_for_circle.call(tool_tip);
my_circles.on('mouseover', function(d) {
    tool_tip.show(d, this);
})
text_for_circle.on('mouseover', function(d) {
    tool_tip.show(d, this);
})
    .on('mouseout', function(d) {
    tool_tip.hide(d);
    });

scatter_group.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left + 40)
      .attr('x', 0 - (height / 2))
      .attr('class', 'aText')
      .text('Lacks Healthcare (%)');
      scatter_group.append('text')
      .attr('transform', `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr('class', 'aText')
      .text('In Poverty (%)');

}).catch(function(error) {
console.log(error);
});
