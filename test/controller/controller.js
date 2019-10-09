
window.onload = function () {

    App = new AppController();
    App.init();
};

var App;
var Expenses = [];
var Rows = [];
var rowId = 0;
var sum = 0;
var price = 0;
var quantity = 1;
var unitaryPrice = 0;

var AppController = function(){

    this.init = function () {

        this.updateTotal();

        $("#btn-add").addEventListener('click', function () {
            if (App.isNumber($("#input").value)) {
                var exp = { id: rowId, expVal: parseFloat($("#input").value) };
                if (price === 0) { unitaryPrice = unitaryPrice = parseFloat($("#input").value); } else { unitaryPrice = price; }

                App.add(Expenses, exp);
                App.add(Rows, App.newRow(exp.expVal, rowId, quantity, unitaryPrice));

                rowId++;

                sum = 0; price = 0; quantity = 1; unitaryPrice = 0;
            }
            $("#input").value = '';
            $("#input").focus();
        });

        $("#btn-delete").addEventListener('click', function () {
            App.deleteRows();
        });

        $("#btn-sum").addEventListener('click', function () {

            if (price === 0) {
                price = parseFloat($("#input").value);
                sum += price;
                $("#input").value = sum;
            }

            sum += price;
            quantity++;

            $("#input").value = sum;
        });
    };

    this.isNumber = function (value) {
        return new RegExp(/^\d+(\.\d{1,2})?$/).test(value);
    };

    this.add = function (array, elem) {
        array.push(elem);
        this.updateTotal();
        this.updateRows();
    };

    this.updateTotal = function () {
        $("#total").textContent = "Total amount: " + this.calculateExpenses() + "€";
    };

    this.calculateExpenses = function () {
        var total = 0;

        Expenses.forEach(exp => {
            total += exp.expVal;
        });

        return total;
    };

    this.updateRows = function () {
        $("#table").innerHTML = '';

        Rows.forEach(row => {
            $("#table").innerHTML += row.rowVal;
        });
    };

    this.deleteRows = function () {
        var checks = document.querySelectorAll('.chk');

        for (let i = 0; i < checks.length; i++) {
            if (checks[i].checked) {
                removeByAtrr(Rows, 'id', i);
                removeByAtrr(Expenses, 'id', i);
            }
        }

        this.updateRows();
        this.updateTotal();
    };

    this.newRow = function (value, id, quantity, unitaryPrice) {
        return a = {
            id: id,
            rowVal: "<tr>" +
                        "<td> <span>" + quantity + "</span></td>" +
                        "<td> <span class='value'>" + value + "€</span></td>" +
                        "<td><span>" + unitaryPrice + "€</span></td>" +
                        "<td><input type='checkbox' class='chk' id='row-" + id + "' /></td>" +
                    "</tr> "
        };
    };
};

//source: https://stackoverflow.com/questions/3396088/how-do-i-remove-an-object-from-an-array-with-javascript

function removeByAtrr(array, attribute, value) {
    var len = array.length;
    while (len--) {
        if (array[len] && array[len].hasOwnProperty(attribute) && (arguments.length > 2 && array[len][attribute] === value)) {
            array.splice(len, 1);
        }
    }
}


