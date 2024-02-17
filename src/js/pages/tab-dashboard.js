import $ from "jquery";

import Chart from "chart.js/auto";
import 'chartjs-adapter-luxon';
import ChartStreaming from 'chartjs-plugin-streaming';

Chart.register(ChartStreaming);

import { Telemetry } from "../Telemetry-Server";

Chart.defaults.set('plugins.streaming', {
    duration: 10000,
    ttl:11000,
    delay:0,
    refresh:100
});

Chart.defaults.font.family = '"UbuntuMono",sans-serif';
const chartBorderWidth = 1.5;

export const dashboardChartTop = setupChartTop();
export const dashboardChartBottom = setupChartBottom();

$(() => {
    $("#dashboardAlarms").on("click", function(){
        setTab("alarms");
    });
});

function setupChartTop(){
    let ctx = document.getElementById("dashboardChart1").getContext('2d');
    let dashboardChartTop = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                data: [],
                label: "Battery Voltage",
                borderColor: "#ffff00",
                fill: false,
                pointRadius: 0,
                lineTension: 0,
                borderWidth:chartBorderWidth,
                yAxisID: "y-axis-left"
            },{
                data: [],
                label: "Battery Current",
                borderColor: "#00ffff",
                fill: false,
                pointRadius: 0,
                lineTension: 0,
                borderWidth:chartBorderWidth,
                yAxisID: "y-axis-right"
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'realtime',
                    ticks: {
                        minRotation: 0,
                        maxRotation: 0
                    }
                },
                y_1: {
                    scaleLabel: {
                        display: true,
                        labelString: 'Battery Voltage (Volts)',
                        fontFamily: "Ubuntu"
                    },
                    position: "left",
                    id: "y-axis-left",
                    ticks: {
                        beginAtZero: true,
                        suggestedMax: 40
                    }
                },
                v_2: {
                    scaleLabel: {
                        display: true,
                        labelString: 'Battery Current (Amps)',
                        fontFamily: "Ubuntu"
                    },
                    position: "right",
                    id: "y-axis-right",
                    ticks: {
                        beginAtZero: false,
                        suggestedMin: -10,
                        suggestedMax: 0,
                        reverse:true
                    }
                }
            },
            tooltips: {enabled: false},
            hover: {mode: null},
            legend: {
                labels: {
                    fontFamily: "'Ubuntu','sans-serif'"
                }
            }
        }
    });
    return dashboardChartTop;
}
function setupChartBottom(){

    let ctx = document.getElementById("dashboardChart2").getContext('2d');
    let dashboardChartBottom = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                data: [],
                label: "Motor RPM",
                borderColor: "#4286f4",
                fill: false,
                pointRadius: 0,
                lineTension: 0,
                borderWidth:chartBorderWidth,
                yAxisID: "y-axis-left"
            },{
                data: [],
                label: "Prop RPM",
                borderColor: "#414ff4",
                fill: false,
                pointRadius: 0,
                lineTension: 0,
                borderWidth:chartBorderWidth,
                yAxisID: "y-axis-left"
            },{
                data: [],
                label: "GPS Speed",
                borderColor: "#4cf441",
                fill: false,
                pointRadius: 0,
                lineTension: 0,
                borderWidth:chartBorderWidth,
                yAxisID: "y-axis-right"
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'realtime',
                    ticks: {
                        minRotation: 0,
                        maxRotation: 0
                    }
                },
                y_1: {
                    scaleLabel: {
                        display: true,
                        labelString: 'Speed (Rpm)',
                        fontFamily: "Ubuntu"
                    },
                    position: "left",
                    id: "y-axis-left",
                    ticks: {
                        beginAtZero: true,
                        suggestedMax: 3500
                    }
                },
                y_2: {
                    scaleLabel: {
                        display: true,
                        labelString: 'Speed (mph)',
                        fontFamily: "Ubuntu"
                    },
                    position: "right",
                    id: "y-axis-right",
                    ticks: {
                        beginAtZero: true,
                        suggestedMax:10
                    }
                }
            },
            tooltips: {enabled: false},
            hover: {mode: null},
            legend: {
                labels: {
                    fontFamily: "Ubuntu"
                }
            }
        }
    });
    return dashboardChartBottom;
}
// Chart 1: battery voltage, battery current
// Chart 2: motor rpm, prop rpm, gps speed

Telemetry.addDataPointCallback("batteryVoltage",function(){
    dashboardChartTop.data.datasets[0].data.push({
        x: Date.now(),
        y: Telemetry.get("batteryVoltage")
      });
});

Telemetry.addDataPointCallback("batteryCurrent",function(){
    dashboardChartTop.data.datasets[1].data.push({
        x: Date.now(),
        y: Telemetry.get("batteryCurrent")
      });
});

Telemetry.addDataPointCallback("motorRpm",function(){
    dashboardChartBottom.data.datasets[0].data.push({
        x: Date.now(),
        y: Telemetry.get("motorRpm")
      });
});

Telemetry.addDataPointCallback("propRpm",function(){
    dashboardChartBottom.data.datasets[1].data.push({
        x: Date.now(),
        y: Telemetry.get("propRpm")
      });
});

Telemetry.addDataPointCallback("gpsSpeedMph",function(){
    dashboardChartBottom.data.datasets[2].data.push({
        x: Date.now(),
        y: Telemetry.get("gpsSpeedMph")
      });
});
