
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