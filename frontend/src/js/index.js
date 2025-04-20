//////////////////////////////////////////////////////////
// Main html page JS
// Handles all page mechanics.
//////////////////////////////////////////////////////////\
import $ from 'jquery';
import { showModal, hideModal } from './modal'
import { dashboardChartTop, dashboardChartBottom } from './pages/tab-dashboard';
import { throttleChart } from './pages/tab-throttle';

import { Telemetry } from './Telemetry-Server';

// On page initialization
$(function(){
    // Clear all the data points on page reload
    // After this we request a full data reload
    $(".data-point-raw").each(function(index, element){
        $(this).text("---");
    });

    // Set up chart options dialog
    $("#chartOptions").on("click", function(){
        showModal("Display Options",`
        <p style="position: relative; float: left;">Chart Display Interval:</p>
        <select id="chartDisplayInterval">
          <option value="1000">1 second</option>
          <option value="10000">10 seconds</option>
          <option value="30000">30 seconds</option>
          <option value="60000">1 minute</option>
        </select>
        <br><br>
        <hr>
        <div id="closeOptions" class="button">Close</div>
        `);
        $('#chartDisplayInterval').val(dashboardChartTop.options.plugins.streaming.duration);

        $("#closeOptions").click(function(){
            hideModal();
        });

        // Set up chart display interval option
        $("#chartDisplayInterval").on("change", function(){
            let timeInterval = $(this).val();
            console.log("Changing time interval to "+timeInterval+"ms");
            // Set chart setting for duration interval
            dashboardChartTop.options.plugins.streaming.duration =timeInterval;
            dashboardChartBottom.options.plugins.streaming.duration =timeInterval;
            throttleChart.options.plugins.streaming.duration =timeInterval;
            // Set chart setting for amount of data to save (add a small buffer beyond display).
            dashboardChartTop.options.plugins.streaming.ttl =timeInterval + 1000;
            dashboardChartBottom.options.plugins.streaming.ttl =timeInterval + 1000;
            throttleChart.options.plugins.streaming.ttl = timeInterval + 1000;
            dashboardChartTop.update();
            dashboardChartBottom.update();
            throttleChart.update();
        });
    })



    setupStatusBar();
});

Telemetry.addStatsCallback(function(){
    $("#status-messages").text("Status: "+Telemetry.getStat("numActiveDevices")+" active device(s)");
    let dataCoverageRatio = ((Telemetry.getNumValidDataPoints()/Telemetry.getNumDataPoints())*100.0).toFixed(1)
    $("#status-data").text("("+Telemetry.getStat("numDataPoints")+" data points \/ "+Telemetry.getStat("numRadioPackets")+" packets / "+dataCoverageRatio+"% coverage)")
    if (Telemetry.getStat("hasRadio") == "True") {
        $("#status-radio").text("Radio Link Established");
    } else {
        $("#status-radio").text("No Radio Link");
    }
});

Telemetry.addDataCallback(function(){
    let lastDataPoints = Telemetry.getAll();
    for (let source in lastDataPoints){
        for (let key in lastDataPoints[source]){
            // Update live divs with the data points
            let combinedKey = source+"\\."+key;
            let current = Telemetry.round(lastDataPoints[source][key].current,2);
            let min = Telemetry.round(lastDataPoints[source][key].min,2);
            let max = Telemetry.round(lastDataPoints[source][key].max,2);
            if (current == null){ current = "---"; }
            if (min == null){ min = "---"; }
            if (max == null){ max = "---"; }
            $("#"+combinedKey).text(current);
            $("#"+combinedKey+"\\.min").text(min);
            $("#"+combinedKey+"\\.max").text(max);
        }
    }
});

// Configures the status bar on the side.
// shows a log of all the latest data values.
function setupStatusBar(){
    // Set up status bar toggling
    $(".status-bar-toggle").text("hide");
    $(".status-bar-toggle").click(function(){
        statusBarSetState($(this), $(this).text() == "hide");
    });
}

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
