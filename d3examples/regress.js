

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
function regress2vec( data) {
    
    // https://www.coursera.org/learn/machine-learning/lecture/kCvQc/gradient-descent-for-linear-regression
    // at minute 3:30
    // repeat until convergence regressStep2vec
    var t0 = 0;
    var t1 = 0;
    var alpha = .01;
    var hyp = fitFn(t0, t1);
    
    var done = false;
    var ct = 0;
    var errorData = [];
    
    while(ct < 1000) {
        
        var tip1 = regressStep2vec(hyp, t0, t1, alpha, data);
             
        t0 = tip1[0];
        t1 = tip1[1];
        hyp = fitFn(t0, t1);
        
        var err = costFn(hyp, data);
        errorData.push({x:ct, y: err});     
        ct++;        
    }
    
    return {t0: t0, t1: t1, errorData: errorData};
}

function regressStep2vec(hyp, t0, t1, alpha, data) {
    // tmp0 = t0 - alpha/m * sum(1..m) (h(x[i] - y[i])
    // tmp1 = t1 - alpha/m * sum(1..m) (h(x[i] - y[i])*x[i]) 
    
    var m = data.length;
    var c = alpha/m;
    
    var sum0 = 0;
    var sum1 = 0;
    
    data.forEach(function(pt, i) {
        var termi = hyp(pt.x) - pt.y;
        sum0 += termi;
        sum1 += termi * pt.x;
    });
    
    var t0p = t0 - c*sum0;
    var t1p = t1 - c*sum1;
    
    return [t0p, t1p];
}


