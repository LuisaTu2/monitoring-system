function invalidChlorineLevels(d){ 

    if( d === null || d === "" || d === undefined || isNaN(d) ){
        return null
    }

    if(d.value === null ){
        countNull++
    } else {
        countOOB++
    }

    let chlorineLevelLabel = d.value === null ? "null" : d.value;
    let chlorineLevel = d.value; // === null ? 0 : d.value;         
    let newRow = alertTable.insertRow(-1);
    let newCount = newRow.insertCell(0);
    let newDate = newRow.insertCell(1);
    let newTime = newRow.insertCell(2);
    let newValue = newRow.insertCell(3);

    newCount.innerHTML = countAnomalous;
    newDate.innerHTML = d.timestamp.substring(0,10);
    newTime.innerHTML = d.timestamp.substring(11,19);
    newValue.innerHTML = chlorineLevelLabel;

    newCount.setAttribute("class", "c01");
    newDate.setAttribute("class", "tableElement");
    newTime.setAttribute("class", "tableElement");
    newValue.setAttribute("class", "tableElement");
    newValue.setAttribute("class", "tableElement tableElementTime");

return chlorineLevel
} // end of Invalid Chlorine Levels function

module.exports = invalidChlorineLevels;