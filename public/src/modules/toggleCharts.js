function toggleCharts(e){
    
    console.log("Toggle charts.", e.target.value);
    let chart1 = document.getElementById("chart1");
    let chart2 = document.getElementById("chart2");

    if(e.target.value === "c1"){
        chart1.style.visiblity = "hidden"
        chart2.style.visibility = "visible"
        toggleChartsBtn.value = "c2"
    } else {
        chart1.style.visiblity = "visible"
        chart2.style.visibility = "hidden"
        toggleChartsBtn.value = "c1"
    }
} // end of toggleCharts function

module.exports = toggleCharts;