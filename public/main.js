// const checkLevels = require("./functions/invalidChlorineLevels.js");

window.onload = function(){ 

    /* **********************************************************************
                    Variables Declaration & Initialization
    ********************************************************************** */
    let initialData = [];
    let initialDataLength = 0;
    let data = [];
    let x_time = [];
    let y_chlorine = [];
    let isFirstRender = true;
    let dataCount = 0;
    let alertTable = document.getElementById("alertTable");
    let count = 0; let countAnomalous = 0;  let countOOB = 0;  let countNull = 0; 
    let locationHTML = document.getElementById("subHeaderTitle");
    let toggleChartsBtn = document.getElementById("toggleChartsButton");
    toggleChartsBtn.addEventListener("click", toggleCharts);
   
    
    /* **********************************************************************
                    Create WebSocket & Connection Handlers
    ********************************************************************** */
    const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
        socket.send("\n*****\nWebsocket connection opened!\n*****");
    }

    socket.onerror = (error) => {
        console.log("Websocket error: ", error);
        console.log(error.srcElement.readyState);
    }

    socket.onmessage = (event) => {

        // Log data received from server
        console.log("Data received from server:\n", event.data);
        
        if(isFirstRender){

            isFirstRender = false;
            initialData = JSON.parse(event.data); 
            initialDataLength = initialData.length; 
            count = initialDataLength;
            data = initialData;
            let location = data[0].orgName; 
            locationHTML.innerHTML = location;
            
            // Creating x and y-axes arrays
            data.forEach( (d) => { 
                let cL = d.value;
                if(d.value < 1 || d.value > 3 || d.value === null) {
                    countAnomalous++;
                    cL = invalidChlorineLevels(d);
                }                
                x_time.push(d.timestamp);
                y_chlorine.push(cL);  
          ;
            })
            
            // Creating plots
            let layout = {
                title: {
                    text: "Chlorine Levels - ",
                    font: {
                        size: 18,
                        color: "rgba(80, 107, 165, 1)"
                    }
                    },
                xaxis: {
                    title: {
                      type: "date", 
                      font: {
                          size: 12
                      }
                    },
                  },
                yaxis: {
                    title: {
                        text: "Chlorine Levels (ppm)",
                    }
                }
            }

            let layout1 = JSON.parse(JSON.stringify(layout));
            let layout2 = JSON.parse(JSON.stringify(layout));
            layout1.title.text += " Historical Data"
            layout2.title.text += " Time Lapse"
            
            Plotly.plot("chart1",
                [{ y: y_chlorine, x: x_time, type: "line", line:{width:2, color: "rgba(2, 197, 119, 1)" }}],
                 layout1
            )             
            
            Plotly.plot("chart2",
                [{ y: y_chlorine, x: x_time, type: "line", line:{width:2, color: "rgba(240, 86, 130, 1)" }}],
                 layout2
            )  

        } else {

            let d = JSON.parse(event.data); 
            count++;
            data.push(d); 
            x_time.push(d.timestamp); 
            let chlorineValue = d.value;

            if(d.value < 1 || d.value > 3 || d.value === null) {
                alert("Anomalous chlorine level recorded!");
                countAnomalous++;
                chlorineValue = invalidChlorineLevels(d);
            }
            y_chlorine.push(chlorineValue);
           
            // Populate Stats Table
            stats(initialDataLength, count, countAnomalous, countOOB, countNull,  y_chlorine)

            // Plot Chart1 
            Plotly.extendTraces("chart1", {
                x: [[d.timestamp]],
                y: [[d.value]]
             }, [0])

            if(count > initialDataLength){
                let x_updatedTimeRange = x_time.slice(count-initialDataLength, );
                Plotly.relayout("chart1",  {
                    xaxis: {
                        range: [x_time[0], d.timestamp],
                        title: {
                            text: "Time"
                        }
                    }
                }) // end of Plotly.relayout               
            } 

            // Plot Chart2 
            Plotly.extendTraces("chart2", {
                x: [[d.timestamp]],
                y: [[d.value]]
            }, [0])

            Plotly.relayout("chart2",  {
                xaxis: {
                    range: [x_time[count-initialDataLength], d.timestamp],
                    title: {
                        text: "Time"
                    }
                }
            }) // end of Plotly.relayout    

        } // end of else statement
         
    } // end of socket.onmessage function


    /* **********************************************************************
                    Closign WebSocket Connection
    ********************************************************************** */
    socket.onclose = (e) => {
        console.log("Websocket connection is now closed.", e)
        console.log(e.srcElement.readyState);
    }



    /* **********************************************************************
                    Functions and Helpers
    ********************************************************************** */
    
    function invalidChlorineLevels(d){ 

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


    function stats( count24H, countHist, cntAnomalous, cntOOB, cntNull, chlorineHist){

        let elements = [];      
        let cntAnomalous24H = 0;
        let cntOOB24H = 0;
        let cntNull24H = 0;
        let chlorine24H = chlorineHist.slice((countHist - count24H), );
        let chlorineAvg24H = (chlorine24H.reduce((t, c) => t + c) / chlorine24H.length).toPrecision(6);
        let chlorineAvgHist = (chlorineHist.reduce( (s, v) => s + v ) / chlorineHist.length).toPrecision(6);       
       
        chlorine24H.forEach( (cv) => {
            if(cv === null){
                cntAnomalous24H++; cntNull24H++;
            } else if(cv < 1 || cv > 3){
                cntAnomalous24H++; cntOOB24H++;
            }
        });

        let percentageAnomalous = (cntAnomalous/chlorineHist.length*100).toPrecision(3);
        let percentageAnomalous24H = (cntAnomalous24H/chlorine24H.length*100).toPrecision(3);
        let max24H = Math.max(...chlorine24H).toPrecision(3); 
        let maxHist = Math.max(...chlorineHist).toPrecision(3);

        let stats = [ count24H, countHist, chlorineAvg24H, chlorineAvgHist, cntAnomalous24H, cntAnomalous, cntOOB24H, cntOOB, cntNull24H, cntNull, percentageAnomalous24H, percentageAnomalous, max24H, maxHist];       

        for(let i = 1; i < 8; i++){
            for(let j = 1; j < 3; j++){
                let eltID = "statsR" + i + "E" + j;
                let elt = document.getElementById(eltID);
                elements.push(elt);
            }
        }

        elements.forEach( (e, ix) => {
                e.innerHTML = stats[ix]
            }
        )
    } // end of stats function

} // end of window.onload
