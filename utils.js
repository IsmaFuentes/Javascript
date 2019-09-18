
window.onload = function () {
    includeHTML();
};

// funcion que se encarga de reconocer los divs con el atributo "include" para cargar 
// en ellos el archivo .html pedido. El método se llama desde window.onload
// Ejemplo: <div include="prueba.html"></div>
function includeHTML() {
    var taggedElements, element, file, xhttp;
    taggedElements = document.getElementsByTagName("*");
    for (let i = 0; i < taggedElements.length; i++) {
        element = taggedElements[i];
        file = element.getAttribute("include");
        if (file) {
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status === 200) { element.innerHTML = this.responseText; }
                    if (this.status === 404) { element.innerHTML = "Error 404: Page not found."; }
                    element.removeAttribute("include");
                    includeHTML();
                }
            };
            xhttp.open("GET", file, true);
            xhttp.send();
            return;
        }
    }
}

function GetById(id) {
    var object = document.getElementById(id);

    return object;
}

function GetByClass(id) {
    var object = document.getElementsByClassName(id);

    return object;
}

function get(id, type) {

    switch (type) {
        case "id":
            return object = document.getElementById(id);
        case "class":
            return object = document.getElementsByClassName(id);
        case "tag":
            return object = document.getElementsByTagName(id);
        case "name":
            return object = document.getElementsByName(id);
    }
}

function valueOf(object) {
    return object.value;
}

var container = {
    main: GetById("main"),
    navbar: GetById("navbar"),
    body: GetById("body"),
    footer: GetById("footer")
};

function AppendTo(id, document) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            GetById(id).innerHTML = this.responseText;
        }
    };
    xhttp.open("GET", document, true);
    xhttp.send();
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