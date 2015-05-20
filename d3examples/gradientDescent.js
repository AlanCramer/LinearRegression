

$(document).ready(function() {
    
})

// this is called the hypothesis
function lineFn(th1, th2) {
    return function(x) { 
        return th1 + th2*x;
    };
}

// theta is an array, t0 ... tn
function hyperplaneFit(theta) {

    return function(x) { // x is an n-dimensional array
        var sum = 0;
        theta.forEach(function (t, i) { sum += t*x[i] });
        return sum;
    };
}

// theta is an array, t0 ... tn
// the output function is 1/(1+e^-(transpose(theta)*x))
// https://www.coursera.org/learn/machine-learning/lecture/MtEaZ/simplified-cost-function-and-gradient-descent
// minute 5:24
function logisticRegFit(theta) {

    return function(x) { // x is an n-dimensional array
        var sum = 0;
        theta.forEach( function (t, i) { sum += t*x[i] });
        
        return 1/(1+ Math.exp(-sum));
    };
}

// this is referred to as J(theta) where theta is a n-vector
// data is an array of m objects, each with an x array of length n, and a y value
// That is, data[i]= {x:[0..n], y:y_i]}
//
function costFnSumSquares(hypothFn, data) {
    
    var m = data.length;
    var sum = 0;
    
    data.forEach(function(pt, i) {  
        sum += (hypothFn(pt.x) -pt.y) * (hypothFn(pt.x) -pt.y);
    });
    sum *= 1/(2*m);
    
    return sum;
}

// this cost function is for (binary) logistic regression
// y is allowed to be 0 or 1.
// that is, data[i]= {x:[0..n], y:y_i]} where data[i].y is only allowed to be 0 or 1
// 
// https://www.coursera.org/learn/machine-learning/lecture/MtEaZ/simplified-cost-function-and-gradient-descent
// minute 4:09
function costFnLogisticRegression(hypothFn, data) {
    
    var m = data.length;
    var sum = 0;
    
    data.forEach(function(pt, i) {  
        sum += pt.y * Math.log(hypothFn(pt.x)) + (1-pt.y) * Math.log(1-hypothFn(pt.x));
    });
    sum *= -1/m;
    
    return sum;
}

// minimize J(theta), where J is a cost function
// Jpartials is an array of functions, the partial derivatives with respect to theta[i]
//
function logisticGradientDescent(data, maxIter) {
       
    // https://www.coursera.org/learn/machine-learning/lecture/kCvQc/gradient-descent-for-linear-regression
    // at minute 3:30
    // repeat until convergence regressStep2vec
    var theta = [];
    for (var ti = 0; ti < data.x.length; ++ti) {
        theta[ti] = 0;
    }
    
    var alpha = .01;
    var hyp = logisticRegFit(theta);
    
    var done = false;
    var ct = 0;
    var errorData = [];
    
    while(ct < maxIter) {
        
        // read: tip1 is "theta of i plus 1"
        var tip1 = gradientDescentStep(hyp, theta, alpha, data);
             
        hyp = logisticRegFit(tip1);
        
        var err = costFnLogisticRegression(hyp, data);
        errorData.push({x:ct, y:err});     
        ct++;        
    }
    
    return {theta:theta, errorData: errorData};
}


// hyp is the hypothesis function
// theta are the current values of the hyp function
// alpha is learning rate
// amazingly, this works for both sum squares and logisticReg cost functions.
// https://www.coursera.org/learn/machine-learning/lecture/MtEaZ/simplified-cost-function-and-gradient-descent
// min 7:00
//
function gradientDescentStep(hyp, theta, alpha, data) {

    // temp[i] = theta[i] - alpha * d_J/d_theta[i]

    var temp = []; // vector
    
    var m = data.length;
    var c = alpha/m;
    
    var dJdxi = []; // partial with respect to x[i]
    
    data.forEach(function(pt, i) {
        var termi = hyp(pt.x) - pt.y;
        dJdxi[i] += termi * pt.x[i];
    });
    
    var tp1 = [];
    theta.forEach(function(ti, i) { tp1[i] = ti - c * dJdxi[i] });
    
    return tp1;
    
}



    
    