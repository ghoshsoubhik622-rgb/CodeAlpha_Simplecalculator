// ========================================
// CALCULATOR VARIABLES
// ========================================

let current = "";
let previous = "";
let selectedOperator = null;
let resetScreen = false;


// ========================================
// HTML ELEMENTS
// ========================================

const currentDisplay =
    document.getElementById("current");

const previousDisplay =
    document.getElementById("previous");

const historyBtn =
    document.getElementById("historyBtn");

const historyPanel =
    document.getElementById("historyPanel");

const closeHistory =
    document.getElementById("closeHistory");

const clearHistoryButton =
    document.getElementById("clearHistory");

const historyList =
    document.getElementById("historyList");


// ========================================
// HISTORY
// ========================================

let calculationHistory = [];


// ========================================
// UPDATE DISPLAY
// ========================================

function updateDisplay() {

    currentDisplay.textContent =
        current || "0";


    if (
        previous !== "" &&
        selectedOperator !== null
    ) {

        previousDisplay.textContent =
            `${previous} ${getOperatorSymbol(selectedOperator)}`;

    } else {

        previousDisplay.textContent = "";

    }

}


// ========================================
// OPERATOR SYMBOL
// ========================================

function getOperatorSymbol(operator) {

    switch (operator) {

        case "+":
            return "+";

        case "-":
            return "−";

        case "*":
            return "×";

        case "/":
            return "÷";

        case "%":
            return "%";

        default:
            return operator;

    }

}


// ========================================
// ENTER NUMBER
// ========================================

function enterNumber(number) {

    // Start a new calculation after result
    if (resetScreen) {

        current = "";

        resetScreen = false;

    }


    // Prevent multiple leading zeros
    if (current === "0") {

        current = number;

    } else {

        current += number;

    }


    updateDisplay();

}


// ========================================
// DECIMAL
// ========================================

function enterDecimal() {

    if (resetScreen) {

        current = "";

        resetScreen = false;

    }


    // Only one decimal point
    if (current.includes(".")) {

        return;

    }


    // Decimal at beginning
    if (current === "") {

        current = "0";

    }


    current += ".";


    updateDisplay();

}


// ========================================
// SELECT OPERATOR
// ========================================

function selectOperator(operator) {

    // No number entered
    if (
        current === "" &&
        previous === ""
    ) {

        return;

    }


    // Change operator
    if (
        current === "" &&
        previous !== ""
    ) {

        selectedOperator = operator;

        updateDisplay();

        return;

    }


    // Calculate previous operation
    if (
        previous !== "" &&
        selectedOperator !== null
    ) {

        calculate();

    }


    // Store current number
    previous = current;


    // Store operator
    selectedOperator = operator;


    // Clear current number
    current = "";


    resetScreen = false;


    updateDisplay();

}


// ========================================
// CALCULATE
// ========================================

function calculate() {

    // Check required values
    if (
        previous === "" ||
        current === "" ||
        selectedOperator === null
    ) {

        return;

    }


    const firstNumber =
        Number(previous);

    const secondNumber =
        Number(current);

    let result;


    // Perform calculation
    switch (selectedOperator) {

        case "+":

            result =
                firstNumber + secondNumber;

            break;


        case "-":

            result =
                firstNumber - secondNumber;

            break;


        case "*":

            result =
                firstNumber * secondNumber;

            break;


        case "/":

            if (secondNumber === 0) {

                current = "Error";

                previous = "";

                selectedOperator = null;

                resetScreen = true;

                updateDisplay();

                return;

            }


            result =
                firstNumber / secondNumber;

            break;


        case "%":

            result =
                firstNumber % secondNumber;

            break;


        default:

            return;

    }


    // Format result
    if (Number.isInteger(result)) {

        current =
            String(result);

    } else {

        current =
            String(
                Number(
                    result.toFixed(10)
                )
            );

    }


    // Save calculation
    const expression =
        `${firstNumber} ${getOperatorSymbol(selectedOperator)} ${secondNumber}`;


    addToHistory(
        expression,
        current
    );


    // Reset
    previous = "";

    selectedOperator = null;

    resetScreen = true;


    updateDisplay();

}


// ========================================
// CLEAR CALCULATOR
// ========================================

function clearCalculator() {

    current = "";

    previous = "";

    selectedOperator = null;

    resetScreen = false;


    updateDisplay();

}


// ========================================
// DELETE
// ========================================

function deleteNumber() {

    // Don't delete result
    if (resetScreen) {

        return;

    }


    current =
        current.slice(0, -1);


    updateDisplay();

}


// ========================================
// HISTORY
// ========================================

function addToHistory(
    expression,
    result
) {

    calculationHistory.unshift({

        expression: expression,

        result: result

    });


    // Keep only 10 calculations
    if (
        calculationHistory.length > 10
    ) {

        calculationHistory.pop();

    }


    displayHistory();

}


// ========================================
// DISPLAY HISTORY
// ========================================

function displayHistory() {

    if (
        calculationHistory.length === 0
    ) {

        historyList.innerHTML = `
            <p class="empty-history">
                No calculations yet
            </p>
        `;

        return;

    }


    historyList.innerHTML = "";


    calculationHistory.forEach(
        function(item) {

            const historyItem =
                document.createElement("div");


            historyItem.className =
                "history-item";


            const expression =
                document.createElement("div");


            expression.className =
                "history-expression";


            expression.textContent =
                item.expression;


            const result =
                document.createElement("div");


            result.className =
                "history-result";


            result.textContent =
                "= " + item.result;


            historyItem.appendChild(
                expression
            );


            historyItem.appendChild(
                result
            );


            historyList.appendChild(
                historyItem
            );

        }
    );

}


// ========================================
// OPEN / CLOSE HISTORY
// ========================================

historyBtn.addEventListener(
    "click",
    function() {

        historyPanel.classList.toggle(
            "show"
        );

    }
);


closeHistory.addEventListener(
    "click",
    function() {

        historyPanel.classList.remove(
            "show"
        );

    }
);


// ========================================
// CLEAR HISTORY
// ========================================

clearHistoryButton.addEventListener(
    "click",
    function() {

        calculationHistory = [];

        displayHistory();

    }
);


// ========================================
// NUMBER BUTTONS
// ========================================

const numberButtons =
    document.querySelectorAll(
        "[data-number]"
    );


numberButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                enterNumber(
                    button.dataset.number
                );

            }
        );

    }
);


// ========================================
// OPERATOR BUTTONS
// ========================================

const operatorButtons =
    document.querySelectorAll(
        "[data-operator]"
    );


operatorButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                selectOperator(
                    button.dataset.operator
                );

            }
        );

    }
);


// ========================================
// ACTION BUTTONS
// ========================================

const actionButtons =
    document.querySelectorAll(
        "[data-action]"
    );


actionButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                const action =
                    button.dataset.action;


                // Clear
                if (action === "clear") {

                    clearCalculator();

                }


                // Delete
                if (action === "delete") {

                    deleteNumber();

                }


                // Decimal
                if (action === "decimal") {

                    enterDecimal();

                }


                // Equals
                if (action === "equals") {

                    calculate();

                }

            }
        );

    }
);


// ========================================
// KEYBOARD SUPPORT
// ========================================

document.addEventListener(
    "keydown",
    function(event) {

        const key = event.key;


        // Numbers
        if (
            key >= "0" &&
            key <= "9"
        ) {

            enterNumber(key);

        }


        // Decimal
        else if (key === ".") {

            enterDecimal();

        }


        // Operators
        else if (
            key === "+" ||
            key === "-" ||
            key === "*" ||
            key === "/" ||
            key === "%"
        ) {

            selectOperator(key);

        }


        // Enter
        else if (
            key === "Enter" ||
            key === "="
        ) {

            event.preventDefault();

            calculate();

        }


        // Backspace
        else if (
            key === "Backspace"
        ) {

            deleteNumber();

        }


        // Escape / C
        else if (
            key === "Escape" ||
            key.toLowerCase() === "c"
        ) {

            clearCalculator();

        }

    }
);


// ========================================
// INITIALIZE
// ========================================

updateDisplay();

displayHistory();