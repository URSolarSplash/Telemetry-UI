var lastDataPoints = {};
var numDataPoints = 0;
var numDataPackets = 0;

$(function(){
    // Clear all the data points on page reload
    // After this we request a full data reload
    $(".data-point-raw").each(function(index, element){
        $(this).text("---");
    });

    // Set up status bar toggling
    $(".status-bar-toggle").text("hide");
    $(".status-bar-toggle").click(function(){
        statusBarSetState($(this), $(this).text() == "hide");
    });
    statusBarSetState($("#status-bar-toggle-gps"),true)
    statusBarSetState($("#status-bar-toggle-gyro"),true)
    statusBarSetState($("#status-bar-toggle-alltrax"),true)
    statusBarSetState($("#status-bar-toggle-vesc"),true)
    statusBarSetState($("#status-bar-toggle-battery"),true)
    statusBarSetState($("#status-bar-toggle-throttle"),true)

    setupChart();

    setInterval(function() {
        $.getJSON("http://localhost:5000/live", function(data){
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    if (data[key].current == "None") {
                        data[key].current = "---"
                    }
                    if (data[key].min == "None") {
                        data[key].min = "---"
                    }
                    if (data[key].max == "None") {
                        data[key].max = "---"
                    }
                    receiveDataPoint("telemetry",key,data[key]);
                }
            }
        });
        $.getJSON("http://localhost:5000/stats", function(data){
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    if (data[key] == "None") {
                        data[key] = "---"
                    }
                    dataPacket = {}
                    dataPacket.current = data[key]
                    receiveDataPoint("stats",key,dataPacket);
                }
            }
            updateStatusBar();
        });
  }, 500);
});

function statusBarSetState(object, state){
    if (state){
        statusBarShow(object);
    } else {
        statusBarHide(object);
    }
}

function statusBarShow(object){
    object.parent().addClass("status-pane-hidden");
    object.text("show");
}

function statusBarHide(object){
    object.parent().removeClass("status-pane-hidden");
    object.text("hide");
}

// Receives a data point eg
// motor, motorTemp, 120.0
function receiveDataPoint(source,key,value){

    // Save to dictionary of the latest values
    if (!(source in lastDataPoints)){
        lastDataPoints[source] = {};
    }
    lastDataPoints[source][key] = {};
    lastDataPoints[source][key].current = value.current;
    lastDataPoints[source][key].min = value.min;
    lastDataPoints[source][key].max = value.max;

    parseChartData(key, value.current);

    // Update divs with the id
    var combinedKey = source+"\\."+key;
    $("#"+combinedKey).text(lastDataPoints[source][key].current);
    $("#"+combinedKey+"\\.min").text(lastDataPoints[source][key].min);
    $("#"+combinedKey+"\\.max").text(lastDataPoints[source][key].max);
}

function updateStatusBar(){
        $("#status-messages").text("Status: "+lastDataPoints.stats.numActiveDevices.current+" active device(s)");
        $("#status-data").text("("+lastDataPoints.stats.numDataPoints.current+" data points \/ "+lastDataPoints.stats.numRadioPackets.current+" packets)")
        if (lastDataPoints.stats.hasRadio.current == "True") {
            $("#status-radio").text("Radio Link Established");
        } else {
            $("#status-radio").text("No Radio Link");

        }
}

var dashboardChart;
var chartX = 0;
function setupChart(){
    var ctx = document.getElementById("dashboardChart").getContext('2d');
    data = []
    dashboardChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                data: [],
                label: "Battery Voltage",
                borderColor: "#ffff00",
                fill: false,
                pointRadius: 0,
                cubicInterpolationMode: "monotone"
            },{
                data: [],
                label: "Battery Current",
                borderColor: "#00ffff",
                fill: false,
                pointRadius: 0
            }]
        },
        options: {
            maintainAspectRatio: false,
            steppedLine: false,
            elements: {
                line: {
                    tension: 0, // disables bezier curves
                }
            }
        }
    });
}

function parseChartData(key, value){
    chartX++;
    if (key == "bmvVoltage"){
        addData(0,chartX,value);
    }
    if (key == "bmvCurrent"){
        addData(1,chartX,value);
    }
}

var maxLength = 20;
function addData(datasetIndex, label, data) {
    if (dashboardChart.data.labels.length > maxLength){
        dashboardChart.data.labels.shift()
    }
    if (dashboardChart.data.datasets[datasetIndex].data.length > maxLength){
        dashboardChart.data.datasets[datasetIndex].data.shift()
    }
    dashboardChart.data.labels.push(label);
    dashboardChart.data.datasets[datasetIndex].data.push(data);
    dashboardChart.update();
}
