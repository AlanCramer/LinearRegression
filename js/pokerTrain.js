
function runPokerClassification(handType) {
    var data = [];
    d3.csv("train.csv")
      .row(function(d) { 
        var x = [];
        for (var property in d) {
            if (d.hasOwnProperty(property)) {
                d[property] = +d[property]; // strings to numbers
                if (property != "hand") {
                    // feature scaling
                    if (property[0] === 'C') {
                        x.push((d[property] - 7)/7);
                    }
                    if (property[0] === 'S') {
                        x.push((d[property] -2 )/2);
                    }
                }
            }
        }
        d.x = x;
        d.y = (d["hand"] === handType) ? 1 :0 ;
        return (d);
      })
      .get(function(error, rows) {
          OnPokerDataLoaded(rows);
      });
};



function OnPokerDataLoaded(data) {
    
    console.log(data.length);
    var res = logisticGradientDescent(data, 250);

    // report result
    var thetaSpan = document.getElementById("flushTheta");
    var formattedTheta = [];
    res.theta.forEach(function(t) { formattedTheta.push(t.toFixed(1)); });
    var msg = "[" + formattedTheta.join('   ') + "]"; // todo, &nbsp;&nbsp is not processed but how to have more space here
    thetaSpan.textContent = msg;
   
    var ec = addScatterPlot(".errorChart2", res.errorData, "Number of Iterations", "Error");
    
    addThetaCostGraph(".flushThetaGraph", res.theta, data);
}




 