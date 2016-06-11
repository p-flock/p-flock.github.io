// Author: Peter J FLockhart
// under contract with Drip Financial
//

var margin = {top:20, right: 30, bottom: 50, left: 60};
var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var domain0 = [+new Date(1989, 0, 1), +new Date(1996, 0, 1)],
    domain1 = [+new Date(1989, 0, 1), +new Date(2001, 1, 2)];
domain2 = [+new Date(1989, 0, 1), +new Date(2011, 1, 2)];


var principal = 2000;
var interest = 0.08;

var returns = [];
var alt_returns = [];
var longterm_returns = [];




for (var i = 0; i <6; i++) {
    returns.push({value: principal*(Math.pow((1+interest), i)), date: new Date(1990+i, 0, 1)});
}

for (var i = 0; i <11; i++) {
    alt_returns.push({value: principal*(Math.pow((1+interest), i)), date: new Date(1990+i, 0, 1)});
}
for (var i = 0; i <21; i++) {
    longterm_returns.push({value: principal*(Math.pow((1+interest), i)), date: new Date(1990+i, 0, 1)});
}

var data = {domain: domain0, principal: principal, interest: interest, returns: returns};

var alt_data = {domain: domain1, principal: principal, interest: interest, returns: alt_returns};

var barWidth = width / (returns.length + 2);

    var x = d3.time.scale.utc()
        .domain(domain0)
        .nice(d3.time.year, 1)
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0])
        .domain([0, returns[returns.length-1].value]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");


    var chart = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var g = chart.selectAll(".bar")
    .data(returns)
    .enter().append("rect")
        .attr("class", "bar")
        .attr("y", function (d) {return y(d.value);})
        .attr("height", function(d, i){return height - y(d.value);})
        .attr("width", barWidth - 7)
        .attr("x", function(d){return x(d.date) - barWidth/2;});
        //.attr("transform", function(d, i) { return "translate(" + ((i * barWidth) + 3) + ",0)"; });

    var gAxis = chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height) + ")")
    .call(xAxis);

    var lAxis = chart.append("g")
    .attr("class", "y axis")
    .call(yAxis);

    //initialize odometer
    var el = document.getElementById("value-odometer");
    el = new Odometer({
        el: el,
        value: returns[returns.length -1].value,
        theme: 'plaza'
    });
    //el.font-size(45);

    function transition_chart() {
        transition_axes();
        transition_bars();
    };
    function transition_axes() {
        //transition x axis for new scale
        gAxis.transition().duration(1000).tween("axis", function(d, i) {
            var i = d3.interpolate(domain0, domain1);
            return function(t) {
                x.domain(i(t));
                gAxis.call(xAxis);
            }
        });

        x.domain(domain1);

        //transition y axis for new scale
        lAxis.transition().duration(1000).tween("axis", function(d, i) {
            var i = d3.interpolate([0, returns[returns.length-1].value], [0, alt_returns[alt_returns.length - 1].value]);
            return function(t) {
                y.domain(i(t));
                lAxis.call(yAxis);
            }
        });

        y.domain([0, alt_returns[alt_returns.length - 1].value]);
    };

    function transition_bars() {
        barWidth = width / (alt_returns.length + 2);

        // Delete old bars from graph
        var sel = chart.selectAll(".bar")
            .transition()
                .duration(500)
                .ease("exp")
            .attr("width", 0).remove();

        // add new data points / bars, need to animate
        chart.selectAll(".year")
                .data(alt_returns)
                //.enter().append("rect").attr("transform", function(d, i) { return "translate(" + ((i * barWidth) + 3)+ ",0)"; })
                .enter().append("rect").attr("x", function(d){return x(d.date) - barWidth/2;})
                .attr("class", "bar")
                .attr("y", function (d) {return y(d.value);})
                .transition()
                .duration(500)
                .attr("height", function(d, i){return height - y(d.value);})
                .attr("width", barWidth - 7);

        el.update(alt_returns[alt_returns.length -1].value);
    };


    function transition_10_20() {
        transition_axes_20();
        transition_bars_20();
    }

    function transition_20_5() {
        transition_axes_5();
        transition_bars_5();
    };

    function transition_axes_20() {
        //
        //transition x axis for new scale
        gAxis.transition().duration(1000).tween("axis", function(d, i) {
            var i = d3.interpolate(domain1, domain2);
            return function(t) {
                x.domain(i(t));
                gAxis.call(xAxis);
            }
        });

        x.domain(domain2);

        //transition y axis for new scale
        lAxis.transition().duration(1000).tween("axis", function(d, i) {
            var i = d3.interpolate([0, returns[returns.length-1].value], [0, alt_returns[alt_returns.length - 1].value]);
            return function(t) {
                y.domain(i(t));
                lAxis.call(yAxis);
            }
        });

        y.domain([0, longterm_returns[longterm_returns.length - 1].value]);
    };

    function transition_bars_20() {
        barWidth = width / (longterm_returns.length + 2);

        // Delete old bars from graph
        var sel = chart.selectAll(".bar")
            .transition()
                .duration(500)
                .ease("exp")
            .attr("width", 0).remove();

        // add new data points / bars, need to animate
        chart.selectAll(".year")
                .data(longterm_returns)
                //.enter().append("rect").attr("transform", function(d, i) { return "translate(" + ((i * barWidth) + 3)+ ",0)"; })
                .enter().append("rect").attr("x", function(d){return x(d.date) - barWidth/2;})
                .attr("class", "bar")
                .attr("y", function (d) {return y(d.value);})
                .transition()
                .duration(500)
                .attr("height", function(d, i){return height - y(d.value);})
                .attr("width", barWidth - 7);

        el.update(longterm_returns[longterm_returns.length -1].value);
    };

    function transition_axes_5() {
        //
        //transition x axis for new scale
        gAxis.transition().duration(1000).tween("axis", function(d, i) {
            var i = d3.interpolate(domain2, domain0);
            return function(t) {
                x.domain(i(t));
                gAxis.call(xAxis);
            }
        });

        x.domain(domain0);

        //transition y axis for new scale
        lAxis.transition().duration(1000).tween("axis", function(d, i) {
            var i = d3.interpolate([0, returns[returns.length-1].value], [0, returns[returns.length - 1].value]);
            return function(t) {
                y.domain(i(t));
                lAxis.call(yAxis);
            }
        });

        y.domain([0, returns[returns.length - 1].value]);
    };

    function transition_bars_5() {
        barWidth = width / (returns.length + 2);

        // Delete old bars from graph
        var sel = chart.selectAll(".bar")
            .transition()
                .duration(500)
                .ease("exp")
            .attr("width", 0).remove();

        // add new data points / bars, need to animate
        chart.selectAll(".year")
                .data(returns)
                //.enter().append("rect").attr("transform", function(d, i) { return "translate(" + ((i * barWidth) + 3)+ ",0)"; })
                .enter().append("rect").attr("x", function(d){return x(d.date) - barWidth/2;})
                .attr("class", "bar")
                .attr("y", function (d) {return y(d.value);})
                .transition()
                .duration(500)
                .attr("height", function(d, i){return height - y(d.value);})
                .attr("width", barWidth - 7);

        el.update(returns[returns.length -1].value);
    };

