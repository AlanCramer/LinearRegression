

$(document).ready(function() {
    var a = [[1,2,3],[2,3,5],[3,5,7]];
    var b = numeric.det(a);
    var c = numeric.svd(a);
    
    var spanElem = document.getElementById("bub");
    spanElem.textContent = b.toString();
});

// this is called the hypothesis
function fitFn(th1, th2) {
    return function(x) { 
        return th1 + th2*x;
    };
}

// this is referred to as J(theta) where theta is a vector
// data is an array of m objects, each with an x and a y
function costFn(hypothFn, data) {
    
    var m = data.length;
    var sum = 0;
    
    data.forEach(function(pt, i) {  
        sum += (hypothFn(pt.x) -pt.y) * (hypothFn(pt.x) -pt.y);
    });
    sum *= 1/(2*m);
    
    return sum;
}

function fitLine(data) {
    
    var hyp = fitFn(0, 0);
    var alpha = 1; // ???
    
    var err = costFn(hyp, data);
    
    var spanElem = document.getElementById("bub");
    spanElem.textContent = "err is " + err.toString();
};

// min J(theta), where theta is a vector
// theta will 
function regress(J, theta) {
    
}

// alpha is learning rate
// temp[i] = theta[i] - alpha * d_J/d_theta[i]
// where d_J/d_x are the partials

function regressStep(J, theta, alpha) {

    var temp = []; // vector
    
    
}

// same thing, but with only 2 variables
function regress2vec(hyp, t0, t1, alpha, data) {
    
    // https://www.coursera.org/learn/machine-learning/lecture/kCvQc/gradient-descent-for-linear-regression
    // at minute 3:30
    // repeat until convergence regressStep2vec
    
    var ti = [t0, t1];
    var alpha = 1;
    var done = false;
    
    while(!done) {
        var tip1 = regressStep2vec(hyp, t0, t1, alpha, data);
        
        err = 0;
        ti.forEach( function(t, i) { 
            err += Math.abs(t - tip1[i]);
        });
        
        if (err < .001) {// what val???
            done = true;
        }
    }
}

function regressStep2vec(hyp, t0, t1, alpha, data) {
    // tmp0 = t0 - alpha/m * sum(1..m) (h(x[i] - y[i])
    // tmp1 = t1 - alpha/m * sum(1..m) (h(x[i] - y[i])*x[i]) 
    
    var m = data.length;
    var c = alpha/m;
    
    var sum0 = 0;
    var sum1 = 0;
    
    data.forEach(function(pt, i) {
        var term0 = (hyp(pt.x) - pt.y)*(hyp(pt.x) - pt.y);
        sum0 += term0;
        
        var term1 = (hyp(pt.x) - pt.y)*(hyp(pt.x) - pt.y)*pt.x;
        sum1 += term1;
    });
    
    var t0p = t0 - c*sum0;
    var t1p = t1 - c*sum1;
    
    return [t0p, t1p];
}


