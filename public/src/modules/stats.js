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

module.exports = stats;