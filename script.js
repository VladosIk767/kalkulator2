const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
    historyText: '',
};

function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.displayValue;
}

function updateHistory() {
    const history = document.querySelector('.operation-history-text');
    history.value = calculator.historyText;
}

updateDisplay();
updateHistory();

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    const { target } = event;
    const { value } = target;

    if (!target.matches('button')) {
        return;
    }

    switch (value) {
        case '+':
        case '-':
        case '*':
        case '/':
            handleOperator(value);
            break;
        case '=':
            handleOperator(value);
            break;
        case '.':
            inputDecimal(value);
            break;
        default:
            if (Number.isInteger(parseFloat(value))) {
                inputDigit(value);
            }
    }

    updateDisplay();
    updateHistory();
});

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

function inputDecimal(dot) {
    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator, historyText } = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator && calculator.waitingForSecondOperand)  {
        calculator.operator = nextOperator;
        return;
    }

    if (firstOperand == null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);
        calculator.historyText = `${historyText} ${displayValue} ${nextOperator}`;

        if (result === 'Nie można dzielić przez zero') {
            calculator.displayValue = result;
            calculator.firstOperand = null;
            calculator.operator = null;
            calculator.waitingForSecondOperand = false;
        } else {
            calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
            calculator.firstOperand = result;
        }
    } else {
        calculator.historyText = `${historyText} ${displayValue} ${nextOperator}`;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
}

function calculate(firstOperand, secondOperand, operator) {
    switch (operator) {
        case '+':
            return firstOperand + secondOperand;
        case '-':
            return firstOperand - secondOperand;
        case '*':
            return firstOperand * secondOperand;
        case '/':
            if (secondOperand === 0) {
                return 'Nie można dzielić przez zero';
            }
            return firstOperand / secondOperand;
        default:
            return secondOperand;
    }
}

const specialKeys = document.querySelector('.special-keys');
specialKeys.addEventListener('click', (event) => {
    const { target } = event;
    const { value } = target;

    if (!target.matches('button')) {
        return;
    }

    switch (value) {
        case 'negate':
            negateValue();
            break;
        case 'delete':
            deleteLastDigit();
            break;
        case 'all-clear':
            resetCalculator();
            break;
    }

    updateDisplay();
    updateHistory();
});

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
    calculator.historyText = '';
}

function deleteLastDigit() {
    calculator.displayValue = calculator.displayValue.slice(0, -1) || '0';
}

function negateValue() {
    calculator.displayValue = (parseFloat(calculator.displayValue) * -1).toString();
}
