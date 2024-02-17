import $ from "jquery";
import { Telemetry } from "../Telemetry-Server";

let alarms = {};
let firstAlarmUpdate = true;

function updateAlarms(){
    if (firstAlarmUpdate){
        $("#alarm-container").html("")
        alarms = Telemetry.getAllAlarms();
        for (let alarmId in alarms) {
            if (alarms.hasOwnProperty(alarmId)) {
                $("#alarm-container").append("<div class=\"alarm\" id=\"alarm-"+alarmId+"\"></div>")
            }
        }
        firstAlarmUpdate = false;
    }
    alarms = Telemetry.getAllAlarms();
    for (let alarmId in alarms) {
        if (alarms.hasOwnProperty(alarmId)) {
            $("#alarm-"+alarmId).html("<h3>"+alarms[alarmId].desc+"</h3><span>state = "+alarms[alarmId].state+", value = ["+Telemetry.round(alarms[alarmId].value,4)+"], alarm range = ["+alarms[alarmId].range_min+","+alarms[alarmId].range_max+"]</span>");
            if (alarms[alarmId].state){
                $("#alarm-"+alarmId).removeClass("alarm-inactive").addClass("alarm-active");
            } else {
                $("#alarm-"+alarmId).removeClass("alarm-active").addClass("alarm-inactive");
            }
        }
    }
}

Telemetry.addAlarmCallback(function(){
    updateAlarms();

    // Update alarm header
    $("#alarm-header").text("Alarms ("+Telemetry.getNumAlarms()+" active)");
    $("#numActiveAlarms").text(Telemetry.getNumAlarms());
    if (Telemetry.getNumAlarms() > 0){
        $("#dashboardAlarms").addClass("dashboardAlarmsActive")
    } else {
        $("#dashboardAlarms").removeClass("dashboardAlarmsActive")
    }
});
