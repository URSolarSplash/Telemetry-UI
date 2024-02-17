import $ from "jquery";

// Handle power budget scaling
$(function(){
    $("#power-tab").click(function(){doPowerBudgetResize();});
    $(window).resize(function(){
        doPowerBudgetResize();
    });
    doPowerBudgetResize();

});

function doPowerBudgetResize(){
    let scale = Math.min(
      $("#power-budget-scaleable-wrapper").outerWidth() / $("#power-budget-canvas").outerWidth(),
      $("#power-budget-scaleable-wrapper").outerHeight() / $("#power-budget-canvas").outerHeight()
    );

    $("#power-budget-canvas").css({
      transform: "translate(-50%, -50%) " + "scale(" + scale + ")"
    });
}
