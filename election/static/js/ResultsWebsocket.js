google.charts.load('current', {'packages': ['corechart']});
google.charts.setOnLoadCallback(initChart);

var optionsTemplate = {
    title: '',
    titleTextStyle: {fontSize: 20},
    legend: {position: 'none'},
    pieSliceText: 'value'
};
var chartDataList = [];
var chartOptionsList = [];
var chartList = [];
var websocketProtocol = ((location.protocol === 'http:') ? 'ws://' : 'wss://');

var connection = new WebSocket(websocketProtocol + window.location.host);
connection.onopen = function () {
    console.log('Websocket connected.');
};
connection.onerror = function (error) {
    // Log errors
    console.log('WebSocket Error ' + error);
};
connection.onmessage = function (e) {
    var message = JSON.parse(e.data).message;
    chartDataList = [];
    chartOptionsList = [];

    message.forEach(function (election) {
        var data = [['Name', 'Stimmen']];
        for (var key in election.results) {
            if (election.results.hasOwnProperty(key))
                data.push([key, election.results[key]])
        }
        optionsTemplate['title'] = election.title;
        var options = Object.assign({}, optionsTemplate);

        chartDataList.push(data);
        chartOptionsList.push(options);

        document.getElementById('votes').innerHTML = election.votes_count;
    });
    drawChart();
};
connection.onclose = function () {
    console.log('Websocket closed.');
};

function initChart() {
    var parentDiv = document.getElementById('chartContainer');
    for (var i = 0; i < parentDiv.children.length; i++) {
        var chart = new google.visualization.PieChart(parentDiv.children[i]);
        chartList.push(chart);
    }
    drawChart()
}

function drawChart() {
    if (chartList.length === 0 || chartDataList.length === 0)
        return;
    for (var idx = 0; idx < chartList.length; idx++) {
        var data = google.visualization.arrayToDataTable(
            chartDataList[idx]
        );
        chartList[idx].draw(data, chartOptionsList[idx])
    }
}
