

$(document).ready(function() {
    var a = [[1,2,3],[2,3,5],[3,5,7]];
    var b = numeric.det(a);
    var c = numeric.svd(a);
    
    var spanElem = document.getElementById("bub");
    spanElem.textContent = b.toString();
});



