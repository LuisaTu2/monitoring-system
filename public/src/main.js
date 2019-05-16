window.onload = function(){ 

    /* **********************************************************************
                    Import Functions and Modules
    ********************************************************************** */
    const checkLevels = require("./modules/invalidChlorineLevels.js");
    const toggleCharts = require("./modules/toggleCharts");
    const stats = require("./modules/stats");
    const plotLayout = require("./modules/plotLayout"); 


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
            let layout = plotLayout;
            let layout1 = JSON.parse(JSON.stringify(layout));
            let layout2 = JSON.parse(JSON.stringify(layout));
            layout1.title.text += " Historical Data"
            layout2.title.text += " 24H Time Lapse"
            
            Plotly.plot("chart1", [{ y: y_chlorine, x: x_time, type: "line", line:{width:2, color: "rgba(2, 197, 119, 1)" }}], layout1);       
            Plotly.plot("chart2", [{ y: y_chlorine, x: x_time, type: "line", line:{width:2, color: "rgba(240, 86, 130, 1)" }}], layout2);  

        } else {

            let d = JSON.parse(event.data); 
            let chlorineValue = d.value;
            x_time.push(d.timestamp); 
            count++;

            if(d.value < 1 || d.value > 3 || d.value === null) {
                alert("Anomalous chlorine level recorded!");
                countAnomalous++;
                chlorineValue = invalidChlorineLevels(d);
            }
            y_chlorine.push(chlorineValue);
           
            // Populate Stats Table
            stats(initialDataLength, count, countAnomalous, countOOB, countNull,  y_chlorine);

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
                    Closing WebSocket Connection
    ********************************************************************** */
    socket.onclose = (e) => {
        console.log("Websocket connection is now closed.", e)
        console.log(e.srcElement.readyState);
    }

} // end of window.onload
