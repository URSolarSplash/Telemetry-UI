import Chart from "chart.js/auto";

import { Telemetry } from "../Telemetry-Server";

let data;
const chartBorderWidth = 1.5;
export const throttleChart = setupThrottle();

function setupThrottle() {
    let ctx = document.getElementById("throttleChart").getContext('2d');
    let throttleChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                data: [],
                label: "Throttle Input",
                borderColor: "#ffff00",
                borderDash: [10,5],
                fill: false,
                pointRadius: 0,
                lineTension: 0,
                borderWidth:chartBorderWidth,
                yAxisID: "y-axis-left"
            },{
                data: [],
                label: "Throttle Output",
                borderColor: "#ff0000",
                fill: false,
                pointRadius: 0,
                lineTension: 0,
                borderWidth:chartBorderWidth,
                yAxisID: "y-axis-left"
            },{
                data: [],
                label: "Target Amperage",
                borderColor: "#00ff00",
                borderDash: [10,5],
                fill: false,
                pointRadius: 0,
                lineTension: 0,
                borderWidth:chartBorderWidth,
                yAxisID: "y-axis-right"
            },{
                data: [],
                label: "Measured Amperage",
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
                        labelString: 'Throttle (%)',
                        fontFamily: "Ubuntu"
                    },
                    position: "left",
                    id: "y-axis-left",
                    ticks: {
                        beginAtZero: true,
                        max: 100,
                        min: 0
                    }
                },
                y_2: {
                    scaleLabel: {
                        display: true,
                        labelString: 'Current (Amps)',
                        fontFamily: "Ubuntu"
                    },
                    position: "right",
                    id: "y-axis-right",
                    ticks: {
                        beginAtZero: false,
                        suggestedMin: -5,
                        max: 0,
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
    return throttleChart;
};

Telemetry.addDataPointCallback("throttleInput",function(){
    throttleChart.data.datasets[0].data.push({
        x: Date.now(),
        y: ((Telemetry.get("throttleInput") / 255.0) * 100.0)
      });
});

Telemetry.addDataPointCallback("throttle",function(){
    throttleChart.data.datasets[1].data.push({
        x: Date.now(),
        y: ((Telemetry.get("throttle") / 255.0) * 100.0)
      });
});

Telemetry.addDataPointCallback("throttleCurrentTarget",function(){
    throttleChart.data.datasets[2].data.push({
        x: Date.now(),
        y: Telemetry.get("throttleCurrentTarget")
      });
});

Telemetry.addDataPointCallback("batteryCurrent",function(){
    throttleChart.data.datasets[3].data.push({
        x: Date.now(),
        y: Telemetry.get("bmvCurrent")
      });
});
