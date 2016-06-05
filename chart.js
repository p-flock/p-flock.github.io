window.onload = function () {
    var coffee_emoji = '\u2615',
        tea_emoji = '\u1f375';

    var margin = {top: 20, right: 30, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var days = groupDays(data.data);

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0])
        .domain([0, d3.max(days)]);

    var chart = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var barWidth = width / days.length;

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var g = chart.selectAll("g")
        .data(days)
        .enter()
        .append('g')
        .attr("transform", function(d,i) { return "translate("+ ((i * barWidth) + 7) + ", 0)";})
        .attr("class", "day");
    //.attr('height', function(d) {return (d.mg) + 'px'; })
    //.attr("width", "9px");
    chart.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    chart.append("g")
        .attr("class", "axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "1em")
        .style("text-anchor", "end")
        .text("mg of Caffeine");

    g.append("rect")
        .attr("y", function (d) { return y(d);})
        .attr("height", function(d, i){ console.log(height - y(d)); return height - y(d);})
        .attr("width", barWidth - 7)
        .attr("class", "bar");

    g.append("text")
        //.text(function(d) { return coffee_emoji})
        .text(function(d) {return (d) ? String(d): '';})
        .attr("y", function (d) {return y(d) - 12} )
        .attr("x", (barWidth / 2) + 2)
        .attr("dy", ".75em");

    document.getElementById("Current_mg").innerHTML = String(getCurrentBloodMg(data.data)) + 'mg';
    document.getElementById("Average_mg").innerHTML = String(Math.round(d3.sum(days) / days.length)) + 'mg';


    //chart.append("g")
    //.attr("class", "x axis")
    //.attr("transform", "translate(0," + height + ")")
    //.call(xAxis);

    //chart.append("g")
    //.attr("class", "y axis")
    //.call(yAxis);

    // PLACES BAR CORRESPONDING TO REMAINING MG FROM EACH INDIVIDUAL DOSE
    //g.append("rect")
    //.attr("height", function(d, i) {return getRemainingMg(d.mg, d.date)} )
    //.attr("width", barWidth - 10)
    //.attr("class", "remaining_amt");

}

window.setInterval(function() {
    document.getElementById("Current_mg").innerHTML = String(Math.round(getCurrentBloodMg(data.data) * 100) / 100) + 'mg';
}, 1000);


// Get current mg of caffeine in the blood
// Assuming half life is 6 hours, we calculate
// A' = A * 2^(-t/h)
// where A' = amount remaining, A = initial amount
// t = time elapsed and h = half life
var getRemainingMg = function(mg, startTime) {
    nowSeconds = (new Date).getTime() / 1000.0;
    timeElapsed = nowSeconds - startTime;
    sixHours = 6 * 60 * 60;
    remainingMg = mg * Math.pow(2, (-1 * timeElapsed/sixHours));
    remainingMg = Math.round(remainingMg * 100) / 100;
    //console.log("Caffeing remaining from " + mg  +"mg after " + timeElapsed  +"s :", remainingMg)
    return remainingMg;
}

var getCurrentBloodMg = function(data) {
    return data.reduce(function(prev, datum) {
        return prev + getRemainingMg(datum.mg, datum.date);
    }, 0)
}

var groupDays = function(data) {
    //console.log(data.length + " items in data");
    var currentDate = (new Date).getTime() / 1000.0;
    var secondsInDay = 60 * 60 * 24;
    var last30Days = [];
    for (var i = 0; i< 30; i++) {
        last30Days[i] = 0;
    }
    for (var i = 0; i < data.length; i++) {
        var daysAgo = (currentDate - data[i].date) / secondsInDay;
        var daysAgo = Math.round(daysAgo);
        //console.log(daysAgo + " days");
        if (daysAgo < 30) {
            last30Days[29 - daysAgo] += data[i].mg;
        }
    }
    return last30Days;
}

