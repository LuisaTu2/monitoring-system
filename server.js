var express = require('express');
var app = express();
const expressport = 3000;
const wsport = 8080;
let getting24HData = false;
let pmt = require("./functions/pmt");

/* ***********************************
            Express Server Setup 
   *********************************** */
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.send("index.html");
});

app.listen(expressport, function () {
    console.log("Express server is running on port: ", expressport,".");
});


/* ***********************************
            Websocket Setup 
   *********************************** */
const moment = require("moment");
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: wsport });
console.log("Websocket is listening on port: ", wsport,".");
let interval;

wss.on("connection", function(e){ 
       
        e.on("message",function(msg){          
            console.log("received: %s", msg);
        }) // end of e.onmessage

        clearInterval(interval);
        let m = moment();
        const t = ukj(m);
        // console.log("VALUES FOR n, t: ", n, t); // historical values!
        e.send(JSON.stringify(t));

        let o = moment();

        function newTimeStamp(){
            const n = pmt(o);
            o.add(5, "minutes");

            if (e.readyState === 3) {
                console.log("Connection is closed!")
                clearInterval(interval);    
                return
            } else {
                e.send(JSON.stringify(n));
            }
        }

        interval = setInterval( newTimeStamp, 1e3);
            
}), // end of wss.on connection

wss.on("error", (error) => {
    console.log("Websocket connection error: ", error)
})

wss.on("close", (event) => {
    console.log("Websocket server closing connection: ", event)
})


/* ***********************************
            Calculations
   *********************************** */

ukj = ( (e) => {  
        let n = moment().subtract(24,"hours");
        let t = []; 
        for( ; n.isSameOrBefore(e); ){
            const e = pmt(n); 
            t.push(e);
            n.add(5,"minutes");
        }
        return t}
);


/*
pmt = ( e => { 
        console.log(`Generating data for ${e}`);
        // console.log("E: ", e);
        let n = 0;
        const t = {
            orgName:"Community Pool",
            orgID:7,
            sensorName:"Chlorine Level",
            sensorID:21,
            timestamp:e.format(),
            value: n = Math.random() <= .05 ? xqa() : xda()
        }; //end of t
        // console.log("pmt t: ",t)
        return t
        // return console.log(t),t
    }
    ); //end of pmt

    
xda = ( () => eki(1,3) );
xqa = ( () => {  return Math.random() <= .25 ? null : eki(0, 1e3) } );
eki = ( (e,n) => Math.random() * (n-e) + e );
*/