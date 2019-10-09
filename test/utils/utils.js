
function $(selector) {
    return document.querySelector(selector);
}

function Load(object, document) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            object.innerHTML = this.responseText;
        }
    };
    xhttp.open("GET", document, true);
    xhttp.send();
}
