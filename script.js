const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
    expression: '',
};

function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.expression || calculator.displayValue;
}

updateDisplay();

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    const { target } = event;
    const { value } = target;

    if (!target.matches('button')) {
        return;
    }

    if (value === '=') {
        handleOperator(value);
        return;
    }

    switch (value) {
        case '+':
        case '-':
        case '*':
        case '/':
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
});

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }

    calculator.expression += digit;
}

function inputDecimal(dot) {
    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
        calculator.expression += dot;
    }
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        calculator.expression = calculator.expression.slice(0, -1) + nextOperator;
        return;
    }

    if (firstOperand == null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);

        if (result === 'Nie można dzielić przez zero') {
            calculator.displayValue = result;
            calculator.expression = result;
            calculator.firstOperand = null;
            calculator.operator = null;
            calculator.waitingForSecondOperand = false;
            return;
        } else {
            calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
            calculator.firstOperand = result;
        }
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
    calculator.expression += nextOperator;

    if (nextOperator === '=') {
        calculator.expression = calculator.displayValue;
        calculator.firstOperand = null;
        calculator.operator = null;
        calculator.waitingForSecondOperand = false;
    }
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
});

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
    calculator.expression = '';
}

function deleteLastDigit() {
    if (calculator.displayValue.length > 1) {
        calculator.displayValue = calculator.displayValue.slice(0, -1);
        calculator.expression = calculator.expression.slice(0, -1);
    } else {
        calculator.displayValue = '0';
        calculator.expression = '';
    }
}

function negateValue() {
    if (calculator.displayValue !== '0') {
        calculator.displayValue = (parseFloat(calculator.displayValue) * -1).toString();
        calculator.expression = calculator.expression.replace(/-?\d+$/, calculator.displayValue);
    }
}
