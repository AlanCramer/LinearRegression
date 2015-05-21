

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
       
        // calculate the dot product
        var sum = 0;
        x.forEach( function (xi, i) { sum += theta[i]*xi } );
        
        // return sigmoid function of dot product
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
    var eps = .000001;
    
    data.forEach(function(pt, i) {  
        var t = hypothFn(pt.x);
        
        if (t > eps && t < (1-eps)) {
            var t3 = pt.y ? Math.log(t) : Math.log(1-t);
            sum += t3;
        }
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
    
    // prep the data by prepending a 1 in all the x arrays
    data.forEach(function(pt, i) {
        pt.x.splice(0,0,1);
    });
    
    // theta's size is the same as x's (augmented) size
    // all the x's better be the same
    var theta = [];
    for (var ti = 0; ti < data[0].x.length; ++ti) {
        theta[ti] = 0;
    }
    
    var alpha = .1;
    var hyp = logisticRegFit(theta);
    
    var done = false;
    var ct = 0;
    var errorData = [];
    
    while(ct < maxIter) {
        
        var theta = gradientDescentStep(hyp, theta, alpha, data);
             
        hyp = logisticRegFit(theta);
        
        var err = costFnLogisticRegression(hyp, data);
        errorData.push({x:ct, y:err});     
        ct++;        
    }
    
    // de-prep the data by removing that first element 1 we added
    data.forEach(function(pt, i) {
        pt.x.splice(0,1); 
    });
    
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

    var dJdxi = []; // partial with respect to x[i]
    
    // init the partials
    var n = data[0].x.length;
    for (var ip = 0; ip < n; ++ip) {
        dJdxi[ip] = 0;
    }
    
    // calculate the partials
    dJdxi.forEach(function(partial, j) {
        
        var sum = 0;
        data.forEach(function(pt, i) {
            sum += (hyp(pt.x) - pt.y)*pt.x[j];
        });
        
        dJdxi[j] += alpha * sum;
    });
    
    // increment theta by the gradient
    var tp1 = [];
    theta.forEach(function(ti, i) { 
        tp1[i] = ti - dJdxi[i] 
    });
    
    return tp1;
}



    
    