const moment = require("moment");

let pmt = function (m) {
    // console.log(`Generating data for ${m}`);
    // Convert timestamp if moment object is not an instance of Moment.js
    let ts = moment.isMoment(m) ? m.format() : "";
    let n = Math.random() <= .05 ? xqa() : xda();
    const data = {
        orgName: "Windsor Community Pool",
        orgID: 7, 
        sensorName: "Chlorine Level",
        sensorID: 21,
        timestamp: ts,
        value: n  
    }
    return data
}

   
xda = ( () => eki(1,3) );
xqa = ( () => {  return Math.random() <= .25 ? null : eki(0, 1e3) } );
eki = ( (e,n) => Math.random() * (n-e) + e );

module.exports = pmt;